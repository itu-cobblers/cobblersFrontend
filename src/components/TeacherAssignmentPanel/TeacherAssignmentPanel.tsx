import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { ProjectBrief } from '@components/ProjectBrief'
import { formatAttemptTime } from '@components/ProblemsList'
import type { AssignmentPanelTab } from '@components/AssignmentPanel/AssignmentPanel.types'
import type {TeacherAssignmentPanelProps, TeacherSubmissionItem} from './TeacherAssignmentPanel.types'
import { useHintDisclosure } from '@components/AssignmentPanel/AssignmentPanel.hooks'
import {
  PANEL_CLASS,
  PANEL_SCROLL_CLASS,
  PANEL_TITLE_BARE_CLASS,
  PANEL_LESSON_TEXT_CLASS,
  PANEL_LESSON_CODE_CLASS,
  PANEL_TASK_LABEL_CLASS,
  PANEL_TASK_CLASS,
  PANEL_BODY_CLASS,
  PANEL_HINT_CLASS,
  PANEL_HINT_TOGGLE_CLASS,
  PANEL_HINT_ARROW_CLASS,
  PANEL_HINT_ARROW_EXPANDED_CLASS,
  PANEL_HINT_BODY_CLASS,
  PANEL_HINT_CODE_CLASS,
  PANEL_TABS_CLASS,
  PANEL_TAB_BASE_CLASS,
  PANEL_TAB_ACTIVE_CLASS,
  PANEL_TAB_IDLE_CLASS,
  PANEL_SUBMISSIONS_EMPTY_CLASS,
  PANEL_SUBMISSIONS_LIST_CLASS,
  PANEL_CARD_BODY_CLASS,
} from '@components/AssignmentPanel/AssignmentPanel.constants'
import {
  FILTER_BAR_CLASS,
  FILTER_BAR_LABEL_CLASS,
  FILTER_PILL_CLASS,
  FILTER_PILL_CLEAR_CLASS,
  TAB_SUBMISSIONS_COUNT_CLASS,
  FOCUS_BUTTON_BASE_CLASS,
  FOCUS_BUTTON_ACTIVE_CLASS,
  FOCUS_BUTTON_IDLE_CLASS,
  SUBMISSIONS_EMPTY_TITLE_CLASS,
  SUBMISSIONS_EMPTY_SUBTITLE_CLASS,
  TITLE_ROW_CLASS,
  BREAKDOWN_ROW_CLASS,
  BREAKDOWN_ITEM_CLASS,
} from './TeacherAssignmentPanel.constants'
import {SubmissionRow} from "@components/SubmissionRow";

const TABS: AssignmentPanelTab[] = ['description', 'submissions']

const TAB_LABEL: Record<AssignmentPanelTab, string> = {
  description: 'Description',
  submissions: 'Submissions',
}

export default function TeacherAssignmentPanel({
  activeTab,
  onTabChange,
  title,
  lesson,
  description,
  body,
  projectIdentity,
  hint,
  onFocusClick,
  isFocused,
  isBroadcastable = true,
  assignmentBreakdown,
  selectedStudentName,
  onClearStudentFilter,
  submissions,
  activeSubId,
  onSelectSubmission,
}: TeacherAssignmentPanelProps) {
  const [isHintExpanded, handleHintToggle] = useHintDisclosure(hint)

  return (
    <section className={PANEL_CLASS}>
      {/* Tabs */}
      <div className={PANEL_TABS_CLASS}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={classNames(PANEL_TAB_BASE_CLASS, activeTab === tab ? PANEL_TAB_ACTIVE_CLASS : PANEL_TAB_IDLE_CLASS)}
          >
            {TAB_LABEL[tab]}
            {tab === 'submissions' && submissions.length > 0 && (
              <span className={TAB_SUBMISSIONS_COUNT_CLASS}>
                {submissions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className={PANEL_CARD_BODY_CLASS}>
      {activeTab === 'description' ? (
        <div className={PANEL_SCROLL_CLASS}>
          <div className={TITLE_ROW_CLASS}>
            <h2 className={PANEL_TITLE_BARE_CLASS}>{title}</h2>
            {isBroadcastable && onFocusClick && (
              <button
                type="button"
                onClick={onFocusClick}
                title="Broadcast this task to every student in the room"
                className={classNames(
                  FOCUS_BUTTON_BASE_CLASS,
                  isFocused ? FOCUS_BUTTON_ACTIVE_CLASS : FOCUS_BUTTON_IDLE_CLASS,
                )}
              >
                <Icon name={isFocused ? 'check' : 'arrowUp'} />
                {isFocused ? 'Live for students' : 'Focus'}
              </button>
            )}
          </div>
          {assignmentBreakdown && (
            <div className={BREAKDOWN_ROW_CLASS}>
              <span className={BREAKDOWN_ITEM_CLASS.passed}>Passed: {assignmentBreakdown.passed}</span>
              <span className={BREAKDOWN_ITEM_CLASS.tried}>Tried: {assignmentBreakdown.tried}</span>
              <span className={BREAKDOWN_ITEM_CLASS.untried}>Untried: {assignmentBreakdown.untried}</span>
            </div>
          )}
          {lesson?.map((block, index) =>
            block.kind === 'code' ? (
              <pre key={index} className={PANEL_LESSON_CODE_CLASS}>
                {block.code}
              </pre>
            ) : (
              <p key={index} className={PANEL_LESSON_TEXT_CLASS}>
                {block.text}
              </p>
            ),
          )}
          {!projectIdentity && (
            <>
              <h3 className={PANEL_TASK_LABEL_CLASS}>Task Description</h3>
              <p className={PANEL_TASK_CLASS}>{description}</p>
            </>
          )}

          {projectIdentity && <ProjectBrief title={title} projectIdentity={projectIdentity} />}

          {!projectIdentity && body && <p className={PANEL_BODY_CLASS}>{body}</p>}
          {hint && (
            <div className={PANEL_HINT_CLASS}>
              <button type="button" onClick={handleHintToggle} className={PANEL_HINT_TOGGLE_CLASS}>
                Hint
                <span
                  className={classNames(PANEL_HINT_ARROW_CLASS, { [PANEL_HINT_ARROW_EXPANDED_CLASS]: isHintExpanded })}
                >
                  ▸
                </span>
              </button>
              {isHintExpanded && (
                <div className={PANEL_HINT_BODY_CLASS}>
                  <code className={PANEL_HINT_CODE_CLASS}>{hint}</code>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={PANEL_SCROLL_CLASS}>
          {selectedStudentName && (
              <div className={FILTER_BAR_CLASS}>
          <span className={FILTER_BAR_LABEL_CLASS}>
            Filter:
          </span>
                <span className={FILTER_PILL_CLASS}>
            Student: {selectedStudentName}
                  <button
                      type="button"
                      onClick={onClearStudentFilter}
                      className={FILTER_PILL_CLEAR_CLASS}
                      aria-label="Clear student filter"
                  >
              <Icon name="x" />
            </button>
          </span>
              </div>
          )}
          {submissions.length === 0 ? (
            <div className={PANEL_SUBMISSIONS_EMPTY_CLASS}>
              <Icon name="history" />
              <p className={SUBMISSIONS_EMPTY_TITLE_CLASS}>No matching submissions found.</p>
              <p className={SUBMISSIONS_EMPTY_SUBTITLE_CLASS}>
                {selectedStudentName
                  ? 'Try selecting another student, or clear the student filter.'
                  : 'No submissions yet for this task.'}
              </p>
            </div>
          ) : (
            <ul className={PANEL_SUBMISSIONS_LIST_CLASS}>
              {submissions.map((submission: TeacherSubmissionItem) => {
                const isActive = submission.subId === activeSubId
                return (
                    <SubmissionRow
                      key={submission.subId}
                      submission={submission}
                      isActive={isActive}
                      onClick={() => onSelectSubmission?.(submission.subId)}
                      title={`${submission.studentName} — ${submission.passed ? 'Passed' : 'Failed'}`}
                      meta={`${submission.assignmentTitle} · ${formatAttemptTime(submission.submittedAt)}`}/>
                )
              })}
            </ul>
          )}
        </div>
      )}
      </div>
    </section>
  )
}
