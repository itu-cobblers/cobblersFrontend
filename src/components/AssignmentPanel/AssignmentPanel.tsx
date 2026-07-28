import classNames from 'classnames'
import { AssignmentStepper } from '@components/AssignmentStepper'
import { FeedbackBanner } from '@components/FeedbackBanner'
import { formatAttemptTime, describeSource } from '@components/ProblemsList'
import { Icon } from '@components/Icon'
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
  PANEL_PROJECT_PDF_CLASS,
  PANEL_PROJECT_PDF_HEADER_CLASS,
  PANEL_PROJECT_PDF_LINK_CLASS,
  PANEL_PROJECT_PDF_FRAME_CLASS,
  PDF_VIEWER_FRAGMENT,
  PANEL_SETUP_CLASS,
  PANEL_SETUP_TOGGLE_CLASS,
  PANEL_SETUP_BODY_CLASS,
  PANEL_SETUP_H5_CLASS,
  PANEL_SETUP_LIST_CLASS,
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
  steps,
  onSelectStep,
  isStepperVisible = true,
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
  const [isSetupExpanded, handleSetupToggle] = useHintDisclosure(title)

  return (
    <section className={PANEL_CLASS}>
      <div className={classNames({ 'sr-only': !isStepperVisible })}>
        <AssignmentStepper steps={steps} onSelect={onSelectStep} />
      </div>

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
          {!projectIdentity && (
            <>
              <h3 className={PANEL_TASK_LABEL_CLASS}>Your task</h3>
              <p className={PANEL_TASK_CLASS}>{description}</p>
            </>
          )}

          {projectIdentity && (
            <div className={PANEL_PROJECT_PDF_CLASS}>
              <div className={PANEL_PROJECT_PDF_HEADER_CLASS}>
                <a
                  href={projectIdentity.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={PANEL_PROJECT_PDF_LINK_CLASS}
                >
                  Open in new tab ↗
                </a>
              </div>
              <iframe
                src={`${projectIdentity.pdfUrl}${PDF_VIEWER_FRAGMENT}`}
                title={`${title} brief`}
                className={PANEL_PROJECT_PDF_FRAME_CLASS}
              />
            </div>
          )}

          {projectIdentity && (
            <div className={PANEL_SETUP_CLASS}>
              <button type="button" onClick={handleSetupToggle} className={PANEL_SETUP_TOGGLE_CLASS}>
                Set up your Java environment
                <span
                  className={classNames('inline-block text-[18px] transition-transform', {
                    'rotate-90': isSetupExpanded,
                  })}
                >
                  ▸
                </span>
              </button>
              {isSetupExpanded && (
                <div className={PANEL_SETUP_BODY_CLASS}>
                  <p>Two ways to get ready — pick one.</p>
                  <p>
                    <span className={PANEL_SETUP_H5_CLASS}>Option 1 — Coding Pack for Java (recommended)</span>
                    <br />
                    One download installs the JDK, VS Code, and the extensions you need together. Easiest way to
                    start.
                  </p>
                  <div>
                    <span className={PANEL_SETUP_H5_CLASS}>Option 2 — Manual setup</span>
                    <p>Install these three yourself:</p>
                    <ul className={PANEL_SETUP_LIST_CLASS}>
                      <li>
                        <strong>JDK</strong> — compiles and runs your code. Add it to your system&rsquo;s Environment
                        Variables so the <code>java</code> command works in a terminal.
                      </li>
                      <li>
                        <strong>VS Code</strong> — the editor you&rsquo;ll write in.
                      </li>
                      <li>
                        <strong>VS Code Java Extension Pack</strong> — from the VS Code marketplace. Lets VS Code
                        talk to the JDK (autocomplete, error checking).
                      </li>
                    </ul>
                  </div>
                  <div>
                    <span className={PANEL_SETUP_H5_CLASS}>Before you start</span>
                    <ul className={PANEL_SETUP_LIST_CLASS}>
                      <li>Open the whole project folder in VS Code — not a single file.</li>
                      <li>
                        File names are case-sensitive and must end in exactly <code>.java</code>.
                      </li>
                      <li>Avoid spaces or special characters in folder and file names.</li>
                    </ul>
                  </div>
                  <p>
                    When you&rsquo;re done, upload your <code>.java</code> files below and press Submit to save your
                    attempt — submitting once unlocks the reference solution.
                  </p>
                </div>
              )}
            </div>
          )}

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
              {submissions.map((submission) => (
                <li key={submission.subId} className={PANEL_SUBMISSION_ROW_CLASS}>
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        submission.passed === false
                          ? PANEL_SUBMISSION_BADGE_FAILED_CLASS
                          : PANEL_SUBMISSION_BADGE_PASSED_CLASS
                      }
                    >
                      <Icon name={submission.passed === false ? 'x' : 'check'} />
                    </span>
                    <div>
                      <div className={PANEL_SUBMISSION_TITLE_CLASS}>
                        {submission.passed === false ? 'Not accepted' : 'Accepted'}
                      </div>
                      <div className={PANEL_SUBMISSION_META_CLASS}>
                        {formatAttemptTime(submission.submittedAt)} · {describeSource(submission.sessionId)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {feedback && <FeedbackBanner {...feedback} />}
    </section>
  )
}
