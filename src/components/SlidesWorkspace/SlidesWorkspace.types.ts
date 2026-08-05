import type { AssignmentSet, TeacherFocus } from '@types'

export interface SlidesWorkspaceProps {
  assignmentSet: AssignmentSet
  /** Set by `AssignmentPanel`'s "Go to slide to learn more" link — consumed once, then cleared. */
  pendingSlideId?: number | null
  onConsumedPendingSlide?: () => void
  /** Switches to Practice and opens this assignment — wired from the parent view. */
  onNavigateToAssignment: (assignmentId: number) => void

  /** Last slide the caller had open (persisted) — seeds the initial selection alongside `pendingSlideId`. */
  initialSlideId?: number | null
  /** Fires whenever the active slide changes, so the caller can persist it. */
  onActiveSlideChange?: (slideId: number) => void

  isRailOpen: boolean
  onToggleRailOpen: () => void

  /** Teacher-only — omit both for the student instance. */
  focusedSlideId?: number | null
  onToggleFocusSlide?: (slideId: number) => void

  /**
   * Student-only — the teacher's live focus. Only an `'assignment'` focus
   * ever surfaces a banner here; a `'slide'` focus never does (browsing
   * Slides independently while the teacher talks is expected, not something
   * to nag about) — see `AssignmentPanel`/`useWorkspaceProgress` for the
   * mirror-image rule on the Practice side, where both kinds show a banner.
   */
  teacherFocus?: TeacherFocus
}
