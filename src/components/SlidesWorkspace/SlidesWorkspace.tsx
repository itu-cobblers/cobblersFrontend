import { useEffect, useState } from 'react'
import { SlidesList } from '@components/SlidesList'
import { SlideViewer } from '@components/SlideViewer'
import { TeacherFollowBanner } from '@components/TeacherFollowBanner'
import { useCourseContent } from '@hooks/useCourseContent'
import type { SlidesWorkspaceProps } from './SlidesWorkspace.types'
import { SLIDES_WORKSPACE_MAIN_CLASS, SLIDES_WORKSPACE_CONTENT_COLUMN_CLASS, SLIDES_WORKSPACE_LOADING_CLASS } from './SlidesWorkspace.constants'

/** The Slides view's content: a page rail + the full-bleed viewer, mirroring `StudentWorkspace`'s row shape. */
export default function SlidesWorkspace({
  assignmentSet,
  pendingSlideId,
  onConsumedPendingSlide,
  onNavigateToAssignment,
  initialSlideId,
  onActiveSlideChange,
  isRailOpen,
  onToggleRailOpen,
  focusedSlideId,
  onToggleFocusSlide,
  teacherFocus,
}: SlidesWorkspaceProps) {
  const firstAssignmentId = assignmentSet.assignments[0]?.id
  const { slides, isLoading } = useCourseContent(assignmentSet.assignmentSetId, firstAssignmentId)

  // Seeded from `pendingSlideId`/`initialSlideId` at mount, not adopted via an
  // effect: this component only ever mounts fresh when a "go to slide" link
  // fires (it's unmounted the whole time Practice is showing, which is the
  // only place that link lives) or when the tab is opened for the first time
  // in this session, so the target value is already known on first render.
  // `pendingSlideId` (an explicit cross-tab jump) wins over the merely
  // last-remembered `initialSlideId`; the first slide is derived below if
  // neither is set.
  const [pickedSlideId, setPickedSlideId] = useState<number | undefined>(pendingSlideId ?? initialSlideId ?? undefined)

  // The only genuine effects here: telling the parent (external systems from
  // this component's point of view) to clear the pending signal once read,
  // and to persist the active slide as it changes. No local setState in
  // either body, so neither triggers set-state-in-effect.
  useEffect(() => {
    if (pendingSlideId != null) onConsumedPendingSlide?.()
  }, [pendingSlideId, onConsumedPendingSlide])

  useEffect(() => {
    if (pickedSlideId != null) onActiveSlideChange?.(pickedSlideId)
  }, [pickedSlideId, onActiveSlideChange])

  if (isLoading) {
    return <div className={SLIDES_WORKSPACE_LOADING_CLASS}>Loading slides…</div>
  }

  const activeSlideId = pickedSlideId ?? slides[0]?.id
  const activeSlide = slides.find((slide) => slide.id === activeSlideId)

  const teacherFocusedAssignment = teacherFocus?.kind === 'assignment'
    ? assignmentSet.assignments.find((a) => a.id === teacherFocus.id)
    : undefined

  // `focusedSlideId` is the teacher's own instance tracking what it's broadcasting;
  // `teacherFocus` (kind 'slide') is how a student instance learns the same thing.
  // Either can supply the rail's "teacher is here" highlight, never both at once.
  const teacherFocusedSlideId = focusedSlideId ?? (teacherFocus?.kind === 'slide' ? teacherFocus.id : null)

  return (
    <div className={SLIDES_WORKSPACE_MAIN_CLASS}>
      <SlidesList
        slides={slides}
        activeId={activeSlideId}
        onSelect={setPickedSlideId}
        isOpen={isRailOpen}
        onToggleOpen={onToggleRailOpen}
        teacherFocusedSlideId={teacherFocusedSlideId}
        onToggleFocus={onToggleFocusSlide && activeSlideId != null ? () => onToggleFocusSlide(activeSlideId) : undefined}
        isActiveSlideFocused={activeSlideId != null && activeSlideId === focusedSlideId}
      />
      <div className={SLIDES_WORKSPACE_CONTENT_COLUMN_CLASS}>
        {teacherFocusedAssignment && (
          <TeacherFollowBanner
            label={`#${teacherFocusedAssignment.id} · ${teacherFocusedAssignment.title}`}
            onFollow={() => onNavigateToAssignment(teacherFocusedAssignment.id)}
          />
        )}
        <SlideViewer slide={activeSlide} onNavigateToAssignment={onNavigateToAssignment} />
      </div>
    </div>
  )
}
