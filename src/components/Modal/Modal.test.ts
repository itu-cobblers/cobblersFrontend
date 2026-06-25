import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(createElement(Modal, { isOpen: false, onClose: vi.fn(), children: 'Body' }))
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('closes on overlay click when allowed', () => {
    const handleClose = vi.fn()
    const { container } = render(createElement(Modal, { isOpen: true, onClose: handleClose, children: 'Body' }))
    const overlay = container.firstElementChild
    expect(overlay).not.toBeNull()
    if (overlay) fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('does not close when clicking the dialog body', () => {
    const handleClose = vi.fn()
    render(createElement(Modal, { isOpen: true, onClose: handleClose, children: 'Body' }))
    fireEvent.click(screen.getByRole('dialog'))
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('ignores overlay clicks when closeOnOverlay is false', () => {
    const handleClose = vi.fn()
    const { container } = render(
      createElement(Modal, { isOpen: true, closeOnOverlay: false, onClose: handleClose, children: 'Body' }),
    )
    const overlay = container.firstElementChild
    expect(overlay).not.toBeNull()
    if (overlay) fireEvent.click(overlay)
    expect(handleClose).not.toHaveBeenCalled()
  })
})
