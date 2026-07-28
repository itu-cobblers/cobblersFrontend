import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement } from 'react'
import { render, screen, act } from '@testing-library/react'
import { useCountdown } from './useCountdown'

/** Renders the hook's return value as text so behavior can be asserted via testing-library. */
function Probe({ endsAt }: { endsAt: string | null }) {
  const remainingSeconds = useCountdown(endsAt)
  return createElement('div', null, remainingSeconds === null ? 'null' : String(remainingSeconds))
}

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-27T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null when endsAt is null', () => {
    render(createElement(Probe, { endsAt: null }))
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('computes the initial remaining seconds from endsAt', () => {
    render(createElement(Probe, { endsAt: '2026-07-27T12:00:10.000Z' }))
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('ticks down once a second', () => {
    render(createElement(Probe, { endsAt: '2026-07-27T12:00:10.000Z' }))
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('clamps to zero and never goes negative', () => {
    render(createElement(Probe, { endsAt: '2026-07-27T12:00:02.000Z' }))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('recomputes immediately when endsAt changes to a different assignment', () => {
    const { rerender } = render(createElement(Probe, { endsAt: '2026-07-27T12:00:10.000Z' }))
    rerender(createElement(Probe, { endsAt: null }))
    expect(screen.getByText('null')).toBeInTheDocument()
  })
})
