import { useEffect, useState } from 'react'
import type { Taskset } from '@types'
import type { JoinMode } from '@components'
import type { ToastTone } from '@components'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { getSession } from '@lib/sessionApi'
import { joinSession } from '@lib/sessionHub'
import { fetchStudentTaskset, fetchTaskset } from '@lib/tasksetApi'

interface Toast {
  message: string
  tone: ToastTone
}

const TOAST_DURATION_MS = 3500

/**
 * Student entry: pick a display name, then either Join a class (needs a class
 * code) or Solo Practice. Both resolve to a `taskset` that the caller uses to
 * reveal the IDE. Until then the student sees the entry screen.
 *
 * Join: GET /api/sessions/:code resolves the room's taskset (404 ⇒ toast),
 * then the SignalR JoinSession is attempted best-effort (roster + timer) —
 * content still loads if the hub hiccups. Solo: the hardcoded all-tasks set.
 */
export function useStudentSession() {
  const [name, setName] = useState(getDisplayName)
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<JoinMode>('join')
  const [taskset, setTaskset] = useState<Taskset | null>(null)
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
      if (!session.tasksetId) throw new Error('room has no taskset')

      const studentId = getStudentId() // ensure a persistent id exists before any submission
      // Best-effort room membership (teacher roster + timer broadcasts); the
      // taskset comes from REST either way.
      joinSession({ code: roomCode, studentId, displayName }).catch((err: unknown) => {
        console.warn('[join] hub join failed:', err instanceof Error ? err.message : String(err))
      })

      setTaskset(await fetchTaskset(session.tasksetId))
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
      setTaskset(await fetchStudentTaskset())
    } catch {
      setToast({ message: 'Could not load the tasks — please try again in a moment.', tone: 'error' })
    } finally {
      setIsStartingSolo(false)
    }
  }

  function handleModeChange(next: JoinMode) {
    setToast(null)
    setMode(next)
  }

  return {
    taskset,
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
