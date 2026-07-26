import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EntryPortal from './EntryPortal.tsx'

const baseProps = {
  name: '',
  code: '',
  mode: 'join' as const,
  isJoining: false,
  isStartingSolo: false,
  onNameChange: vi.fn(),
  onCodeChange: vi.fn(),
  onModeChange: vi.fn(),
  onJoin: vi.fn(),
  onStartSolo: vi.fn(),
}

describe('EntryPortal', () => {
  it('disables Join a class until a name and code are entered', () => {
    render(createElement(EntryPortal, baseProps))
    const ctaButton = screen.getAllByText('Join a class').find((el) => (el as HTMLButtonElement).disabled)
    expect(ctaButton).toBeDefined()
  })

  it('fires onStartSolo when solo practice is chosen and a name is present', () => {
    const onStartSolo = vi.fn()
    render(createElement(EntryPortal, { ...baseProps, name: 'Maria', mode: 'solo', onStartSolo }))
    fireEvent.click(screen.getByText('Start solo practice'))
    expect(onStartSolo).toHaveBeenCalledOnce()
  })
})
