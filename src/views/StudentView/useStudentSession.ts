import { useEffect, useState } from 'react'
import type { AssignmentSet } from '@types'
import type { JoinMode } from '@components'
import type { ToastTone } from '@components'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { getSession } from '@lib/sessionApi'
import { joinSession } from '@lib/sessionHub'
import { fetchStudentAssignmentSet, fetchAssignmentSet } from '@lib/assignmentSetApi'
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

  // Rehydrate a persisted join/solo session on mount so a refresh resumes the
  // IDE instead of dropping back to the entry screen. Assignment content is
  // always re-fetched live — only the join-state pointer is persisted.
  useEffect(() => {
    if (!persistedSession) return

    if (persistedSession.mode === 'solo') {
      fetchStudentAssignmentSet()
        .then((set) => setAssignmentSet(set))
        .catch(() => {
          clearPersistedStudentSession()
          setToast({ message: 'Could not resume your session — please start again.', tone: 'error' })
        })
        .finally(() => setIsRestoring(false))
      return
    }

    getSession(persistedSession.code)
      .then(async (session) => {
        if (!session.assignmentSetId) throw new Error('room has no assignment set')
        const studentId = getStudentId()
        joinSession({ code: persistedSession.code, studentId, displayName: getDisplayName() }).catch(
          (err: unknown) => {
            console.warn('[join] hub join failed:', err instanceof Error ? err.message : String(err))
          },
        )
        setAssignmentSet(await fetchAssignmentSet(session.assignmentSetId))
      })
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
      const session = await getSession(roomCode) // 404 ⇒ no such room
      if (!session.assignmentSetId) throw new Error('room has no assignment set')

      const studentId = getStudentId() // ensure a persistent id exists before any submission
      // Best-effort room membership (teacher roster + timer broadcasts); the
      // assignment set comes from REST either way.
      joinSession({ code: roomCode, studentId, displayName }).catch((err: unknown) => {
        console.warn('[join] hub join failed:', err instanceof Error ? err.message : String(err))
      })

      setAssignmentSet(await fetchAssignmentSet(session.assignmentSetId))
      setPersistedStudentSession({ mode: 'join', code: roomCode })
    } catch {
      setToast({ message: 'Room not found — check the code and try again.', tone: 'error' })
    } finally {
      setIsJoining(false)
    }
  }

  async function handleStartSolo() {
    setDisplayName(name.trim())
    getStudentId() // ensure a persistent id exists before any solo submission
    setIsStartingSolo(true)
    try {
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
  }
}
