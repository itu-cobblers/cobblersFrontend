/** Which top-level view the site is showing — the Slides deck or the Practice workspace. */
export type ViewMode = 'slides' | 'practice'

export interface ViewModeToggleProps {
  viewMode: ViewMode
  onChange: (mode: ViewMode) => void
}
