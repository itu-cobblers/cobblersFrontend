import classNames from 'classnames'
import { FeedbackBanner } from '@components/FeedbackBanner'
import { formatAttemptTime, describeSource } from '@components/ProblemsList'
import { Icon } from '@components/Icon'
import { ProjectBrief } from '@components/ProjectBrief'
import type { AssignmentPanelProps, AssignmentPanelTab } from './AssignmentPanel.types'
import { useHintDisclosure } from './AssignmentPanel.hooks'
import {
  PANEL_CLASS,
  PANEL_SCROLL_CLASS,
  PANEL_TITLE_CLASS,
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
  PANEL_TAB_UNDERLINE_CLASS,
  PANEL_TAB_COUNT_CLASS,
  PANEL_SUBMISSIONS_EMPTY_CLASS,
  PANEL_SUBMISSIONS_LIST_CLASS,
  PANEL_SUBMISSION_ROW_CLASS,
  PANEL_SUBMISSION_BADGE_PASSED_CLASS,
  PANEL_SUBMISSION_BADGE_FAILED_CLASS,
  PANEL_SUBMISSION_TITLE_CLASS,
  PANEL_SUBMISSION_META_CLASS,
} from './AssignmentPanel.constants'

const TABS: AssignmentPanelTab[] = ['description', 'submissions']

const TAB_LABEL: Record<AssignmentPanelTab, string> = {
  description: 'Description',
  submissions: 'Submissions',
}

/**
 * The left column of the IDE: progress stepper on top, Description/Submissions
 * tabs, then either the active assignment's teaching content + task + hint,
 * or this assignment's attempt history — with check feedback pinned at the
 * bottom, outside the scroll region.
 */
export default function AssignmentPanel({
  activeTab,
  onTabChange,
  submissions,
  title,
  lesson,
  description,
  body,
  projectIdentity,
  hint,
  feedback,
}: AssignmentPanelProps) {
  const [isHintExpanded, handleHintToggle] = useHintDisclosure(hint)

  return (
    <section className={PANEL_CLASS}>
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
              <span className={PANEL_TAB_COUNT_CLASS}>{submissions.length}</span>
            )}
            {activeTab === tab && <span className={PANEL_TAB_UNDERLINE_CLASS} />}
          </button>
        ))}
      </div>

      {activeTab === 'description' ? (
        <div className={PANEL_SCROLL_CLASS}>
          <h2 className={PANEL_TITLE_CLASS}>{title}</h2>
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
          { (
            <>
              <h3 className={PANEL_TASK_LABEL_CLASS}>Your task</h3>
              <p className={PANEL_TASK_CLASS}>{description}</p>
            </>
          )}

          {projectIdentity && <ProjectBrief title={title} projectIdentity={projectIdentity} />}

          {!projectIdentity && body && <p className={PANEL_BODY_CLASS}>{body}</p>}

          {hint && (
            <div className={PANEL_HINT_CLASS}>
              <button type="button" onClick={handleHintToggle} className={PANEL_HINT_TOGGLE_CLASS}>
                💡 Hint
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
          {submissions.length === 0 ? (
            <div className={PANEL_SUBMISSIONS_EMPTY_CLASS}>
              <Icon name="history" />
              <p className="mt-3">No submissions yet.</p>
            </div>
          ) : (
            <ul className={PANEL_SUBMISSIONS_LIST_CLASS}>
              {submissions.map((submission) => {
                // `passed === null` (ungraded projects) and `true` both read as Accepted;
                // only an explicit `false` is Not accepted.
                const isFailed = submission.passed === false
                return (
                <li key={submission.subId} className={PANEL_SUBMISSION_ROW_CLASS}>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isFailed
                          ? PANEL_SUBMISSION_BADGE_FAILED_CLASS
                          : PANEL_SUBMISSION_BADGE_PASSED_CLASS
                      }
                    >
                      <Icon name={isFailed ? 'x' : 'check'} />
                    </span>
                    <div>
                      <div className={PANEL_SUBMISSION_TITLE_CLASS}>
                        {isFailed ? 'Not accepted' : 'Accepted'}
                      </div>
                      <div className={PANEL_SUBMISSION_META_CLASS}>
                        {formatAttemptTime(submission.submittedAt)} · {describeSource(submission.sessionId)}
                      </div>
                    </div>
                  </div>
                </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {feedback && <FeedbackBanner {...feedback} />}
    </section>
  )
}
