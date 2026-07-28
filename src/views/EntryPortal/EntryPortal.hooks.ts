import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react'

/** How long the caret stays solid after typing/moving before it resumes blinking — mirrors how OS/editor carets behave. */
const CARET_IDLE_BEFORE_BLINK_MS = 500

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
