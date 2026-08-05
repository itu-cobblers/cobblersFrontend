import type { SlidePage } from '@types'

export interface SlidesListProps {
  slides: SlidePage[]
  activeId: number | undefined
  onSelect: (id: number) => void
  isOpen: boolean
  onToggleOpen: () => void
  /** Slide id the teacher is currently broadcasting focus on — glows in the list. Omitted for students. */
  teacherFocusedSlideId?: number | null
  /** Present only for the teacher — toggles broadcasting focus on the currently active slide. */
  onToggleFocus?: () => void
  isActiveSlideFocused?: boolean
}

export interface SlidesListRowProps {
  id: number
  title: string
  isActive: boolean
  isLive: boolean
  isOpen: boolean
  onSelect: () => void
}
