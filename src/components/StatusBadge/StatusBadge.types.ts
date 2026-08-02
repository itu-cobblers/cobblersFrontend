export type ProblemStatus = 'untried' | 'tried' | 'passed'

export interface StatusBadgeProps {
  status: ProblemStatus
  size?: 's' | 'm' | 'l'
  label?: React.ReactNode
  className?: string
}
