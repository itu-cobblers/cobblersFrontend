export interface SlideViewerProps {
  pdfSrc: string
  pageNumber: number
  /** 0 until the PDF has loaded — see `onLoadSuccess`. */
  pageCount: number
  onNavigate: (page: number) => void
  /** Reports the deck's total page count once the PDF has loaded. */
  onLoadSuccess: (numPages: number) => void
  /** Present only when this page has a related assignment — "Try this now". */
  relatedAssignmentId?: number
  onNavigateToAssignment?: (assignmentId: number) => void
  /** This page is the one the teacher is currently broadcasting. */
  isPageLive?: boolean
  /** Present only for the teacher — toggles broadcasting the current page. */
  onToggleFocus?: () => void
  /** Present only when the teacher's live focus points at an assignment — rendered in the footer, right of the pager. */
  followBanner?: {
    label: string
    onFollow: () => void
  }
}
