import classNames from 'classnames'
import type { ToastProps } from './Toast.types'
import {
  TOAST_WRAP_CLASS,
  TOAST_TONE_CLASS,
  TOAST_MESSAGE_CLASS,
  TOAST_DISMISS_CLASS,
} from './Toast.constants'

export default function Toast({ message, tone, onDismiss }: ToastProps) {
  return (
    <div className={classNames(TOAST_WRAP_CLASS, TOAST_TONE_CLASS[tone])} role="alert">
      <span className={TOAST_MESSAGE_CLASS}>{message}</span>
      <button type="button" className={TOAST_DISMISS_CLASS} onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
