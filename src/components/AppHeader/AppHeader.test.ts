import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AppHeader from './AppHeader'

describe('AppHeader', () => {
  it('renders the ITU BootIT lockup as two boxes', () => {
    render(createElement(AppHeader))
    expect(screen.getByText('ITU')).toBeInTheDocument()
    expect(screen.getByText('BootIT')).toBeInTheDocument()
  })

  it('hides the decorative photo from assistive tech', () => {
    const { container } = render(createElement(AppHeader))
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('alt', '')
    expect(image).toHaveAttribute('aria-hidden', 'true')
  })

  it('exposes an empty nav landmark for the buttons still to come', () => {
    render(createElement(AppHeader))
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeEmptyDOMElement()
  })

  it('renders no leave action unless a handler is given', () => {
    render(createElement(AppHeader))
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeEmptyDOMElement()
  })

  it('shows the room code and signed-in name in the action strip', () => {
    render(createElement(AppHeader, {
      variant: 'bar' as const,
      sessionLabel: 'Room: A8RT',
      displayName: 'Aiting',
    }))
    expect(screen.getByText('Room: A8RT')).toBeInTheDocument()
    expect(screen.getByText('Aiting')).toBeInTheDocument()
  })

  it('orders the strip room code, signed-in name, then the leave action', () => {
    render(createElement(AppHeader, {
      variant: 'bar' as const,
      sessionLabel: 'Room: A8RT',
      displayName: 'Aiting',
      onLeaveSession: vi.fn(),
      leaveLabel: 'Exit',
    }))
    const strip = screen.getByRole('navigation', { name: 'Main' })
    expect(strip.textContent).toBe('Room: A8RTSigned in as AitingExit')
  })

  it('fires onLeaveSession from the action in the top-right', () => {
    const onLeaveSession = vi.fn()
    render(createElement(AppHeader, { variant: 'bar' as const, onLeaveSession, leaveLabel: 'Exit' }))
    fireEvent.click(screen.getByRole('button', { name: 'Exit' }))
    expect(onLeaveSession).toHaveBeenCalledOnce()
  })

  it('shows no section name by default', () => {
    const { container } = render(createElement(AppHeader))
    expect(container).not.toHaveTextContent('/')
  })

  it('appends a section name after the lockup when given one', () => {
    render(createElement(AppHeader, { variant: 'bar' as const, section: 'BootCode' }))
    expect(screen.getByText('BootCode')).toBeInTheDocument()
    expect(screen.getByText('ITU')).toBeInTheDocument()
    expect(screen.getByText('BootIT')).toBeInTheDocument()
  })

  // The bar has to match the 40px row height the rails and toolbar use.
  it('renders the bar variant at the rails\' row height, not the hero band height', () => {
    const { container } = render(createElement(AppHeader, { variant: 'bar' as const }))
    const band = container.querySelector('header')
    expect(band).toHaveClass('h-10')
    expect(band).not.toHaveClass('h-[261px]')
  })
})
