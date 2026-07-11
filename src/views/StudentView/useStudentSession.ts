import { useEffect, useState } from 'react'
import type { Taskset } from '@types'
import type { JoinMode } from '@components'
import type { ToastTone } from '@components'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { fetchStudentTaskset } from '@lib/tasksetApi'

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
 * ⚠️ The join/solo bodies are MOCK — code `ABCD` succeeds and returns a Day-1
 * taskset; any other code shows an error toast. Real: `joinSession` over
 * SignalR returns the taskset for the room (see @lib/sessionHub).
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
    setDisplayName(name.trim())
    setIsJoining(true)
    // ── MOCK join — delete when SignalR is live ────────────────────────────────
    // Real: `const state = await joinSession({ code, studentId, displayName })`
    // and the taskset arrives from the socket. For now only "ABCD" succeeds.
    try {
      if (roomCode !== 'ABCD') {
        setToast({ message: 'Room not found — check the code and try again.', tone: 'error' })
        return
      }
      getStudentId() // ensure a persistent id exists before any submission
      setTaskset(await fetchStudentTaskset())
    } finally {
      setIsJoining(false)
    }
    // ── end MOCK ────────────────────────────────────────────────────────────────
  }

  async function handleStartSolo() {
    setDisplayName(name.trim())
    getStudentId() // ensure a persistent id exists before any solo submission
    setIsStartingSolo(true)
    // MOCK — real: request a solo taskset from the API. For now, Day-1 tasks.
    try {
      setTaskset(await fetchStudentTaskset())
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
