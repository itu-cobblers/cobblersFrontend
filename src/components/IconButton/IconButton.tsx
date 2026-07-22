import classNames from 'classnames'
import { Spinner } from '@components/Spinner'
import type { IconButtonProps } from './IconButton.types'
import { ICON_BUTTON_CLASS } from './IconButton.constants'

export default function IconButton({
  label,
  isDisabled = false,
  isLoading = false,
  onClick,
  title,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title ?? label}
      className={classNames(ICON_BUTTON_CLASS)}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Spinner variant="action" /> : children}
    </button>
  )
}
