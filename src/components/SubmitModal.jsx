/**
 * Submit flow dialog. Two states in one modal:
 *  - no `result` yet → confirmation ("are you sure…?")
 *  - `result` present → the submission verdict (accepted / not) + feedback
 */
export default function SubmitModal({ open, isSubmitting, result, onConfirm, onCancel, onClose }) {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={isSubmitting ? undefined : (result ? onClose : onCancel)}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {result ? (
          <>
            <div className={`modal-badge ${result.accepted ? 'is-ok' : 'is-bad'}`}>
              {result.accepted ? '✓' : '!'}
            </div>
            <h3 className="modal-title">{result.accepted ? 'Submitted' : 'Not submitted'}</h3>
            <p className="modal-text">{result.message}</p>
            {result.stderr?.trim() && (
              <pre className="modal-stderr">{result.stderr}</pre>
            )}
            <div className="modal-actions">
              <button className="run-btn" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="modal-title">Submit to your teacher?</h3>
            <p className="modal-text">
              Are you sure the code is running and ready to submit to the teacher?
            </p>
            <div className="modal-actions">
              <button className="ghost-btn" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </button>
              <button className="run-btn" onClick={onConfirm} disabled={isSubmitting}>
                {isSubmitting && <span className="spinner" />}
                {isSubmitting ? 'Submitting…' : 'Yes, submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
