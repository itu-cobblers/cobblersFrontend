import type { Difficulty } from '@types'

export interface TaskItemProps {
  id: number
  title: string
  difficulty: Difficulty
  isActive: boolean
  isDone: boolean
  onSelect: (id: number) => void
}
