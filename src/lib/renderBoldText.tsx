import type { ReactNode } from 'react'

const BOLD_SPLIT_PATTERN = /(\*\*.+?\*\*)/g
const BOLD_MATCH_PATTERN = /^\*\*(.+)\*\*$/

/** Renders `**bold**` spans in plain text as `<strong>`; everything else passes through unchanged. */
export function renderBoldText(text: string): ReactNode[] {
  return text.split(BOLD_SPLIT_PATTERN).map((segment, index) => {
    const match = segment.match(BOLD_MATCH_PATTERN)
    return match ? <strong key={index}>{match[1]}</strong> : segment
  })
}
