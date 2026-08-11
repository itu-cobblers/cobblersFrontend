import { useEffect, useState } from 'react'
import { SlideViewer } from '@components/SlideViewer'
import { useCourseContent } from '@hooks/useCourseContent'
import type { SlidesWorkspaceProps } from './SlidesWorkspace.types'
import { SLIDES_WORKSPACE_MAIN_CLASS } from './SlidesWorkspace.constants'

/** The Slides view's content: a full-width PDF viewer with its own prev/next footer. */
export default function SlidesWorkspace({
  assignmentSet,
  pendingSlideId,
  onConsumedPendingSlide,
  onNavigateToAssignment,
  initialSlideId,
  onActiveSlideChange,
  focusedSlideId,
  onToggleFocusSlide,
  teacherFocus,
}: SlidesWorkspaceProps) {
  const { pdfSrc, findAssignmentForPage } = useCourseContent(assignmentSet.assignmentSetId)

  // Only known once the PDF has loaded — see `SlideViewer`'s `onLoadSuccess`.
  const [pageCount, setPageCount] = useState(0)

  // Seeded from `pendingSlideId`/`initialSlideId` at mount, not adopted via an
  // effect: this component only ever mounts fresh when a "go to slide" link
  // fires (it's unmounted the whole time Practice is showing, which is the
  // only place that link lives) or when the tab is opened for the first time
  // in this session, so the target value is already known on first render.
  // `pendingSlideId` (an explicit cross-tab jump) wins over the merely
  // last-remembered `initialSlideId`; page 1 is the default otherwise.
  const [pickedPage, setPickedPage] = useState<number | undefined>(pendingSlideId ?? initialSlideId ?? undefined)

  // The only genuine effects here: telling the parent (external systems from
  // this component's point of view) to clear the pending signal once read,
  // and to persist the active page as it changes. No local setState in
  // either body, so neither triggers set-state-in-effect.
  useEffect(() => {
    if (pendingSlideId != null) onConsumedPendingSlide?.()
  }, [pendingSlideId, onConsumedPendingSlide])

  useEffect(() => {
    if (pickedPage != null) onActiveSlideChange?.(pickedPage)
  }, [pickedPage, onActiveSlideChange])

  const activePage = pickedPage ?? 1

  const teacherFocusedAssignment = teacherFocus?.kind === 'assignment'
    ? assignmentSet.assignments.find((a) => a.id === teacherFocus.id)
    : undefined

  // `focusedSlideId` is the teacher's own instance tracking what it's broadcasting;
  // `teacherFocus` (kind 'slide') is how a student instance learns the same thing.
  // Either can supply the "live" indicator, never both at once.
  const teacherFocusedPage = focusedSlideId ?? (teacherFocus?.kind === 'slide' ? teacherFocus.id : null)

  const handleToggleFocus = () => onToggleFocusSlide?.(activePage)
  const handleNavigate = (page: number) => setPickedPage(Math.min(Math.max(page, 1), pageCount || page))

  return (
    <div className={SLIDES_WORKSPACE_MAIN_CLASS}>
      <SlideViewer
        pdfSrc={pdfSrc}
        pageNumber={activePage}
        pageCount={pageCount}
        onNavigate={handleNavigate}
        onLoadSuccess={setPageCount}
        relatedAssignmentId={findAssignmentForPage(activePage)}
        onNavigateToAssignment={onNavigateToAssignment}
        isPageLive={activePage === teacherFocusedPage}
        onToggleFocus={onToggleFocusSlide ? handleToggleFocus : undefined}
        followBanner={
          teacherFocusedAssignment
            ? {
                label: `#${teacherFocusedAssignment.id} · ${teacherFocusedAssignment.title}`,
                onFollow: () => onNavigateToAssignment(teacherFocusedAssignment.id),
              }
            : undefined
        }
      />
    </div>
  )
}
