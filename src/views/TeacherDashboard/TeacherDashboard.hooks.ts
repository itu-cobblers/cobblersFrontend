import { useState } from 'react'
import { createSession, startTimer } from '@lib/sessionApi'
import { observeSession, type Student } from '@lib/sessionHub'
import { revokeTeacher } from '@lib/teacherAuth'

/** Owns the teacher session + timer lifecycle, the request state, and the live roster. */
export function useTeacherSession() {
  const [sessionCode, setSessionCode] = useState<string | null>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const [roster, setRoster] = useState<Student[]>([])

  const [minutes, setMinutes] = useState(10)
  const [isStartingTimer, setIsStartingTimer] = useState(false)
  const [timerEndsAt, setTimerEndsAt] = useState<string | null>(null)
  const [timerError, setTimerError] = useState<string | null>(null)

  function observe(code: string) {
    // Best-effort: if the hub is unreachable the dashboard still works.
    observeSession(code, {
      onRoster: (students) => setRoster(students),
      onStudentJoined: (student) =>
        setRoster((prev) =>
          prev.some((s) => s.studentId === student.studentId) ? prev : [...prev, student],
        ),
    }).catch((err: unknown) => {
      const reason = err instanceof Error ? err.message : String(err)
      console.warn('[room] observe failed:', reason)
    })
  }

  async function handleCreateSession() {
    setIsCreatingSession(true)
    setSessionError(null)
    try {
      const session = await createSession()
      setSessionCode(session.code)
      observe(session.code)
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsCreatingSession(false)
    }
  }

  async function handleStartTimer() {
    if (!sessionCode) return
    setIsStartingTimer(true)
    setTimerError(null)
    try {
      const timer = await startTimer(sessionCode, minutes)
      setTimerEndsAt(timer.endsAt)
    } catch (err) {
      setTimerError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsStartingTimer(false)
    }
  }

  function handleMinutesChange(value: string) {
    setMinutes(Number(value))
  }

  function handleLogout() {
    revokeTeacher()
    window.location.reload()
  }

  return {
    sessionCode,
    isCreatingSession,
    sessionError,
    roster,
    minutes,
    isStartingTimer,
    timerEndsAt,
    timerError,
    handleCreateSession,
    handleStartTimer,
    handleMinutesChange,
    handleLogout,
  }
}
