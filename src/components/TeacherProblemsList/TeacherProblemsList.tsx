import classNames from 'classnames'
import { StatusBadge } from '@components/StatusBadge'
import { Icon } from '@components/Icon'

import type { TeacherProblemsListProps, TeacherProblemItem } from './TeacherProblemsList.types'
import {
  LIST_CLASS_BASE,
  LIST_CLASS_OPEN,
  LIST_CLASS_CLOSED,
  LIST_HEADER_CLASS,
  LIST_HEADER_RIGHT_CLASS,
  LIST_COUNT_CLASS,
  LIST_TOGGLE_CLASS,
  LIST_ITEMS_CLASS,
  LIST_ITEM_BASE_CLASS,
  LIST_ITEM_ACTIVE_CLASS,
  LIST_ITEM_IDLE_CLASS,
  LIST_ITEM_ACCENT_BAR_CLASS,
  LIST_ITEM_KIND_BADGE_CLASS,
  LIST_ITEM_TITLE_CLASS,
  KIND_LABEL,
} from '@components/ProblemsList/ProblemsList.constants'
import {
  ITEM_CONTENT_CLASS,
  ITEM_META_ROW_CLASS,
  ITEM_STATS_GROUP_CLASS,
  ITEM_PASSED_COUNT_CLASS,
  ITEM_LIVE_BADGE_CLASS,
  ITEM_NUMBER_BADGE_CLASS,
  TEACHER_LIST_CARD_CLASS,
} from './TeacherProblemsList.constants'



export default function TeacherProblemsList({
  items,
  activeId,
  onSelect,
  teacherFocusId,
  isOpen,
  onToggleOpen,
}: TeacherProblemsListProps) {

  return (
    <aside className={classNames(LIST_CLASS_BASE, TEACHER_LIST_CARD_CLASS, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      {/* Header */}
      <div className={LIST_HEADER_CLASS}>
        {isOpen && 'Assignments'}
        <span className={LIST_HEADER_RIGHT_CLASS}>
          {isOpen && <span className={LIST_COUNT_CLASS}>{items.length}</span>}
          <button
            type="button"
            onClick={onToggleOpen}
            className={LIST_TOGGLE_CLASS}
            aria-label={isOpen ? 'Collapse list' : 'Expand list'}
          >
            <Icon name={isOpen ? 'chevronsLeft' : 'chevronsRight'} />
          </button>
        </span>
      </div>

      {/* Assignment Items */}
      <ul className={LIST_ITEMS_CLASS}>
        {items.map((item: TeacherProblemItem) => {
          const isActive = item.id === activeId
          const isTeacherFocus = item.id === teacherFocusId
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                title={item.title}
                className={classNames(
                  LIST_ITEM_BASE_CLASS,
                  isActive ? LIST_ITEM_ACTIVE_CLASS : LIST_ITEM_IDLE_CLASS,
                )}
              >
                {isActive && <span className={LIST_ITEM_ACCENT_BAR_CLASS} />}

                {item.studentStatus ? (
                  <StatusBadge status={item.studentStatus} />
                ) : (
                  <span className={ITEM_NUMBER_BADGE_CLASS}>#{item.id}</span>
                )}

                {isOpen && (
                  <div className={ITEM_CONTENT_CLASS}>
                    <div className={ITEM_META_ROW_CLASS}>
                      <span className={LIST_ITEM_KIND_BADGE_CLASS}>{KIND_LABEL[item.kind]}</span>
                      {item.passedNum !== undefined && item.totalNum !== undefined && (
                        <div className={ITEM_STATS_GROUP_CLASS}>
                          <span className={ITEM_PASSED_COUNT_CLASS}>
                            {item.passedNum}/{item.totalNum} passed
                          </span>
                          {isTeacherFocus && <span className={ITEM_LIVE_BADGE_CLASS}>live</span>}
                        </div>
                      )}
                    </div>
                    <div className={LIST_ITEM_TITLE_CLASS}>{item.title}</div>
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ul>

    </aside>
  )
}
