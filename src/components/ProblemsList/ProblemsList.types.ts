import type { AssignmentKind } from '@types'

import type {ProblemStatus} from "@components/StatusBadge";

/** Which of the two rail tabs is showing. */
export type ProblemsListTab = 'session' | 'history'

export interface ProblemListItem {
  id: number
  title: string
  kind: AssignmentKind
  status: ProblemStatus
}

export interface ProblemsListProps {
  /** Which tab is showing — this session's assignment list, or the student's full cross-day history. */
  activeTab: ProblemsListTab
  onTabChange: (tab: ProblemsListTab) => void
  /** The active assignment set's assignments, in order — the "Session" tab. */
  sessionItems: ProblemListItem[]
  /** Every assignment the student has ever seen, across every day/room — the "History" tab. */
  historyItems: ProblemListItem[]
  /** True while the history tab's data is (re)loading. */
  isHistoryLoading?: boolean
  activeId: number
  /** Fires with the clicked assignment's id — same interaction from either tab; the item's
   * description and submissions render identically, only the submit behavior differs. */
  onSelect: (id: number) => void
  /** Assignment id the teacher is currently focused on — glows in the list; `null`/omitted outside a room. */
  teacherFocusId?: number | null
  /** Whether the rail is expanded (full list + labels) or collapsed to a narrow icon strip. */
  isOpen: boolean
  /** Toggles `isOpen` — the single fold/unfold control for the whole rail. */
  onToggleOpen: () => void
}
