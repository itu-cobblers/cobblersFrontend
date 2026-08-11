import classNames from 'classnames'
import type { ViewMode, ViewModeToggleProps } from '@/components'
import { TOGGLE_CLASS, TOGGLE_BUTTON_CLASS, TOGGLE_BUTTON_ACTIVE_CLASS, TOGGLE_BUTTON_IDLE_CLASS, TOGGLE_LABEL } from './ViewModeToggle.constants'

const MODES: ViewMode[] = ['slides', 'practice']

/** Slides / Practice switcher — dropped into `AppHeader`'s `actions` slot so one control sits above both top-level views. */
export default function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className={TOGGLE_CLASS}>
      {MODES.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={classNames(TOGGLE_BUTTON_CLASS, mode === viewMode ? TOGGLE_BUTTON_ACTIVE_CLASS : TOGGLE_BUTTON_IDLE_CLASS)}
        >
          {TOGGLE_LABEL[mode]}
        </button>
      ))}
    </div>
  )
}
