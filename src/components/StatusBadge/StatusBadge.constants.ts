import type {ProblemStatus} from "@components";

export const STATUS_ICON = {
  passed: 'check',
  tried: 'alert',
  untried: null
} as const

/**
 * `untried` has no glyph (see STATUS_ICON), so its ring is the whole signal —
 * it has to be visible on its own. It previously read `bg-color-secondary`,
 * which isn't a real utility, so it generated nothing and the badge was
 * invisible on the white rail.
 */
export const STATUS_COLORS: Record<ProblemStatus, string> = {
  passed: 'bg-status-success/15 text-status-success',
  tried: 'bg-status-warning/15 text-status-warning',
  untried: 'bg-foreground/15 text-muted-foreground',
}

export const SIZE_CLASSES = {
  s: 'h-4 w-4 text-[10px]',
  m: 'h-6 w-6 text-sm',
  l: 'h-8 w-8 text-base',
}