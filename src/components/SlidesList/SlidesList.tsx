import classNames from 'classnames'
import { Icon } from '@components/Icon'
import {
  LIST_CLASS_OPEN,
  LIST_CLASS_CLOSED,
  LIST_HEADER_RIGHT_CLASS,
  LIST_TOGGLE_CLASS,
  LIST_TOGGLE_LABEL,
  LIST_ITEM_LIVE_CLASS,
  LIST_ITEM_LIVE_BORDER_CLASS,
} from '@components/ProblemsList/ProblemsList.constants'
import type { SlidesListProps, SlidesListRowProps } from './SlidesList.types'
import {
  SLIDES_LIST_CLASS_BASE,
  SLIDES_LIST_CARD_BODY_CLASS,
  SLIDES_LIST_HEADER_CLASS,
  SLIDES_LIST_ITEMS_CLASS,
  SLIDES_LIST_ITEM_BASE_CLASS,
  SLIDES_LIST_ITEM_ACTIVE_CLASS,
  SLIDES_LIST_ITEM_IDLE_CLASS,
  SLIDES_LIST_ITEM_META_CLASS,
  SLIDES_LIST_ITEM_TITLE_CLASS,
  SLIDES_LIST_ITEM_BADGE_CLASS,
  SLIDES_LIST_ITEM_BADGE_IDLE_CLASS,
  SLIDES_LIST_ITEM_BADGE_LIVE_CLASS,
  SLIDES_LIST_FOOTER_CLASS,
  SLIDES_LIST_FOCUS_BUTTON_CLASS,
  SLIDES_LIST_FOCUS_BUTTON_ACTIVE_CLASS,
  SLIDES_LIST_FOCUS_BUTTON_IDLE_CLASS,
} from './SlidesList.constants'

export function SlidesListRow({ id, title, isActive, isLive, isOpen, onSelect }: SlidesListRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        title={title}
        className={classNames(
          SLIDES_LIST_ITEM_BASE_CLASS,
          isActive ? SLIDES_LIST_ITEM_ACTIVE_CLASS : SLIDES_LIST_ITEM_IDLE_CLASS,
          isLive && LIST_ITEM_LIVE_BORDER_CLASS,
        )}
      >
        <span
          className={classNames(
            SLIDES_LIST_ITEM_BADGE_CLASS,
            isLive ? SLIDES_LIST_ITEM_BADGE_LIVE_CLASS : SLIDES_LIST_ITEM_BADGE_IDLE_CLASS,
          )}
        >
          {id}
        </span>
        {isOpen && (
          <div className="min-w-0 flex-1">
            <div className={classNames(SLIDES_LIST_ITEM_META_CLASS, 'flex items-center gap-1.5')}>
              <span>#{id}</span>
              {isLive && <span className={LIST_ITEM_LIVE_CLASS}>live</span>}
            </div>
            <div className={SLIDES_LIST_ITEM_TITLE_CLASS}>{title}</div>
          </div>
        )}
      </button>
    </li>
  )
}

/** The Slides view's rail — same visual language as `ProblemsList`, listing slide pages instead of assignments. */
export default function SlidesList({
  slides,
  activeId,
  onSelect,
  isOpen,
  onToggleOpen,
  teacherFocusedSlideId,
  onToggleFocus,
  isActiveSlideFocused,
}: SlidesListProps) {
  return (
    <aside className={classNames(SLIDES_LIST_CLASS_BASE, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      <div className={SLIDES_LIST_HEADER_CLASS}>
        {isOpen && 'Course Content'}
        <span className={LIST_HEADER_RIGHT_CLASS}>
          <button
            type="button"
            onClick={onToggleOpen}
            className={LIST_TOGGLE_CLASS}
            aria-label={isOpen ? LIST_TOGGLE_LABEL.collapse : LIST_TOGGLE_LABEL.expand}
          >
            <Icon name={isOpen ? 'chevronsLeft' : 'chevronsRight'} />
          </button>
        </span>
      </div>
      <div className={SLIDES_LIST_CARD_BODY_CLASS}>
        <ul className={SLIDES_LIST_ITEMS_CLASS}>
          {slides.map((slide) => (
            <SlidesListRow
              key={slide.id}
              id={slide.id}
              title={slide.title}
              isActive={slide.id === activeId}
              isLive={slide.id === teacherFocusedSlideId}
              isOpen={isOpen}
              onSelect={() => onSelect(slide.id)}
            />
          ))}
        </ul>

        {isOpen && onToggleFocus && (
          <div className={SLIDES_LIST_FOOTER_CLASS}>
            <button
              type="button"
              onClick={onToggleFocus}
              title="Broadcast this slide to every student in the room"
              className={classNames(
                SLIDES_LIST_FOCUS_BUTTON_CLASS,
                isActiveSlideFocused ? SLIDES_LIST_FOCUS_BUTTON_ACTIVE_CLASS : SLIDES_LIST_FOCUS_BUTTON_IDLE_CLASS,
              )}
            >
              <Icon name={isActiveSlideFocused ? 'check' : 'arrowUp'} />
              {isActiveSlideFocused ? 'Live for students' : 'Focus this slide'}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
