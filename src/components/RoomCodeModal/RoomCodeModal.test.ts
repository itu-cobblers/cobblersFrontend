import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RoomCodeModal from './RoomCodeModal'

const base = { sessionCode: 'P4FN', onClose: vi.fn() }

describe('RoomCodeModal', () => {
  it('renders nothing while closed', () => {
    render(createElement(RoomCodeModal, { ...base, isOpen: false }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the room code when open', () => {
    render(createElement(RoomCodeModal, { ...base, isOpen: true }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('P4FN')).toBeInTheDocument()
  })

  it('closes on Escape, so it can be dismissed without hunting for a button', () => {
    const onClose = vi.fn()
    render(createElement(RoomCodeModal, { ...base, onClose, isOpen: true }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})
