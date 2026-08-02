export interface TimerMenuProps {
  minutes: number
  onMinutesChange: (minutes: number) => void
  onStartTimer: () => void
  isStartingTimer?: boolean
  /** ISO string while a timer is running; null when none is set. */
  timerEndsAt?: string | null
  timerError?: string | null
}
