import classNames from 'classnames'
import { Modal } from '@components/Modal'
import { Button } from '@components/Button'
import type { SubmitModalProps } from './SubmitModal.types'
import { getSubmitResultView } from './SubmitModal.utils'
import {
  MODAL_BADGE_BASE_CLASS,
  MODAL_BADGE_OK_CLASS,
  MODAL_BADGE_BAD_CLASS,
  MODAL_TITLE_CLASS,
  MODAL_TEXT_CLASS,
  MODAL_STDERR_CLASS,
  MODAL_ACTIONS_CLASS,
} from './SubmitModal.constants'

/**
 * Submit flow dialog. Two presentational states in one modal:
 *  - no `result` → confirmation
 *  - `result` present → verdict + feedback
 */
export default function SubmitModal({
  isOpen,
  isSubmitting,
  result,
  onConfirm,
  onCancel,
  onClose,
}: SubmitModalProps) {
  const view = result ? getSubmitResultView(result) : null
  const handleOverlayClose = view ? onClose : onCancel
  const confirmLabel = isSubmitting ? 'Submitting…' : 'Yes, submit'

  return (
    <Modal isOpen={isOpen} onClose={handleOverlayClose} closeOnOverlay={!isSubmitting}>
      {view ? (
        <>
          <div
            className={classNames(MODAL_BADGE_BASE_CLASS, {
              [MODAL_BADGE_OK_CLASS]: view.isAccepted,
              [MODAL_BADGE_BAD_CLASS]: !view.isAccepted,
            })}
          >
            {view.badge}
          </div>
          <h3 className={MODAL_TITLE_CLASS}>{view.title}</h3>
          <p className={MODAL_TEXT_CLASS}>{view.message}</p>
          {view.stderr && <pre className={MODAL_STDERR_CLASS}>{view.stderr}</pre>}
          <div className={MODAL_ACTIONS_CLASS}>
            <Button onClick={onClose}>Close</Button>
          </div>
        </>
      ) : (
        <>
          <h3 className={MODAL_TITLE_CLASS}>Submit to your teacher?</h3>
          <p className={MODAL_TEXT_CLASS}>
            Are you sure the code is running and ready to submit to the teacher?
          </p>
          <div className={MODAL_ACTIONS_CLASS}>
            <Button variant="ghost" onClick={onCancel} isDisabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={onConfirm} isLoading={isSubmitting}>
              {confirmLabel}
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}
