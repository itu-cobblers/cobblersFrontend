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
  terminal: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2 4.2 5.2 7 2 9.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="9.8" x2="12" y2="9.8" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M2 2.5c1.3-.6 3-.6 4.5 0v9c-1.5-.6-3.2-.6-4.5 0v-9Z" strokeLinejoin="round" />
      <path d="M12 2.5c-1.3-.6-3-.6-4.5 0v9c1.5-.6 3.2-.6 4.5 0v-9Z" strokeLinejoin="round" />
    </svg>
  ),
  history: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="7" cy="7.5" r="5.2" />
      <path d="M7 4.5v3l2 1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 2v2.5H5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 4.5 12.5 7l-3 2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 7h-7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronsLeft: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M8.5 2.5 4 7l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 2.5 7 7l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronsRight: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M5.5 2.5 10 7l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 2.5 7 7l-4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2.5 7.3 5.5 10.5 11.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
    </svg>
  ),
  circle: (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="5" />
    </svg>
  ),
  arrowUp: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 11.5V2.5" strokeLinecap="round" />
      <path d="M3 6.3 7 2.3l4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  alert: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.3" y="3.5" width="1.4" height="4.3" rx="0.7" fill="currentColor" />
      <rect x="6.3" y="9.3" width="1.4" height="1.4" rx="0.7" fill="currentColor" />
    </svg>
  ),
  spinner: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.6" />
      <path d="M12.5 7a5.5 5.5 0 0 0-5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
}

export default function Icon({ name }: IconProps) {
  return ICONS[name]
}
