/**
 * Persists the student workspace's own UI state — which rail tab is active,
 * which assignment/history item is selected, and whether the rail is
 * folded — so a page refresh lands back where the student left off instead
 * of resetting to assignment #1 with the rail open. Content itself (the
 * assignment set, submission history) is always re-fetched live; only the
 * "where was I looking" pointer lives here.
 */
const KEY = 'bootit.studentWorkspaceUI'

export interface PersistedWorkspaceUI {
  isRailOpen: boolean
  railTab: 'session' | 'history'
  selectedAssignmentId: number | null
}

export function getPersistedWorkspaceUI(): PersistedWorkspaceUI | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { isRailOpen, railTab, selectedAssignmentId } = parsed as Record<string, unknown>
    if (typeof isRailOpen !== 'boolean') return null
    if (railTab !== 'session' && railTab !== 'history') return null
    if (selectedAssignmentId !== null && typeof selectedAssignmentId !== 'number') return null
    return { isRailOpen, railTab, selectedAssignmentId }
  } catch {
    return null
  }
}

export function setPersistedWorkspaceUI(state: PersistedWorkspaceUI): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
