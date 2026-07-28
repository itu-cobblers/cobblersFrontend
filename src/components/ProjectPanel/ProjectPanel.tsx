import { Icon } from '@components/Icon'
import { FileUpload } from '@components/FileUpload'
import { SubmitButton } from '@components/SubmitButton'
import { ShowAnswerButton } from '@components/ShowAnswerButton'
import type { ProjectPanelProps } from './ProjectPanel.types'
import { getProjectSubmitStatus } from './ProjectPanel.utils'
import {
  PROJECT_PANEL_CLASS,
  PROJECT_HEADER_CLASS,
  PROJECT_HEADER_LEFT_CLASS,
  PROJECT_HEADER_COUNT_CLASS,
  PROJECT_BODY_CLASS,
  PROJECT_NOTE_CLASS,
  PROJECT_FOOTER_CLASS,
  PROJECT_SOLUTION_CLASS,
  PROJECT_SOLUTION_LABEL_CLASS,
  PROJECT_SOLUTION_FILE_NAME_CLASS,
  PROJECT_SOLUTION_FILE_CONTENT_CLASS,
} from './ProjectPanel.constants'

/**
 * The bottom strip for `project` assignments — sits below the shared
 * CodeFileTabs + CodeEditor, replacing OutputPanel since there's no code to
 * run here. Lets the student drop/pick the .java files they built in VS Code
 * (editable afterwards in the tabs above), Submit to save the attempt, and
 * reveal the reference solution once submitted at least once.
 */
export default function ProjectPanel({
  files,
  onFilesChange,
  hasSubmitted,
  isSubmitting,
  lastSubmitPassed,
  onSubmit,
  isLoadingSolution,
  solution,
  onRevealSolution,
}: ProjectPanelProps) {
  return (
    <div className={PROJECT_PANEL_CLASS}>
      <div className={PROJECT_HEADER_CLASS}>
        <span className={PROJECT_HEADER_LEFT_CLASS}>
          <Icon name="upload" />
          Upload files
        </span>
        {files.length > 0 && (
          <span className={PROJECT_HEADER_COUNT_CLASS}>
            {files.length} file{files.length > 1 ? 's' : ''} loaded
          </span>
        )}
      </div>
      <div className={PROJECT_BODY_CLASS}>
        <FileUpload files={files} onFilesChange={onFilesChange} />
        <span className={PROJECT_NOTE_CLASS}>
          {hasSubmitted
            ? 'Submitted — you can reveal the reference solution whenever you like.'
            : 'Upload your .java files (including a Main) — edit them in the tabs above if you need to. Submit to save your attempt and unlock the reference solution.'}
        </span>
        {solution && (
          <div className={PROJECT_SOLUTION_CLASS}>
            <span className={PROJECT_SOLUTION_LABEL_CLASS}>Reference solution</span>
            {solution.map((file) => (
              <div key={file.name}>
                <div className={PROJECT_SOLUTION_FILE_NAME_CLASS}>{file.name}</div>
                <pre className={PROJECT_SOLUTION_FILE_CONTENT_CLASS}>{file.content}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={PROJECT_FOOTER_CLASS}>
        <ShowAnswerButton
          onClick={onRevealSolution}
          isDisabled={!hasSubmitted || isLoadingSolution}
          label={isLoadingSolution ? 'Loading…' : 'Show reference solution'}
        />
        <SubmitButton
          status={getProjectSubmitStatus(isSubmitting, lastSubmitPassed)}
          onClick={onSubmit}
          isDisabled={files.length === 0}
        />
      </div>
    </div>
  )
}
