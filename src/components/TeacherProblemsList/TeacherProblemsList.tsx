import { useState } from 'react'
import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type { IconName } from '@components/Icon'
import type { ProblemStatus } from '@components/ProblemsList/ProblemsList.types'
import { TextField, Button } from '@components'
import { useCountdown, formatCountdown } from '@hooks/useCountdown'
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
  LIST_STATUS_DOT_CLASS,
  KIND_LABEL,
} from '@components/ProblemsList/ProblemsList.constants'
import {
  ROOM_CODE_SECTION_CLASS,
  ROOM_CODE_LABEL_CLASS,
  ROOM_CODE_VALUE_CLASS,
  TIMER_SECTION_CLASS,
  TIMER_TOGGLE_CLASS,
  TIMER_TOGGLE_LABEL_CLASS,
  TIMER_ENDS_BADGE_CLASS,
  TIMER_BODY_CLASS,
  TIMER_INPUT_ROW_CLASS,
  TIMER_INPUT_CLASS,
  TIMER_UNIT_LABEL_CLASS,
  TIMER_ERROR_CLASS,
  ITEM_CONTENT_CLASS,
  ITEM_META_ROW_CLASS,
  ITEM_STATS_GROUP_CLASS,
  ITEM_PASSED_COUNT_CLASS,
  ITEM_LIVE_BADGE_CLASS,
  ITEM_NUMBER_BADGE_CLASS,
  FOOTER_CLASS,
  FOOTER_BUTTON_CLASS,
} from './TeacherProblemsList.constants'

const STATUS_ICON: Record<ProblemStatus, IconName> = {
  passed: 'check',
  failed: 'x',
  untried: 'circle',
}

function StatusDot({ status }: { status: ProblemStatus }) {
  return (
    <span className={LIST_STATUS_DOT_CLASS[status]}>
      <Icon name={STATUS_ICON[status]} />
    </span>
  )
}

export default function TeacherProblemsList({
  sessionCode,
  items,
  activeId,
  onSelect,
  teacherFocusId,
  isOpen,
  onToggleOpen,
  minutes,
  isStartingTimer,
  timerEndsAt,
  timerAssignmentId,
  timerError,
  onMinutesChange,
  onStartTimer,
  onEndSession,
  isEndingSession,
}: TeacherProblemsListProps) {
  const [isTimerExpanded, setIsTimerExpanded] = useState(false)
  const timerAssignmentTitle = timerEndsAt ? items.find((item) => item.id === timerAssignmentId)?.title : undefined
  // Same live "mm:ss" countdown as the student view's AssignmentPanel badge (@hooks/useCountdown).
  const remainingSeconds = useCountdown(timerEndsAt)

  return (
    <aside className={classNames(LIST_CLASS_BASE, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      {/* Header */}
      <div className={LIST_HEADER_CLASS}>
        <Icon name="book" />
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

      {isOpen && (
        <>
          {/* Room Display (Big Room Code) */}
          <div className={ROOM_CODE_SECTION_CLASS}>
            <span className={ROOM_CODE_LABEL_CLASS}>Room Code</span>
            <div className={ROOM_CODE_VALUE_CLASS}>{sessionCode}</div>
          </div>

          {/* Timer Section */}
          <div className={TIMER_SECTION_CLASS}>
            <button type="button" onClick={() => setIsTimerExpanded(!isTimerExpanded)} className={TIMER_TOGGLE_CLASS}>
              <span className={TIMER_TOGGLE_LABEL_CLASS}>
                <Icon name="check" /> Timer
                {timerEndsAt && remainingSeconds !== null && (
                  <span className={TIMER_ENDS_BADGE_CLASS}>
                    ⏱ {formatCountdown(remainingSeconds)}
                    {timerAssignmentTitle && ` · ${timerAssignmentTitle}`}
                  </span>
                )}
              </span>
              <Icon name={isTimerExpanded ? 'chevronsLeft' : 'chevronsRight'} />
            </button>

            {isTimerExpanded && (
              <div className={TIMER_BODY_CLASS}>
                <div className={TIMER_INPUT_ROW_CLASS}>
                  <TextField
                    type="number"
                    value={minutes}
                    onChange={(val) => onMinutesChange(Number(val))}
                    min={1}
                    max={120}
                    isDisabled={isStartingTimer}
                    className={TIMER_INPUT_CLASS}
                  />
                  <span className={TIMER_UNIT_LABEL_CLASS}>min</span>
                  <Button onClick={onStartTimer} isLoading={isStartingTimer} isDisabled={activeId === null}>
                    Start
                  </Button>
                </div>
                {timerError && <p className={TIMER_ERROR_CLASS}>{timerError}</p>}
              </div>
            )}
          </div>
        </>
      )}

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
                  <StatusDot status={item.studentStatus} />
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

      {/* Footer / End Session Button */}
      <div className={FOOTER_CLASS}>
        <button type="button" disabled={isEndingSession} className={FOOTER_BUTTON_CLASS} onClick={onEndSession}>
          <Icon name="logout" />
          {isOpen && <span>{isEndingSession ? 'Ending session…' : 'End session'}</span>}
        </button>
      </div>
    </aside>
  )
}
