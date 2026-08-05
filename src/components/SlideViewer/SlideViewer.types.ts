import type { SlidePage } from '@types'

export interface SlideViewerProps {
  slide: SlidePage | undefined
  /** Present only when the slide has a `relatedAssignmentId` — "Try this now". */
  onNavigateToAssignment?: (assignmentId: number) => void
}
