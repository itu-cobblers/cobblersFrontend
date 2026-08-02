import type {ProblemStatus} from "@components";

export const STATUS_ICON = {
  passed: 'check',
  tried: 'alert',
  untried: null
} as const

export const STATUS_COLORS: Record<ProblemStatus, string> = {
  passed: 'bg-status-success/15 text-status-success',
  tried: 'bg-status-warning/15 text-status-warning',
  untried: 'bg-color-secondary/15 text-color-secondary',
}

export const SIZE_CLASSES = {
  s: 'h-4 w-4 text-[10px]',
  m: 'h-6 w-6 text-sm',
  l: 'h-8 w-8 text-base',
}