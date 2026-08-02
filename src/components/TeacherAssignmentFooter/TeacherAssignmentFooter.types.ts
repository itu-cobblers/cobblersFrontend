import type { ReactNode } from 'react'

export interface TeacherAssignmentFooterProps {
  isPredict?: boolean
  isCode?: boolean
  isProject?: boolean
  isAnswerVisible?: boolean
  isLoadingSolution?: boolean
  isSolutionVisible?: boolean
  onToggleAnswer?: () => void
  onToggleSolution?: () => void
  viewStatusLabel?: ReactNode
}