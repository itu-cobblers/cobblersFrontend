import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import type { SubmissionResult } from '@types'
import SubmitModal from './SubmitModal'

const accepted: SubmissionResult = {
  status: 'success',
  stdout: 'Hi\n',
  stderr: '',
  accepted: true,
  message: 'Submitted! ✅',
}

const rejected: SubmissionResult = {
  status: 'runtime_error',
  stdout: '',
  stderr: 'NullPointerException',
  accepted: false,
  message: 'Your code crashed.',
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
    expect(screen.getByText('Submitted! ✅')).toBeInTheDocument()
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
    expect(screen.getByText('Not submitted')).toBeInTheDocument()
    expect(screen.getByText('NullPointerException')).toBeInTheDocument()
  })
})
