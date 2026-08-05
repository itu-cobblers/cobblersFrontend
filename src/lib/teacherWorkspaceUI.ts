/**
 * Persists the teacher workspace's own UI state — which top-level tab
 * (Slides/Practice) is active, which assignment/slide is selected, and
 * whether each rail is folded — so a page refresh lands back where the
 * teacher left off. Content itself (roster, submissions) is always
 * re-fetched live; only the "where was I looking" pointer lives here.
 *
 * Every field is optional and read leniently (present-and-valid or treated as
 * absent) so a partial write from one caller never wipes out a field another
 * caller owns — see `studentWorkspaceUI.ts` for the fuller rationale, which
 * this mirrors. `setPersistedTeacherWorkspaceUI` is a read-merge-write patch
 * for the same reason.
 */
const KEY = 'bootit.teacherWorkspaceUI'

export interface PersistedTeacherWorkspaceUI {
  isRailOpen?: boolean
  selectedAssignmentId?: number | null
  /** Top-level tab — which of Slides/Practice was last active. */
  viewMode?: 'slides' | 'practice'
  /** Last-viewed Slides page, independent of `selectedAssignmentId`. */
  lastSlideId?: number | null
  /** Slides tab's own rail, independent of `isRailOpen` (Practice's rail). */
  slidesRailOpen?: boolean
}

export function getPersistedTeacherWorkspaceUI(): PersistedTeacherWorkspaceUI | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const p = parsed as Record<string, unknown>
    const result: PersistedTeacherWorkspaceUI = {}
    if (typeof p.isRailOpen === 'boolean') result.isRailOpen = p.isRailOpen
    if (p.selectedAssignmentId === null || typeof p.selectedAssignmentId === 'number') {
      result.selectedAssignmentId = p.selectedAssignmentId
    }
    if (p.viewMode === 'slides' || p.viewMode === 'practice') result.viewMode = p.viewMode
    if (p.lastSlideId === null || typeof p.lastSlideId === 'number') result.lastSlideId = p.lastSlideId
    if (typeof p.slidesRailOpen === 'boolean') result.slidesRailOpen = p.slidesRailOpen
    return result
  } catch {
    return null
  }
}

/** Read-merge-write — a patch, not a full replace, so independent callers can each own a slice of this blob. */
export function setPersistedTeacherWorkspaceUI(patch: PersistedTeacherWorkspaceUI): void {
  const current = getPersistedTeacherWorkspaceUI() ?? {}
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }))
}
