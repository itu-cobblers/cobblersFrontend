export interface RunMenuAction {
  id: 'run' | 'submit'
  label: string
  onSelect: () => void
  isDisabled?: boolean
}

export interface RunMenuProps {
  /** Required: assignments with nothing to run use SubmitButton instead. */
  onRun: () => void
  onSubmit: () => void
  isRunning?: boolean
  isSubmitting?: boolean
  isSubmitDisabled?: boolean
}
