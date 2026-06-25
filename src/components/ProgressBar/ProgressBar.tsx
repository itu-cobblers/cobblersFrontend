import type { ProgressBarProps } from './ProgressBar.types'
import { PROGRESS_TRACK_CLASS, PROGRESS_FILL_CLASS } from './ProgressBar.constants'
import { getProgressPercent } from './ProgressBar.utils'

export default function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = getProgressPercent(value, max)
  return (
    <div className={PROGRESS_TRACK_CLASS}>
      <div className={PROGRESS_FILL_CLASS} style={{ width: `${percent}%` }} />
    </div>
  )
}
