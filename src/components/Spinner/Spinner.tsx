import classNames from 'classnames'
import type { SpinnerProps } from './Spinner.types'
import { SPINNER_BASE_CLASS, SPINNER_VARIANT_CLASS } from './Spinner.constants'

export default function Spinner({ variant = 'solid' }: SpinnerProps) {
  return <span className={classNames(SPINNER_BASE_CLASS, SPINNER_VARIANT_CLASS[variant])} />
}
