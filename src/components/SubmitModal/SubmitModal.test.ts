import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import type { SubmissionResult } from '@types'
import SubmitModal from './SubmitModal'

const accepted: SubmissionResult = {
  subId: 'sub-1',
  passed: true,
  result: { status: 'success', stdout: 'Hi\n', stderr: '' },
  submittedAt: '2026-06-19T14:30:00Z',
}

const rejected: SubmissionResult = {
  subId: 'sub-2',
  passed: false,
  result: { status: 'runtime_error', stdout: '', stderr: 'NullPointerException' },
  submittedAt: '2026-06-19T14:31:00Z',
}

describe('SubmitModal', () => {
  it('shows the confirmation step and fires onConfirm', () => {
    const onConfirm = vi.fn()
    render(
      createElement(SubmitModal, {
        isOpen: true,
        isSubmitting: false,
        result: null,
        onConfirm,
        onCancel: vi.fn(),
        onClose: vi.fn(),
      }),
    )
    expect(screen.getByText('Submit to your teacher?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Yes, submit'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('shows the accepted verdict', () => {
    render(
      createElement(SubmitModal, {
        isOpen: true,
        isSubmitting: false,
        result: accepted,
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
        onClose: vi.fn(),
      }),
    )
    expect(screen.getByText('Submitted')).toBeInTheDocument()
    expect(screen.getByText(/Well done/)).toBeInTheDocument()
  })

  it('shows stderr for a rejected verdict', () => {
    render(
      createElement(SubmitModal, {
        isOpen: true,
        isSubmitting: false,
        result: rejected,
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
        onClose: vi.fn(),
      }),
    )
    expect(screen.getByText('Not quite yet')).toBeInTheDocument()
    expect(screen.getByText('NullPointerException')).toBeInTheDocument()
  })
})
