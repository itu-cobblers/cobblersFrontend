import { Icon } from '@components/Icon'
import { FileUpload } from '@components/FileUpload'
import { AssignmentFooter } from '@components/AssignmentFooter'
import type { ProjectPanelProps } from './ProjectPanel.types'
import { getProjectSubmitStatus } from './ProjectPanel.utils'
import {
  PROJECT_PANEL_CLASS,
  PROJECT_HEADER_CLASS,
  PROJECT_HEADER_LEFT_CLASS,
  PROJECT_HEADER_COUNT_CLASS,
  PROJECT_BODY_CLASS,
  PROJECT_NOTE_CLASS,
} from './ProjectPanel.constants'

/**
 * The bottom strip for `project` assignments — sits below the shared
 * CodeFileTabs + CodeEditor, replacing OutputPanel since there's no code to
 * run here. Lets the student drop/pick the .java files they built in VS Code
 * (editable afterwards in the tabs above), Submit to save the attempt, and
 * reveal the reference solution in those same IDE tabs once submitted.
 */
export default function ProjectPanel({
  files,
  onFilesChange,
  hasSubmitted,
  isSubmitting,
  lastSubmitPassed,
  onSubmit,
  isLoadingSolution,
  isSolutionVisible,
  onToggleSolution,
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
            ? 'Submitted — you can reveal the reference answer in the editor tabs above whenever you like.'
            : 'Upload your .java files (including a Main) — edit them in the tabs above if you need to. Submit to save your attempt and unlock the reference answer.'}
        </span>
      </div>
      <AssignmentFooter
        submitStatus={getProjectSubmitStatus(isSubmitting, lastSubmitPassed)}
        onSubmit={onSubmit}
        isSubmitDisabled={files.length === 0}
        canRevealAnswer={hasSubmitted}
        isSolutionVisible={isSolutionVisible}
        isLoadingSolution={isLoadingSolution}
        onToggleSolution={onToggleSolution}
      />
    </div>
  )
}
