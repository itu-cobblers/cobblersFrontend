import { type MouseEvent } from 'react'
import classNames from 'classnames'
import type { ModalProps } from './Modal.types'
import { MODAL_OVERLAY_CLASS, MODAL_DIALOG_CLASS } from './Modal.constants'
import { useEscapeToClose } from './Modal.hooks'

export default function Modal({ isOpen, onClose, closeOnOverlay = true, children }: ModalProps) {
  useEscapeToClose(isOpen && closeOnOverlay, onClose)

  function handleOverlayClick() {
    if (closeOnOverlay) onClose()
  }

  function handleDialogClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <div className={classNames(MODAL_OVERLAY_CLASS)} onClick={handleOverlayClick}>
      <div
        role="dialog"
        aria-modal="true"
        className={classNames(MODAL_DIALOG_CLASS)}
        onClick={handleDialogClick}
      >
        {children}
      </div>
    </div>
  )
}
