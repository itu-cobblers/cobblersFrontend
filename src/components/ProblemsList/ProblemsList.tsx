import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type {ProblemListItem, ProblemsListProps, ProblemsListRowProps} from './ProblemsList.types'
import {
  LIST_CLASS_BASE,
  LIST_CLASS_OPEN,
  LIST_CLASS_CLOSED,
  LIST_COUNT_CLASS,
  LIST_TOGGLE_CLASS,
  LIST_TOGGLE_LABEL,
  LIST_RAIL_TABS_CLASS,
  LIST_RAIL_TABS_OPEN_CLASS,
  LIST_RAIL_TABS_CLOSED_CLASS,
  LIST_RAIL_TOGGLE_CLASS,
  LIST_RAIL_TAB_BASE_CLASS,
  LIST_RAIL_TAB_ACTIVE_CLASS,
  LIST_RAIL_TAB_IDLE_CLASS,
  LIST_RAIL_TAB_LABEL_CLASS,
  LIST_RAIL_HISTORY_TOGGLE_CLASS,
  LIST_RAIL_HISTORY_TOGGLE_ACTIVE_CLASS,
  LIST_RAIL_HISTORY_TOGGLE_IDLE_CLASS,
  LIST_HISTORY_LOADING_CLASS,
  LIST_ITEMS_CLASS,
  LIST_CARD_BODY_CLASS,
  LIST_ITEM_BASE_CLASS,
  LIST_ITEM_ACTIVE_CLASS,
  LIST_ITEM_IDLE_CLASS,
  LIST_ITEM_META_CLASS,
  LIST_ITEM_KIND_BADGE_CLASS,
  LIST_ITEM_TITLE_CLASS,
  LIST_FOOTER_CLASS,
  LIST_FOOTER_LEGEND_CLASS,
  LIST_TIMER_BADGE_CLASS,
  LIST_ITEM_LIVE_CLASS,
  KIND_LABEL, LIST_ITEM_LIVE_BORDER_CLASS,
} from './ProblemsList.constants'
import {StatusBadge} from "@components/StatusBadge";
import { formatPassedRatio, formatMoveToNext } from './ProblemsList.utils'



/**
 * One assignment row, shared by the student rail and `TeacherProblemsList` —
 * same badge, meta line and active/live treatment in both, so they can't
 * drift apart the way they did before.
 */
export function ProblemsListRow({ id, title, kind, status, isActive, isLive, isOpen, onSelect }: ProblemsListRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        title={title}
        className={classNames(
          LIST_ITEM_BASE_CLASS,
          isActive ? LIST_ITEM_ACTIVE_CLASS : LIST_ITEM_IDLE_CLASS,
          isLive && LIST_ITEM_LIVE_BORDER_CLASS,
        )}
      >
        <StatusBadge status={status} size="s" />
        {isOpen && (
          <div className="min-w-0 flex-1">
            <div className={LIST_ITEM_META_CLASS}>
              <span>#{id}</span>
              <span className={LIST_ITEM_KIND_BADGE_CLASS}>{KIND_LABEL[kind]}</span>
              {isLive && <span className={LIST_ITEM_LIVE_CLASS}>live</span>}
            </div>
            <div className={LIST_ITEM_TITLE_CLASS}>{title}</div>
          </div>
        )}
      </button>
    </li>
  )
}

export default function ProblemsList({
  activeTab,
  onTabChange,
  sessionItems,
  historyItems,
  isHistoryLoading,
  activeId,
  onSelect,
  teacherFocusId,
  isOpen,
  onToggleOpen,
  timerEndsAt,
}: ProblemsListProps) {
  const items = activeTab === 'session' ? sessionItems : historyItems

  return (
    <aside className={classNames(LIST_CLASS_BASE, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      <div
        className={classNames(
          LIST_RAIL_TABS_CLASS,
          isOpen ? LIST_RAIL_TABS_OPEN_CLASS : LIST_RAIL_TABS_CLOSED_CLASS,
        )}
      >
        {isOpen && (
          <button
            type="button"
            title="Assignments"
            onClick={() => onTabChange('session')}
            className={classNames(
              LIST_RAIL_TAB_BASE_CLASS,
              activeTab === 'session' ? LIST_RAIL_TAB_ACTIVE_CLASS : LIST_RAIL_TAB_IDLE_CLASS,
            )}
          >
            <span className={LIST_RAIL_TAB_LABEL_CLASS}>Assignments</span>
            <span className={LIST_COUNT_CLASS}>{formatPassedRatio(sessionItems)}</span>
          </button>
        )}

        {isOpen && (
          <button
            type="button"
            aria-label="View submission history"
            aria-pressed={activeTab === 'history'}
            title="History"
            onClick={() => onTabChange(activeTab === 'history' ? 'session' : 'history')}
            className={classNames(
              LIST_RAIL_HISTORY_TOGGLE_CLASS,
              activeTab === 'history' ? LIST_RAIL_HISTORY_TOGGLE_ACTIVE_CLASS : LIST_RAIL_HISTORY_TOGGLE_IDLE_CLASS,
            )}
          >
            <Icon name="history" />
          </button>
        )}

        <button
          type="button"
          onClick={onToggleOpen}
          className={classNames(LIST_TOGGLE_CLASS, LIST_RAIL_TOGGLE_CLASS)}
          aria-label={isOpen ? LIST_TOGGLE_LABEL.collapse : LIST_TOGGLE_LABEL.expand}
        >
          <Icon name={isOpen ? 'chevronsLeft' : 'chevronsRight'} />
        </button>
      </div>

      <div className={LIST_CARD_BODY_CLASS}>
      {activeTab === 'history' && isHistoryLoading ? (
        isOpen && <p className={LIST_HISTORY_LOADING_CLASS}>Loading your history…</p>
      ) : (
        <ul className={LIST_ITEMS_CLASS}>
          {items.map((item: ProblemListItem) => (
            <ProblemsListRow
              key={item.id}
              id={item.id}
              title={item.title}
              kind={item.kind}
              status={item.status}
              isActive={item.id === activeId}
              isLive={activeTab === 'session' && item.id === teacherFocusId}
              isOpen={isOpen}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </ul>
      )}

      {isOpen && (
        <div className={LIST_FOOTER_CLASS}>
          {timerEndsAt && <span className={LIST_TIMER_BADGE_CLASS}>{formatMoveToNext(timerEndsAt)}</span>}
          <div className={LIST_FOOTER_LEGEND_CLASS}>
            <StatusBadge status={'tried'} size="s" label='Tried' className="mr-2" />
            <StatusBadge status={'passed'} size="s" label='Passed' className="mr-2"/>
          </div>
        </div>
      )}
      </div>
    </aside>
  )
}
