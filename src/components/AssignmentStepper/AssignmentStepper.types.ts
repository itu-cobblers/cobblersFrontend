export interface StepperStep {
  id: number
  title: string
  isDone: boolean
  isActive: boolean
}

export interface AssignmentStepperProps {
  steps: StepperStep[]
  onSelect: (id: number) => void
}
