import { useEffect, useState } from 'react'
import type { AssignmentSet } from '@types'
import type { JoinMode } from '@components'
import type { ToastTone } from '@components'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { getSession } from '@lib/sessionApi'
import { joinSession } from '@lib/sessionHub'
import { fetchStudentAssignmentSet, fetchAssignmentSet } from '@lib/assignmentSetApi'

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
  const [name, setName] = useState(getDisplayName)
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<JoinMode>('join')
  const [assignmentSet, setAssignmentSet] = useState<AssignmentSet | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isStartingSolo, setIsStartingSolo] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

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

  return {
    assignmentSet,
    toast,
    dismissToast,
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
