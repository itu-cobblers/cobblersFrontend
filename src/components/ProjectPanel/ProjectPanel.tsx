import { Button } from '@components/Button'
import { FileUpload } from '@components/FileUpload'
import { OutputPanel } from '@components/OutputPanel'
import type { ProjectPanelProps } from './ProjectPanel.types'
import {
  PROJECT_PANEL_CLASS,
  PROJECT_CONTROLS_CLASS,
  PROJECT_NOTE_CLASS,
} from './ProjectPanel.constants'

/**
 * Mini-project panel: lets the student upload the .java files they built in
 * VS Code, runs them via the executor, and shows stdout. The project brief is
 * rendered by the assignment panel. Per-test grading is scaffolded for later —
 * running successfully is enough for now.
 */
export default function ProjectPanel({
  files,
  output,
  status,
  isRunning,
  onFilesChange,
  onRun,
}: ProjectPanelProps) {
  return (
    <div className={PROJECT_PANEL_CLASS}>
      <div className={PROJECT_CONTROLS_CLASS}>
        <FileUpload files={files} onFilesChange={onFilesChange} />
        <Button onClick={onRun} isLoading={isRunning} isDisabled={files.length === 0}>
          Run uploaded files
        </Button>
        <span className={PROJECT_NOTE_CLASS}>
          Upload your .java files (including a Main), then Run. Full test-case grading is coming soon.
        </span>
      </div>
      <OutputPanel output={output} status={status} />
    </div>
  )
}
