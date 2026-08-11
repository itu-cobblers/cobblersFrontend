import { getContentConfig } from '@lib/contentConfig'

export interface UseCourseContent {
  pdfSrc: string
  /** The page (if any) that introduces this assignment — powers "Go to slide to learn more". */
  findPageForAssignment: (assignmentId: number) => number | undefined
  /** The assignment (if any) a page links to — powers "Try this now". */
  findAssignmentForPage: (page: number) => number | undefined
}

/**
 * Resolves the Content tab's PDF and its page↔assignment links for a session's
 * assignment set. Shared by `StudentWorkspace`/`TeacherWorkspace` (to resolve
 * an assignment's "learn more" link) and `SlidesWorkspace` (to render the deck
 * itself and resolve a page's "Try this now" link).
 */
export function useCourseContent(assignmentSetId: string | undefined): UseCourseContent {
  const { pdfSrc, pageLinks } = getContentConfig(assignmentSetId)

  return {
    pdfSrc,
    findPageForAssignment: (assignmentId) => pageLinks.find((link) => link.assignmentId === assignmentId)?.page,
    findAssignmentForPage: (page) => pageLinks.find((link) => link.page === page)?.assignmentId,
  }
}
