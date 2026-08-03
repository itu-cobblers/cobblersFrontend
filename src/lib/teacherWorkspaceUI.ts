/**
 * Persists the teacher workspace's own UI state — which assignment is
 * selected and whether the rail is folded — so a page refresh lands back
 * where the teacher left off. Content itself (roster, submissions) is
 * always re-fetched live; only the "where was I looking" pointer lives here.
 */
const KEY = 'bootit.teacherWorkspaceUI'

export interface PersistedTeacherWorkspaceUI {
  isRailOpen: boolean
  selectedAssignmentId: number | null
}

export function getPersistedTeacherWorkspaceUI(): PersistedTeacherWorkspaceUI | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { isRailOpen, selectedAssignmentId } = parsed as Record<string, unknown>
    if (typeof isRailOpen !== 'boolean') return null
    if (selectedAssignmentId !== null && typeof selectedAssignmentId !== 'number') return null
    return { isRailOpen, selectedAssignmentId }
  } catch {
    return null
  }
}

export function setPersistedTeacherWorkspaceUI(state: PersistedTeacherWorkspaceUI): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}
