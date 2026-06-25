import classNames from 'classnames'
import type { BadgeProps } from './Badge.types'
import { BADGE_TONE_CLASS } from './Badge.constants'

export default function Badge({ tone, children }: BadgeProps) {
  return <span className={classNames(BADGE_TONE_CLASS[tone])}>{children}</span>
}
