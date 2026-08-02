import classNames from 'classnames'
import { CodeEditor } from '@components/CodeEditor'
import { Icon } from '@components/Icon'
import { ShowAnswerButton } from '@components/ShowAnswerButton'
import type { TeacherCodeViewerProps } from './TeacherCodeViewer.types'
import {
  VIEWER_CLASS,
  VIEWER_BODY_CLASS,
  HEADER_CLASS,
  HEADER_LEFT_CLASS,
  HEADER_STUDENT_NAME_CLASS,
  HEADER_SUBMITTED_AT_CLASS,
  HEADER_BADGE_BASE_CLASS,
  HEADER_BADGE_PASSED_CLASS,
  HEADER_BADGE_FAILED_CLASS,
  TABS_CLASS,
  TABS_LIST_CLASS,
  TAB_BASE_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_IDLE_CLASS,
  TABS_LABEL_CLASS,
  SOLUTION_WRAP_CLASS,
  SOLUTION_BODY_CLASS,
  SOLUTION_NOTE_CLASS,
  SOLUTION_BLOCK_CLASS,
  SOLUTION_LABEL_CLASS,
  SOLUTION_FILE_NAME_CLASS,
  SOLUTION_FILE_CONTENT_CLASS,
  SOLUTION_FOOTER_CLASS,
  ANSWER_FOOTER_CLASS,
  RESULT_PANEL_CLASS,
  RESULT_HEADER_CLASS,
  RESULT_STATUS_BASE_CLASS,
  RESULT_STATUS_ERROR_CLASS,
  RESULT_STATUS_OK_CLASS,
  RESULT_BODY_CLASS,
  RESULT_PRE_CLASS,
  RESULT_PLACEHOLDER_CLASS,
  PREDICT_LABEL_CLASS,
  PREDICT_ANSWER_CLASS,
  PREDICT_ANSWER_CORRECT_CLASS,
  PREDICT_ANSWER_WRONG_CLASS,
  PREDICT_SECTION_CLASS,
} from './TeacherCodeViewer.constants'

export default function TeacherCodeViewer({
  assignmentKind,
  editorKey,
  code,
  hasSubmission,
  fileTabs,
  activeFileIndex = 0,
  onSelectFile,
  studentName,
  assignmentTitle,
  submittedAt,
  passed,
  result,
  predictExpectedOutput,
  isAnswerVisible = false,
  onToggleAnswer,
  solution,
  isLoadingSolution = false,
  isSolutionVisible = false,
  onToggleSolution,
}: TeacherCodeViewerProps) {
  const isCode = assignmentKind === 'code'
  const isPredict = assignmentKind === 'predict'
  const isProject = assignmentKind === 'project'
  const isCompileError = result?.status === 'compile_error'
  const isRuntimeError = result?.status === 'runtime_error'

  return (
    <div className={VIEWER_CLASS}>
      {hasSubmission ? (
        /* Submission mode: who/what/when + pass/fail, matching the starter header's height */
        <div className={HEADER_CLASS}>
          <div className={HEADER_LEFT_CLASS}>
            <Icon name="terminal" />
            {studentName && <span className={HEADER_STUDENT_NAME_CLASS}>{studentName}</span>}
            {assignmentTitle && <span>· {assignmentTitle}</span>}
            {submittedAt && <span className={HEADER_SUBMITTED_AT_CLASS}>({submittedAt})</span>}
          </div>

          {passed !== undefined && passed !== null && (
            <span
              className={classNames(HEADER_BADGE_BASE_CLASS, passed ? HEADER_BADGE_PASSED_CLASS : HEADER_BADGE_FAILED_CLASS)}
            >
              <Icon name={passed ? 'check' : 'x'} />
              {passed ? 'PASSED' : 'FAILED'}
            </span>
          )}
        </div>
      ) : (
        /* Starter-code mode: same file-tabs strip students see, minus the Run button */
        isCode &&
        fileTabs &&
        fileTabs.length > 0 && (
          <div className={TABS_CLASS}>
            <div className={TABS_LIST_CLASS}>
              {fileTabs.map((file, index) => (
                <button
                  key={file.name + index}
                  type="button"
                  onClick={() => onSelectFile?.(index)}
                  className={classNames(TAB_BASE_CLASS, index === activeFileIndex ? TAB_ACTIVE_CLASS : TAB_IDLE_CLASS)}
                >
                  <Icon name="book" />
                  {file.name}
                </button>
              ))}
            </div>
            <span className={TABS_LABEL_CLASS}>Starter code</span>
          </div>
        )
      )}

      <div className={VIEWER_BODY_CLASS}>
      {/* Main area: readonly Monaco editor for code/predict; project's brief now
          renders in TeacherAssignmentPanel (matching the student view) — this
          column instead mirrors ProjectPanel's reference-solution reveal. */}
      {isProject ? (
        <div className={SOLUTION_WRAP_CLASS}>
          <div className={SOLUTION_BODY_CLASS}>
            <p className={SOLUTION_NOTE_CLASS}>
              {isSolutionVisible
                ? 'Reference solution — visible to you only.'
                : 'Reveal the reference solution to preview what students unlock after submitting.'}
            </p>
            {isSolutionVisible && solution && (
              <div className={SOLUTION_BLOCK_CLASS}>
                <span className={SOLUTION_LABEL_CLASS}>Reference solution</span>
                {solution.map((file) => (
                  <div key={file.name}>
                    <div className={SOLUTION_FILE_NAME_CLASS}>{file.name}</div>
                    <pre className={SOLUTION_FILE_CONTENT_CLASS}>{file.content}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={SOLUTION_FOOTER_CLASS}>
            <ShowAnswerButton
              onClick={onToggleSolution}
              isDisabled={isLoadingSolution}
              label={isLoadingSolution ? 'Loading…' : isSolutionVisible ? 'Hide reference solution' : 'Show reference solution'}
            />
          </div>
        </div>
      ) : (
        <CodeEditor
          value={code}
          onChange={() => {}}
          isReadOnly
          path={isCode ? `${editorKey}/${fileTabs?.[activeFileIndex]?.name ?? 'Main.java'}` : isPredict ? editorKey : undefined}
        />
      )}

      {/* Result panel — code: stored execution output; predict: student's answer vs. expected output */}
      {isCode && (
        <div className={RESULT_PANEL_CLASS}>
          <div className={RESULT_HEADER_CLASS}>
            <span>Execution Output</span>
            {result?.status && (
              <span
                className={classNames(
                  RESULT_STATUS_BASE_CLASS,
                  isCompileError || isRuntimeError ? RESULT_STATUS_ERROR_CLASS : RESULT_STATUS_OK_CLASS,
                )}
              >
                STATUS: {result.status}
              </span>
            )}
          </div>

          <div className={RESULT_BODY_CLASS}>
            {hasSubmission ? (
              <pre className={RESULT_PRE_CLASS}>{result?.stdout || result?.stderr || '(no output recorded)'}</pre>
            ) : (
              <p className={RESULT_PLACEHOLDER_CLASS}>Select a submission to see this run&rsquo;s output.</p>
            )}
          </div>
        </div>
      )}

      {isPredict && (
        <div className={RESULT_PANEL_CLASS}>
          <div className={RESULT_HEADER_CLASS}>
            <span>Predict Result</span>
            {hasSubmission && passed !== undefined && passed !== null && (
              <span
                className={classNames(RESULT_STATUS_BASE_CLASS, passed ? RESULT_STATUS_OK_CLASS : RESULT_STATUS_ERROR_CLASS)}
              >
                {passed ? 'CORRECT' : 'INCORRECT'}
              </span>
            )}
          </div>

          <div className={RESULT_BODY_CLASS}>
            {hasSubmission ? (
              <div className={PREDICT_SECTION_CLASS}>
                <div className={PREDICT_LABEL_CLASS}>Student&rsquo;s answer</div>
                <pre
                  className={classNames(
                    PREDICT_ANSWER_CLASS,
                    passed === true && PREDICT_ANSWER_CORRECT_CLASS,
                    passed === false && PREDICT_ANSWER_WRONG_CLASS,
                  )}
                >
                  {code || '(no answer recorded)'}
                </pre>
              </div>
            ) : (
              <p className={RESULT_PLACEHOLDER_CLASS}>Select a submission to see the student&rsquo;s prediction.</p>
            )}
            {isAnswerVisible && (
              <div className={PREDICT_SECTION_CLASS}>
                <div className={PREDICT_LABEL_CLASS}>Expected output</div>
                <pre className={PREDICT_ANSWER_CLASS}>{predictExpectedOutput || '(no expected output)'}</pre>
              </div>
            )}
          </div>

          <div className={ANSWER_FOOTER_CLASS}>
            <ShowAnswerButton onClick={onToggleAnswer} label={isAnswerVisible ? 'Hide answer' : 'Show answer'} />
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
