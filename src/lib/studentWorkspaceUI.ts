/**
 * Persists the student workspace's own UI state — which top-level tab
 * (Slides/Practice) is active, which rail tab/assignment/slide is selected,
 * and whether each rail is folded — so a page refresh lands back where the
 * student left off instead of resetting to Slides #1 with both rails open.
 * Content itself (the assignment set, submission history, slides) is always
 * re-fetched live; only the "where was I looking" pointer lives here.
 *
 * Every field is optional and read leniently (present-and-valid or treated as
 * absent, never rejecting the whole blob) so a partial write from one caller
 * — the Practice tab's position and the Slides tab's position are owned by
 * different components that are never mounted at the same time — never wipes
 * out a field the other caller owns. `setPersistedWorkspaceUI` is a
 * read-merge-write patch for the same reason: two independent effects
 * writing to this one key must not clobber each other's most recent field.
 */
const KEY = 'bootit.studentWorkspaceUI'

export interface PersistedWorkspaceUI {
  isRailOpen?: boolean
  railTab?: 'session' | 'history'
  selectedAssignmentId?: number | null
  /** Top-level tab — which of Slides/Practice was last active. */
  viewMode?: 'slides' | 'practice'
  /** Last-viewed Slides page, independent of `selectedAssignmentId`. */
  lastSlideId?: number | null
}

export function getPersistedWorkspaceUI(): PersistedWorkspaceUI | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const p = parsed as Record<string, unknown>
    const result: PersistedWorkspaceUI = {}
    if (typeof p.isRailOpen === 'boolean') result.isRailOpen = p.isRailOpen
    if (p.railTab === 'session' || p.railTab === 'history') result.railTab = p.railTab
    if (p.selectedAssignmentId === null || typeof p.selectedAssignmentId === 'number') {
      result.selectedAssignmentId = p.selectedAssignmentId
    }
    if (p.viewMode === 'slides' || p.viewMode === 'practice') result.viewMode = p.viewMode
    if (p.lastSlideId === null || typeof p.lastSlideId === 'number') result.lastSlideId = p.lastSlideId
    return result
  } catch {
    return null
  }
}

/** Read-merge-write — a patch, not a full replace, so independent callers can each own a slice of this blob. */
export function setPersistedWorkspaceUI(patch: PersistedWorkspaceUI): void {
  const current = getPersistedWorkspaceUI() ?? {}
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }))
}
