import type { ReactElement } from 'react'
import type { IconName, IconProps } from './Icon.types'

/** Inline SVGs keyed by name. `currentColor` lets the parent control the color. */
const ICONS: Record<IconName, ReactElement> = {
  menu: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="1" y1="3" x2="13" y2="3" />
      <line x1="1" y1="7" x2="13" y2="7" />
      <line x1="1" y1="11" x2="13" y2="11" />
    </svg>
  ),
  play: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <polygon points="2,1 13,7 2,13" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.3" y="6" width="1.4" height="4.5" rx="0.7" fill="currentColor" />
      <rect x="6.3" y="3.4" width="1.4" height="1.4" rx="0.7" fill="currentColor" />
    </svg>
  ),
}

export default function Icon({ name }: IconProps) {
  return ICONS[name]
}
