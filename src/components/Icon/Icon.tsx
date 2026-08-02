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
  users: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="5.4" cy="5" r="2.3" />
      <path d="M1.6 12c0-2.1 1.7-3.5 3.8-3.5S9.2 9.9 9.2 12" strokeLinecap="round" />
      <path d="M9.6 3c1.2 0 2.1.9 2.1 2.1S10.8 7.2 9.6 7.2" strokeLinecap="round" />
      <path d="M10.4 8.8c1.3.3 2.2 1.4 2.2 3.2" strokeLinecap="round" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2.5 5 7 9.5 11.5 5" strokeLinecap="round" strokeLinejoin="round" />
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
  refresh: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M11.8 7a4.8 4.8 0 1 1-1.6-3.6" strokeLinecap="round" />
      <path d="M11.8 2v3h-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  upload: (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M7 9.5V2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4.5 7 1.5l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9.5v1.8c0 .66.54 1.2 1.2 1.2h7.6c.66 0 1.2-.54 1.2-1.2V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  externalLink: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         className="icon icon-tabler icons-tabler-outline icon-tabler-external-link">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"/>
        <path d="M11 13l9 -9"/>
        <path d="M15 4h5v5"/>
    </svg>
  ),
  arrowBack: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1"/>
    </svg>
  ),
  pencil: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         className="icon icon-tabler icons-tabler-outline icon-tabler-pencil">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>
        <path d="M13.5 6.5l4 4"/>
    </svg>
  ),
  pencilOff: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         className="icon icon-tabler icons-tabler-outline icon-tabler-pencil-off">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5"/>
        <path d="M13.5 6.5l4 4"/>
        <path d="M3 3l18 18"/>
    </svg>
  ),
  code: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         className="icon icon-tabler icons-tabler-outline icon-tabler-code">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 8l-4 4l4 4"/>
        <path d="M17 8l4 4l-4 4"/>
        <path d="M14 4l-4 16"/>
    </svg>
  )
}

export default function Icon({name}: IconProps) {
    return ICONS[name]
}
