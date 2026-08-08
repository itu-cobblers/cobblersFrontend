export type ProblemStatus = 'untried' | 'tried' | 'passed' | 'error'

export interface StatusBadgeProps {
  status: ProblemStatus
  size?: 's' | 'm' | 'l'
  label?: React.ReactNode
  className?: string
}
