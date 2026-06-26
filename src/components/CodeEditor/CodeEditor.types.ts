export interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  /** Render the editor read-only (e.g. predict-the-output quizzes). */
  isReadOnly?: boolean
}
