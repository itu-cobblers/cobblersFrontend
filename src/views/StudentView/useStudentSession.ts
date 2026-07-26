import { useEffect, useState } from 'react'
import type { AssignmentSet, ResumeSuggestion, SubmissionHistoryItem } from '@types'
import type { JoinMode } from '@components'
import type { ToastTone } from '@components'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { upsertStudent } from '@lib/studentApi'
import { getSession, fetchResumeSuggestion } from '@lib/sessionApi'
import { joinSession } from '@lib/sessionHub'
import { fetchStudentAssignmentSet, fetchAssignmentSet } from '@lib/assignmentSetApi'
import { fetchSubmissionHistory } from '@lib/submissionApi'
import {
  getPersistedStudentSession,
  setPersistedStudentSession,
  clearPersistedStudentSession,
} from '@lib/studentSession'

interface Toast {
  message: string
  tone: ToastTone
}

const TOAST_DURATION_MS = 3500

/**
 * Student entry: pick a display name, then either Join a class (needs a class
 * code) or Solo Practice. Both resolve to an `assignmentSet` that the caller uses to
 * reveal the IDE. Until then the student sees the entry screen.
 *
 * Join: GET /api/sessions/:code resolves the room's assignment set (404 ⇒ toast),
 * then the SignalR JoinSession is attempted best-effort (roster + timer) —
 * content still loads if the hub hiccups. Solo: the hardcoded all-assignments set.
 *
 * Also owns two cross-day concerns that don't depend on which screen is
 * showing (entry or IDE): the "welcome back, join today's session?" resume
 * prompt (CONTRACT.md S9) and the student's full submission history — both
 * fetched once identity exists, regardless of join/solo/no-session-yet.
 */
export function useStudentSession() {
  // Read once on mount; drives the lazy initial state below and the rehydrate effect.
  const [persistedSession] = useState(getPersistedStudentSession)
  const [name, setName] = useState(getDisplayName)
  const [code, setCode] = useState(() => (persistedSession?.mode === 'join' ? persistedSession.code : ''))
  const [mode, setMode] = useState<JoinMode>(() => (persistedSession?.mode === 'solo' ? 'solo' : 'join'))
  const [assignmentSet, setAssignmentSet] = useState<AssignmentSet | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isStartingSolo, setIsStartingSolo] = useState(false)
  const [isRestoring, setIsRestoring] = useState(persistedSession !== null)
  const [toast, setToast] = useState<Toast | null>(null)

  // Cross-day review state — backs the IDE rail's History tab regardless of
  // which room/solo session is currently active.
  const [catalog, setCatalog] = useState<AssignmentSet | null>(null)
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [resumeSuggestion, setResumeSuggestion] = useState<ResumeSuggestion | null>(null)
  const [isAcceptingSuggestion, setIsAcceptingSuggestion] = useState(false)
  // The assignment the teacher is currently focused on, broadcast over the
  // hub (best-effort — join-mode only, `null` in solo practice or offline).
  const [teacherFocusedAssignmentId, setTeacherFocusedAssignmentId] = useState<number | null>(null)

  async function joinRoom(roomCode: string, displayName: string) {
    const session = await getSession(roomCode) // 404 ⇒ no such room
    if (!session.assignmentSetId) throw new Error('room has no assignment set')

    const studentId = getStudentId() // ensure a persistent id exists before any submission
    await upsertStudent(displayName)
    // Best-effort room membership (teacher roster + timer + "teacher moved
    // to" broadcasts); the assignment set comes from REST either way.
    joinSession(
      { code: roomCode, studentId, displayName },
      { onAssignmentFocused: setTeacherFocusedAssignmentId },
    ).catch((err: unknown) => {
      console.warn('[join] hub join failed:', err instanceof Error ? err.message : String(err))
    })

    setAssignmentSet(await fetchAssignmentSet(session.assignmentSetId))
    setPersistedStudentSession({ mode: 'join', code: roomCode })
    setMode('join')
    setCode(roomCode)
  }

  // Fetch the cross-day review data once identity exists — regardless of
  // whether the student ends up joining a room, going solo, or is still on
  // the entry screen. Neither call is built on the backend yet (S5/S9); both
  // degrade to "nothing yet" on failure, so this can never block entry.
  useEffect(() => {
    const studentId = getStudentId()
    // isHistoryLoading already starts `true` — nothing to set synchronously here.
    fetchSubmissionHistory(studentId)
      .then(setSubmissionHistory)
      .finally(() => setIsHistoryLoading(false))
    fetchStudentAssignmentSet()
      .then(setCatalog)
      .catch(() => {
        /* the My Progress panel just shows nothing yet */
      })
    fetchResumeSuggestion(studentId).then((suggested) => {
      // Don't nag about the room the student is already in.
      if (suggested && persistedSession?.mode === 'join' && persistedSession.code === suggested.code) return
      setResumeSuggestion(suggested)
    })
    // Runs once on mount — identity is stable for the lifetime of this view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Rehydrate a persisted join/solo session on mount so a refresh resumes the
  // IDE instead of dropping back to the entry screen. Assignment content is
  // always re-fetched live — only the join-state pointer is persisted.
  useEffect(() => {
    if (!persistedSession) return

    if (persistedSession.mode === 'solo') {
      upsertStudent(getDisplayName())
        .then(() => fetchStudentAssignmentSet())
        .then((set) => setAssignmentSet(set))
        .catch(() => {
          clearPersistedStudentSession()
          setToast({ message: 'Could not resume your session — please start again.', tone: 'error' })
        })
        .finally(() => setIsRestoring(false))
      return
    }

    // `joinRoom` is async and awaits before ever touching state — the actual
    // setState calls are all post-await (safe), but the lint rule can't see
    // through a call to a function defined elsewhere in this file and flags
    // it as if it ran synchronously. Known false positive, see
    // https://github.com/facebook/react/issues/34905.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    joinRoom(persistedSession.code, getDisplayName())
      .catch(() => {
        clearPersistedStudentSession()
        setToast({ message: 'Room no longer available — please rejoin.', tone: 'error' })
      })
      .finally(() => setIsRestoring(false))
  }, [persistedSession])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast])

  function dismissToast() {
    setToast(null)
  }

  async function handleJoin() {
    const roomCode = code.trim().toUpperCase()
    const displayName = name.trim()
    setDisplayName(displayName)
    setIsJoining(true)
    try {
      await joinRoom(roomCode, displayName)
    } catch {
      setToast({ message: 'Room not found — check the code and try again.', tone: 'error' })
    } finally {
      setIsJoining(false)
    }
  }

  async function handleStartSolo() {
    const displayName = name.trim()
    setDisplayName(displayName)
    getStudentId() // ensure a persistent id exists before any solo submission
    setIsStartingSolo(true)
    try {
      await upsertStudent(displayName)
      setAssignmentSet(await fetchStudentAssignmentSet())
      setPersistedStudentSession({ mode: 'solo' })
    } catch {
      setToast({ message: 'Could not load the assignments — please try again in a moment.', tone: 'error' })
    } finally {
      setIsStartingSolo(false)
    }
  }

  function handleModeChange(next: JoinMode) {
    setToast(null)
    setMode(next)
  }

  function handleLeaveSession() {
    clearPersistedStudentSession()
    setAssignmentSet(null)
    setCode('')
    setTeacherFocusedAssignmentId(null)
  }

  async function handleAcceptResumeSuggestion() {
    if (!resumeSuggestion) return
    setIsAcceptingSuggestion(true)
    try {
      await joinRoom(resumeSuggestion.code, name.trim() || getDisplayName())
      setResumeSuggestion(null)
    } catch {
      setToast({ message: 'Could not join that session — please use the code manually.', tone: 'error' })
    } finally {
      setIsAcceptingSuggestion(false)
    }
  }

  function handleDismissResumeSuggestion() {
    setResumeSuggestion(null)
  }

  // Refetches this student's full submission history — called after every
  // submit attempt in the IDE so the rail's History tab and the assignment
  // panel's Submissions tab both reflect it right away.
  function refreshHistory() {
    setIsHistoryLoading(true)
    fetchSubmissionHistory(getStudentId())
      .then(setSubmissionHistory)
      .finally(() => setIsHistoryLoading(false))
  }

  return {
    assignmentSet,
    isRestoring,
    toast,
    dismissToast,
    session: {
      label: mode === 'solo' ? 'Solo practice' : `Room: ${code}`,
      actionLabel: mode === 'solo' ? 'Exit' : 'Leave',
      onLeave: handleLeaveSession,
      /** Raw join code, only meaningful in 'join' mode — for tagging submissions. */
      code: mode === 'join' ? code : undefined,
      displayName: getDisplayName(),
      /** The assignment id the teacher is currently focused on; `null` outside a room. */
      teacherFocusedAssignmentId: mode === 'join' ? teacherFocusedAssignmentId : null,
    },
    entry: {
      name,
      code,
      mode,
      isJoining,
      isStartingSolo,
      onNameChange: setName,
      onCodeChange: setCode,
      onModeChange: handleModeChange,
      onJoin: handleJoin,
      onStartSolo: handleStartSolo,
    },
    resume: resumeSuggestion && {
      displayName: getDisplayName(),
      code: resumeSuggestion.code,
      assignmentSetDisplayTitle: resumeSuggestion.assignmentSetDisplayTitle,
      isJoining: isAcceptingSuggestion,
      onJoin: handleAcceptResumeSuggestion,
      onDismiss: handleDismissResumeSuggestion,
    },
    progress: {
      isLoading: isHistoryLoading,
      catalog: catalog?.assignments ?? [],
      history: submissionHistory,
      onRefresh: refreshHistory,
    },
  }
}
