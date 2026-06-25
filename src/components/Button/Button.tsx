import classNames from 'classnames'
import { Spinner } from '@components/Spinner'
import type { ButtonProps } from './Button.types'
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS, BUTTON_SPINNER_VARIANT } from './Button.constants'

export default function Button({
  variant = 'primary',
  type = 'button',
  isLoading = false,
  isDisabled = false,
  onClick,
  title,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      title={title}
      className={classNames(BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS[variant])}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading && <Spinner variant={BUTTON_SPINNER_VARIANT[variant]} />}
      {children}
    </button>
  )
}
