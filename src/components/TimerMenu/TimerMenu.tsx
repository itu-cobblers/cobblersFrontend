import { type ChangeEvent } from 'react'
import { Icon } from '@components/Icon'
import { useMenuDisclosure } from '@hooks/useMenuDisclosure'
import type { TimerMenuProps } from './TimerMenu.types'
import { formatTimerEnds } from './TimerMenu.utils'
import {
  TIMER_MENU_WRAPPER_CLASS,
  TIMER_MENU_TRIGGER_CLASS,
  TIMER_MENU_PANEL_CLASS,
  TIMER_MENU_ROW_CLASS,
  TIMER_MENU_INPUT_CLASS,
  TIMER_MENU_UNIT_CLASS,
  TIMER_MENU_START_CLASS,
  TIMER_MENU_ERROR_CLASS,
  TIMER_MENU_IDLE_LABEL,
} from './TimerMenu.constants'

/**
 * The classroom timer, as a header chip: shows the end time while one is
 * running, and drops down to set a new one. Used to be a collapsible section
 * inside the assignment rail, which cost a permanent block of rail height for a
 * control the teacher touches once a session.
 */
export default function TimerMenu({
  minutes,
  onMinutesChange,
  onStartTimer,
  isStartingTimer = false,
  timerEndsAt,
  timerError,
}: TimerMenuProps) {
  const { isOpen, setIsOpen, wrapperRef } = useMenuDisclosure()

  const label = timerEndsAt ? formatTimerEnds(timerEndsAt) : TIMER_MENU_IDLE_LABEL

  function handleMinutesInput(event: ChangeEvent<HTMLInputElement>) {
    onMinutesChange(Number(event.target.value))
  }

  function handleToggle() {
    setIsOpen(!isOpen)
  }

  function handleStart() {
    setIsOpen(false)
    onStartTimer()
  }

  return (
    <div className={TIMER_MENU_WRAPPER_CLASS} ref={wrapperRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={TIMER_MENU_TRIGGER_CLASS}
      >
        <Icon name="history" />
        {label}
      </button>

      {isOpen && (
        <div className={TIMER_MENU_PANEL_CLASS}>
          <div className={TIMER_MENU_ROW_CLASS}>
            <input
              type="number"
              min={1}
              max={120}
              value={minutes}
              onChange={handleMinutesInput}
              aria-label="Timer minutes"
              className={TIMER_MENU_INPUT_CLASS}
            />
            <span className={TIMER_MENU_UNIT_CLASS}>min</span>
            <button
              type="button"
              onClick={handleStart}
              disabled={isStartingTimer}
              className={TIMER_MENU_START_CLASS}
            >
              {isStartingTimer ? 'Starting…' : 'Start'}
            </button>
          </div>
          {timerError && <p className={TIMER_MENU_ERROR_CLASS}>{timerError}</p>}
        </div>
      )}
    </div>
  )
}
