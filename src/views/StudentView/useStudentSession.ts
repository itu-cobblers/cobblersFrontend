import { useState } from 'react'
import { getStudentId, getDisplayName, setDisplayName } from '@lib/identity'
import { joinSession } from '@lib/sessionHub'

/**
 * Student side of the live room: name + room-code entry, best-effort join over
 * SignalR. The timer broadcast is logged (observable in DevTools); no UI yet.
 */
export function useStudentSession() {
  const [name, setName] = useState(getDisplayName)
  const [code, setCode] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roomCode = code.trim().toUpperCase()

  async function handleJoin() {
    setError(null)
    setDisplayName(name.trim())
    try {
      await joinSession(
        { code: roomCode, studentId: getStudentId(), displayName: name.trim() },
        { onTimerStarted: (timer) => console.info('[room] TimerStarted received', timer) },
      )
      setIsJoined(true)
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      console.warn('[room] join failed:', reason)
      setError('Could not join — is a session running?')
    }
  }

  return {
    name,
    code,
    isJoined,
    error,
    joinedLabel: `Joined room ${roomCode} as ${name.trim()}`,
    onNameChange: setName,
    onCodeChange: setCode,
    onJoin: handleJoin,
  }
}
