import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type {ProblemListItem, ProblemsListProps, ProblemsListRowProps} from './ProblemsList.types'
import {
  LIST_CLASS_BASE,
  LIST_CLASS_OPEN,
  LIST_CLASS_CLOSED,
  LIST_HEADER_CLASS,
  LIST_HEADER_RIGHT_CLASS,
  LIST_TOGGLE_CLASS,
  LIST_TOGGLE_LABEL,
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
  LIST_HISTORY_VIEW_TOGGLE_CLASS,
  LIST_HISTORY_VIEW_TOGGLE_ACTIVE_CLASS,
  LIST_HISTORY_VIEW_TOGGLE_IDLE_CLASS,
  LIST_RAISE_HAND_CLASS,
  LIST_RAISE_HAND_ACTIVE_CLASS,
  LIST_RAISE_HAND_IDLE_CLASS,
  LIST_RAISE_HAND_DEFAULT_ICON_CLASS,
  LIST_RAISE_HAND_HOVER_ICON_CLASS,
  LIST_TIMER_BADGE_CLASS,
  LIST_ITEM_LIVE_CLASS,
  KIND_LABEL, LIST_ITEM_LIVE_BORDER_CLASS,
} from './ProblemsList.constants'
import {StatusBadge} from "@components/StatusBadge";
import { formatMoveToNext } from './ProblemsList.utils'
import { useIsTimerExpired } from './ProblemsList.hooks'



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
  isHandRaised,
  onToggleHand,
}: ProblemsListProps) {
  const items = activeTab === 'session' ? sessionItems : historyItems
  const isTimerExpired = useIsTimerExpired(timerEndsAt)

  function handleToggleHistory() {
    onTabChange(activeTab === 'history' ? 'session' : 'history')
  }

  return (
    <aside className={classNames(LIST_CLASS_BASE, isOpen ? LIST_CLASS_OPEN : LIST_CLASS_CLOSED)}>
      {/* Same markup/classes as `TeacherProblemsList`'s header — the two rails' top rows must not drift apart. */}
      <div className={LIST_HEADER_CLASS}>
        {isOpen && 'Assignments'}
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
          {timerEndsAt && !isTimerExpired && <span className={LIST_TIMER_BADGE_CLASS}>{formatMoveToNext(timerEndsAt)}</span>}
          <div className={LIST_FOOTER_LEGEND_CLASS}>
            <StatusBadge status={'tried'} size="s" label='Tried' />
            <StatusBadge status={'passed'} size="s" label='Passed' />
            <span> | </span>
            <button
              type="button"
              aria-label="View submission history"
              aria-pressed={activeTab === 'history'}
              onClick={handleToggleHistory}
              className={classNames(
                LIST_HISTORY_VIEW_TOGGLE_CLASS,
                activeTab === 'history' ? LIST_HISTORY_VIEW_TOGGLE_ACTIVE_CLASS : LIST_HISTORY_VIEW_TOGGLE_IDLE_CLASS,
              )}
            >
              View history
            </button>
          </div>

          {onToggleHand && (
            <button
              type="button"
              aria-pressed={!!isHandRaised}
              onClick={onToggleHand}
              className={classNames(
                LIST_RAISE_HAND_CLASS,
                isHandRaised ? LIST_RAISE_HAND_ACTIVE_CLASS : LIST_RAISE_HAND_IDLE_CLASS,
              )}
            >
              {isHandRaised ? (
                <>
                  <span className={LIST_RAISE_HAND_DEFAULT_ICON_CLASS}>
                    <Icon name="handStop" />
                  </span>
                  <span className={LIST_RAISE_HAND_HOVER_ICON_CLASS}>
                    <Icon name="handOff" />
                  </span>
                </>
              ) : (
                <Icon name="handStop" />
              )}
              {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
            </button>
          )}
        </div>
      )}
      </div>
    </aside>
  )
}
