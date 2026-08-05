import { useEffect, useState } from 'react'
import type { SlidePage } from '@types'
import { fetchCourseContent } from '@/api/courseContentApi.ts'

export interface UseCourseContent {
  slides: SlidePage[]
  isLoading: boolean
  /** The slide (if any) that links back to this assignment — powers "Go to slide to learn more". */
  findSlideForAssignment: (assignmentId: number) => SlidePage | undefined
}

/**
 * Fetches the Slides content for a session's assignment set. Shared by
 * `StudentWorkspace` (to resolve an assignment's "learn more" link) and
 * `SlidesWorkspace` (to render the deck itself), so both read the same data
 * without fetching it twice.
 */
export function useCourseContent(assignmentSetId: string | undefined, firstAssignmentId: number | undefined): UseCourseContent {
  const [slides, setSlides] = useState<SlidePage[]>([])
  // Derived, not a synchronous setState-in-effect: `isLoading` is just "have we
  // loaded slides for the set we were asked for yet" — the effect below only
  // ever calls setState from its async `.then`, which isn't a cascading render.
  const [loadedForId, setLoadedForId] = useState<string | undefined>(undefined)
  const isLoading = assignmentSetId !== loadedForId

  useEffect(() => {
    if (!assignmentSetId) return
    let cancelled = false
    fetchCourseContent(assignmentSetId, firstAssignmentId).then((result) => {
      if (cancelled) return
      setSlides(result)
      setLoadedForId(assignmentSetId)
    })
    return () => {
      cancelled = true
    }
  }, [assignmentSetId, firstAssignmentId])

  return {
    slides,
    isLoading,
    findSlideForAssignment: (assignmentId) => slides.find((slide) => slide.relatedAssignmentId === assignmentId),
  }
}
