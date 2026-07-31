import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react'
import { getDisplayName, setDisplayName, sanitizeDisplayName, getStudentId } from '@lib/identity'
import { fetchTodayLatestSession, getSession, type SessionInfo } from '@lib/sessionApi'
import { upsertStudent } from '@lib/studentApi'
import { fetchSoloAssignmentSet, fetchAssignmentSet } from '@lib/assignmentSetApi'
import type { AssignmentSet } from '@types'

interface UseEntryPortalOptions {
  onJoinSuccess: (roomCode: string, displayName: string, set: AssignmentSet) => void
  onSoloSuccess: (set: AssignmentSet) => void
  onError: (message: string) => void
}

export function useEntryPortal({ onJoinSuccess, onSoloSuccess, onError }: UseEntryPortalOptions) {
  const [name, setName] = useState(getDisplayName)
  const [isReturningStudent] = useState(() => Boolean(getDisplayName()))
  const [isJoining, setIsJoining] = useState(false)
  const [isStartingSolo, setIsStartingSolo] = useState(false)
  const [todayLatestSession, setTodayLatestSession] = useState<SessionInfo | null | undefined>(undefined)

  useEffect(() => {
    fetchTodayLatestSession().then(setTodayLatestSession)
  }, [])

  function handleNameChange(value: string) {
    setName(sanitizeDisplayName(value))
  }

  function handleRefreshTodayLatestSession() {
    setTodayLatestSession(undefined)
    fetchTodayLatestSession().then(setTodayLatestSession)
  }

  async function handleJoinToday() {
    if (!todayLatestSession) return
    const displayName = name.trim()
    setDisplayName(displayName)
    setIsJoining(true)

    try {
      const roomCode = todayLatestSession.code
      const sessionInfo = await getSession(roomCode)
      if (!sessionInfo.assignmentSetId) throw new Error('room has no assignment set')

      await upsertStudent(displayName)
      const set = await fetchAssignmentSet(sessionInfo.assignmentSetId)

      onJoinSuccess(roomCode, displayName, set)
    } catch {
      onError('That session is no longer available — ask your teacher for a new code.')
      setTodayLatestSession(null)
    } finally {
      setIsJoining(false)
    }
  }

  async function handleStartSolo() {
    const displayName = name.trim()
    setDisplayName(displayName)
    getStudentId() // Ensure persistent ID exists
    setIsStartingSolo(true)

    try {
      await upsertStudent(displayName)
      const set = await fetchSoloAssignmentSet()

      onSoloSuccess(set)
    } catch {
      onError('Could not load the assignments — please try again in a moment.')
    } finally {
      setIsStartingSolo(false)
    }
  }

  return {
    name,
    isReturningStudent,
    todayLatestSessionCode: todayLatestSession?.code ?? (todayLatestSession === undefined ? undefined : null),
    isJoining,
    isStartingSolo,
    onNameChange: handleNameChange,
    onJoinToday: handleJoinToday,
    onStartSolo: handleStartSolo,
    onRefreshTodayLatestSession: handleRefreshTodayLatestSession,
  }
}


/**
 * Tracks the real cursor position inside the name input so the fake
 * `.bootit-caret` bar (the native caret is hidden via `caret-color:
 * transparent` for the terminal look) tracks where the student is actually
 * typing instead of always sitting after the last character.
 *
 * Measures the pixel offset with a hidden mirror span that shares the
 * input's font styling, so it stays correct regardless of font/tracking.
 * Also goes solid (`isActive`) while the student is actively typing or
 * moving the cursor, only resuming its blink once idle — a blinking bar
 * sitting mid-word while you're still editing reads as broken, not alive.
 */

/** How long the caret stays solid after typing/moving before it resumes blinking — mirrors how OS/editor carets behave. */
const CARET_IDLE_BEFORE_BLINK_MS = 500

export function useNameCaret(name: string) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mirrorRef = useRef<HTMLSpanElement>(null)
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [caretIndex, setCaretIndex] = useState(name.length)
  const [caretLeft, setCaretLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)

  function handleCaretSync(event: SyntheticEvent<HTMLInputElement>) {
    const position = event.currentTarget.selectionStart
    setCaretIndex(position === null ? event.currentTarget.value.length : position)
    setIsActive(true)
    clearTimeout(idleTimeoutRef.current)
    idleTimeoutRef.current = setTimeout(() => setIsActive(false), CARET_IDLE_BEFORE_BLINK_MS)
  }

  useEffect(() => () => clearTimeout(idleTimeoutRef.current), [])

  useLayoutEffect(() => {
    const mirror = mirrorRef.current
    if (!mirror) return
    const clampedIndex = Math.min(caretIndex, name.length)
    mirror.textContent = name.slice(0, clampedIndex)
    setCaretLeft(mirror.offsetWidth)
  }, [name, caretIndex])

  return { inputRef, mirrorRef, caretLeft, isActive, handleCaretSync }
}
