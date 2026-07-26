import { useState } from 'react'

/**
 * The hint starts folded and re-folds whenever the underlying hint text
 * changes (i.e. the student switched assignments) so it never leaks open
 * into the next task. Reset happens during render (React's supported reset
 * pattern) rather than an effect, so the fold is correct on the very first
 * paint after switching.
 */
export function useHintDisclosure(hint: string | undefined): [boolean, () => void] {
  const [prevHint, setPrevHint] = useState(hint)
  const [isExpanded, setIsExpanded] = useState(false)

  if (hint !== prevHint) {
    setPrevHint(hint)
    setIsExpanded(false)
  }

  function toggle() {
    setIsExpanded((previous) => !previous)
  }

  return [isExpanded, toggle]
}
