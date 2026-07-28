import { useState } from 'react'

/**
 * A collapsible section that starts folded and re-folds whenever `resetKey`
 * changes (i.e. the student switched assignments) so it never leaks open
 * into the next task. Reset happens during render (React's supported reset
 * pattern) rather than an effect, so the fold is correct on the very first
 * paint after switching. Despite the name (kept for `TeacherAssignmentPanel`,
 * which imports this same hook), it backs any single collapsible section —
 * the Hint disclosure (keyed on the hint text) and the project "Set up your
 * Java environment" disclosure (keyed on the assignment title) both use it.
 */
export function useHintDisclosure(resetKey: unknown): [boolean, () => void] {
  const [prevKey, setPrevKey] = useState(resetKey)
  const [isExpanded, setIsExpanded] = useState(false)

  if (resetKey !== prevKey) {
    setPrevKey(resetKey)
    setIsExpanded(false)
  }

  function toggle() {
    setIsExpanded((previous) => !previous)
  }

  return [isExpanded, toggle]
}
