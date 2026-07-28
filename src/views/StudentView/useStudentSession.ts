import { useEffect, useRef, useState } from 'react'
import type { AssignmentSet, SubmissionHistoryItem } from '@types'
import type { JoinMode } from '@components'
import type { ToastTone } from '@components'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { upsertStudent } from '@lib/studentApi'
import { getSession, fetchTodayLatestSession, type SessionInfo } from '@lib/sessionApi'
import { joinSession, type Timer } from '@lib/sessionHub'
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
// The teacher's "end session" broadcast reaches the student slightly before
// the backend's own today-latest lookup stops returning that room (API lag)
// — an immediate re-fetch right after bouncing to the entry screen would
// just get the same, now-stale, code back. Wait this long before retrying.
const SESSION_ENDED_REFETCH_DELAY_MS = 2000

/**
 * Student entry: pick a display name, then either join today's session (one
 * click — no code to type, see `todayLatestSession`) or start Solo Practice.
 * Both resolve to an `assignmentSet` that the caller uses to reveal the IDE.
 * Until then the student sees the entry screen.
 *
 * Join: GET /api/sessions/:code resolves the room's assignment set (404 ⇒ toast),
 * then the SignalR JoinSession is attempted best-effort (roster + timer) —
 * content still loads if the hub hiccups. Solo: the hardcoded all-assignments set.
 *
 * Also owns two cross-day concerns that don't depend on which screen is
 * showing (entry or IDE): `GET /api/sessions/today-latest` (today's newest
 * still-active room, so the entry screen can offer a one-click join) and the
 * student's full submission history — both fetched once identity exists,
 * regardless of join/solo/no-session-yet.
 */
export function useStudentSession() {
  // Read once on mount; drives the lazy initial state below and the rehydrate effect.
  const [persistedSession] = useState(getPersistedStudentSession)
  // A non-empty saved name means this browser has been through entry before —
  // drives the "Welcome back" vs "Welcome to bootIT" headline, nothing more.
  const [isReturningStudent] = useState(() => Boolean(getDisplayName()))
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
  // Today's newest still-active room — powers the entry screen's one-click
  // "Join session (CODE)" button; `undefined` while loading, `null` once
  // resolved to "nothing to join today".
  const [todayLatestSession, setTodayLatestSession] = useState<SessionInfo | null | undefined>(undefined)
  // The assignment the teacher is currently focused on, broadcast over the
  // hub (best-effort — join-mode only, `null` in solo practice or offline).
  const [teacherFocusedAssignmentId, setTeacherFocusedAssignmentId] = useState<number | null>(null)
  // The room's active per-assignment countdown (join-mode only, `null` in
  // solo practice, offline, or once none is running). See @lib/sessionHub.
  const [activeTimer, setActiveTimer] = useState<Timer | null>(null)
  // Tracks the delayed re-fetch scheduled after a session-ended bounce, so it
  // can be cancelled if the view unmounts before it fires.
  const sessionEndedRefetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (sessionEndedRefetchTimer.current !== null) clearTimeout(sessionEndedRefetchTimer.current)
    }
  }, [])

  /** Re-checks today-latest on demand — the entry screen's refresh button. */
  function handleRefreshTodayLatestSession() {
    setTodayLatestSession(undefined)
    fetchTodayLatestSession().then(setTodayLatestSession)
  }

  async function joinRoom(roomCode: string, displayName: string) {
    const session = await getSession(roomCode) // 404 ⇒ no such room
    if (!session.assignmentSetId) throw new Error('room has no assignment set')

    const studentId = getStudentId() // ensure a persistent id exists before any submission
    await upsertStudent(displayName)
    // Best-effort room membership (teacher roster + timer + "teacher moved
    // to" broadcasts); the assignment set comes from REST either way.
    joinSession(
      { code: roomCode, studentId, displayName },
      {
        onTimerStarted: setActiveTimer,
        onAssignmentFocused: setTeacherFocusedAssignmentId,
        onSessionEnded: handleSessionEnded,
      },
    ).catch((err: unknown) => {
      console.warn('[join] hub join failed:', err instanceof Error ? err.message : String(err))
    })

    setAssignmentSet(await fetchAssignmentSet(session.assignmentSetId))
    setPersistedStudentSession({ mode: 'join', code: roomCode })
    setMode('join')
    setCode(roomCode)
  }

  /** The teacher ended the room — bounce back to the entry screen with an explanation. */
  function handleSessionEnded() {
    handleLeaveSession()
    setToast({ message: 'This session has ended — ask your teacher for the new code.', tone: 'error' })
    // Show "checking…" instead of leaving the just-ended code on screen, and
    // only re-fetch after a short delay — see SESSION_ENDED_REFETCH_DELAY_MS.
    setTodayLatestSession(undefined)
    if (sessionEndedRefetchTimer.current !== null) clearTimeout(sessionEndedRefetchTimer.current)
    sessionEndedRefetchTimer.current = setTimeout(() => {
      fetchTodayLatestSession().then(setTodayLatestSession)
    }, SESSION_ENDED_REFETCH_DELAY_MS)
  }

  // Fetch the cross-day review data once identity exists — regardless of
  // whether the student ends up joining a room, going solo, or is still on
  // the entry screen. `fetchSubmissionHistory` isn't built on the backend yet
  // (S5); it degrades to "nothing yet" on failure, so this can never block entry.
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
    fetchTodayLatestSession().then(setTodayLatestSession)
    // Runs once on mount — identity is stable for the lifetime of this view.
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
    // `joinRoom` is recreated every render (it closes over no memoized
    // deps) — this is a mount-only rehydrate keyed on the stable
    // `persistedSession` value, not on `joinRoom` identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistedSession])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast])

  function dismissToast() {
    setToast(null)
  }

  /** One-click join of today's session — no code to type, see `todayLatestSession`. */
  async function handleJoinToday() {
    if (!todayLatestSession) return
    const displayName = name.trim()
    setDisplayName(displayName)
    setIsJoining(true)
    try {
      await joinRoom(todayLatestSession.code, displayName)
    } catch {
      setToast({ message: 'That session is no longer available — ask your teacher for a new code.', tone: 'error' })
      setTodayLatestSession(null)
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

  function handleLeaveSession() {
    clearPersistedStudentSession()
    setAssignmentSet(null)
    setCode('')
    setTeacherFocusedAssignmentId(null)
    setActiveTimer(null)
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
      /** `true` once the student has joined a room (as opposed to solo practice) — drives per-kind answer-reveal rules. */
      isInRoom: mode === 'join',
      /** The assignment id the teacher is currently focused on; `null` outside a room. */
      teacherFocusedAssignmentId: mode === 'join' ? teacherFocusedAssignmentId : null,
      /** The room's active per-assignment countdown; `null` outside a room or once none is running. */
      activeTimer: mode === 'join' ? activeTimer : null,
    },
    entry: {
      name,
      isReturningStudent,
      /** `undefined` while the today-latest lookup is in flight, `null` once resolved to "none". */
      todayLatestSessionCode: todayLatestSession?.code ?? (todayLatestSession === undefined ? undefined : null),
      isJoining,
      isStartingSolo,
      onNameChange: setName,
      onJoinToday: handleJoinToday,
      onStartSolo: handleStartSolo,
      onRefreshTodayLatestSession: handleRefreshTodayLatestSession,
    },
    progress: {
      isLoading: isHistoryLoading,
      catalog: catalog?.assignments ?? [],
      history: submissionHistory,
      onRefresh: refreshHistory,
    },
  }
}
