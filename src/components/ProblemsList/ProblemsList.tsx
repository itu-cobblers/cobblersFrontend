import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type { ProblemListItem, ProblemsListProps, ProblemsListTab } from './ProblemsList.types'
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
  LIST_HISTORY_LOADING_CLASS,
  LIST_ITEMS_CLASS,
  LIST_ITEM_BASE_CLASS,
  LIST_ITEM_ACTIVE_CLASS,
  LIST_ITEM_IDLE_CLASS,
  LIST_ITEM_META_CLASS,
  LIST_ITEM_KIND_BADGE_CLASS,
  LIST_ITEM_TITLE_CLASS,
  LIST_FOOTER_CLASS,
  LIST_ITEM_LIVE_CLASS,
  KIND_LABEL,
} from './ProblemsList.constants'
import {StatusBadge} from "@components/StatusBadge";
import { formatPassedRatio } from './ProblemsList.utils'

const RAIL_TAB_LABEL: Record<ProblemsListTab, string> = {
  session: 'Assignments',
  history: 'History',
}

/**
 * History has no tab for the moment — it wasn't earning its half of the row.
 * The view itself is untouched: pass `activeTab: 'history'` and the rail
 * renders `historyItems`. Re-add 'history' here to bring the tab back.
 */
const RAIL_TABS: ProblemsListTab[] = ['session']

/**
 * The single left-hand rail: fold/unfold toggle, a Session/History
 * tab pair (this session's assignment list vs. this student's full cross-day
 * submission history — replacing the old separate "My Progress" modal), the
 * problems list itself (one row per assignment with a pass/fail/untried
 * indicator, shared between both tabs). Leave/Exit lives in the AppHeader.
 * Clicking any row — from either tab — drives the exact same
 * description+submissions interaction in the assignment panel; only the tab
 * it came from changes whether a later Submit tags the current session.
 */
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
        {isOpen && RAIL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            title={RAIL_TAB_LABEL[tab]}
            onClick={() => onTabChange(tab)}
            className={classNames(
              LIST_RAIL_TAB_BASE_CLASS,
              activeTab === tab ? LIST_RAIL_TAB_ACTIVE_CLASS : LIST_RAIL_TAB_IDLE_CLASS,
            )}
          >
            {isOpen && <span className={LIST_RAIL_TAB_LABEL_CLASS}>{RAIL_TAB_LABEL[tab]}</span>}
            {isOpen && tab === 'session' && (
              <span className={LIST_COUNT_CLASS}>{formatPassedRatio(sessionItems)}</span>
            )}
          </button>
        ))}

        <button
          type="button"
          onClick={onToggleOpen}
          className={classNames(LIST_TOGGLE_CLASS, LIST_RAIL_TOGGLE_CLASS)}
          aria-label={isOpen ? LIST_TOGGLE_LABEL.collapse : LIST_TOGGLE_LABEL.expand}
        >
          <Icon name={isOpen ? 'chevronsLeft' : 'chevronsRight'} />
        </button>
      </div>

      {activeTab === 'history' && isHistoryLoading ? (
        isOpen && <p className={LIST_HISTORY_LOADING_CLASS}>Loading your history…</p>
      ) : (
        <ul className={LIST_ITEMS_CLASS}>
          {items.map((item: ProblemListItem) => {
            const isActive = item.id === activeId
            const isTeacherFocus = activeTab === 'session' && item.id === teacherFocusId
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  title={item.title}
                  className={classNames(
                    LIST_ITEM_BASE_CLASS,
                    isActive ? LIST_ITEM_ACTIVE_CLASS : LIST_ITEM_IDLE_CLASS,
                    { '--foreground/60': isTeacherFocus },
                  )}
                >
                  <StatusBadge status={item.status} size="s" />
                  {isOpen && (
                    <div className="min-w-0 flex-1">
                      <div className={LIST_ITEM_META_CLASS}>
                        <span>#{item.id}</span>
                        <span className={LIST_ITEM_KIND_BADGE_CLASS}>{KIND_LABEL[item.kind]}</span>
                        {isTeacherFocus && <span className={LIST_ITEM_LIVE_CLASS}>live</span>}
                      </div>
                      <div className={LIST_ITEM_TITLE_CLASS}>{item.title}</div>
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {isOpen && (
        <div className={LIST_FOOTER_CLASS}>
          <StatusBadge status={'tried'} size="s" label='Tried' className="mr-2" />
          <StatusBadge status={'passed'} size="s" label='Passed' className="mr-2"/>
        </div>
      )}

    </aside>
  )
}
