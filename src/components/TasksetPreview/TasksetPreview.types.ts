import type { TaskKind } from '@types'

export interface TasksetPreviewEntry {
  id: number
  title: string
  kind: TaskKind
  description: string
  hint?: string
}

export interface TasksetPreviewGroup {
  label: string
  items: TasksetPreviewEntry[]
}

export interface TasksetPreviewProps {
  /** Optional heading shown above the groups (e.g. the taskset title). */
  title?: string
  groups: TasksetPreviewGroup[]
}
