import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProblemsList from './ProblemsList'
import type { ProblemListItem } from './ProblemsList.types'
import { formatSubmittedAt } from './ProblemsList.utils'

const sessionItems: ProblemListItem[] = [
  { id: 1, title: 'Hello, World!', kind: 'code', status: 'passed' },
  { id: 2, title: 'Predict this', kind: 'predict', status: 'tried' },
  { id: 3, title: 'Build a Tree', kind: 'project', status: 'untried' },
]

const historyItems: ProblemListItem[] = [
  { id: 1, title: 'Hello, World!', kind: 'code', status: 'passed' },
  { id: 10, title: 'Yesterday quiz', kind: 'predict', status: 'passed' },
]

const baseProps = {
  activeTab: 'session' as const,
  onTabChange: vi.fn(),
  sessionItems,
  historyItems,
  activeId: 1,
  onSelect: vi.fn(),
  isOpen: true,
  onToggleOpen: vi.fn(),
}

describe('ProblemsList', () => {
  it('renders one row per session item with its title', () => {
    render(createElement(ProblemsList, baseProps))
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
    expect(screen.getByText('Predict this')).toBeInTheDocument()
    expect(screen.getByText('Build a Tree')).toBeInTheDocument()
  })

  // The History toggle lives in the footer, beside the Tried/Passed legend,
  // rather than at the top of the rail — but it still needs a way in.
  it('renders a View history toggle', () => {
    render(createElement(ProblemsList, baseProps))
    expect(screen.getByLabelText('View submission history')).toHaveTextContent('View history')
  })

  it('switches to history when the History toggle is clicked', () => {
    const onTabChange = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, onTabChange }))
    fireEvent.click(screen.getByLabelText('View submission history'))
    expect(onTabChange).toHaveBeenCalledWith('history')
  })

  it('switches back to session when the History toggle is clicked while active', () => {
    const onTabChange = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, activeTab: 'history', onTabChange }))
    fireEvent.click(screen.getByLabelText('View submission history'))
    expect(onTabChange).toHaveBeenCalledWith('session')
  })

  it('renders history items instead when the History tab is active', () => {
    render(createElement(ProblemsList, { ...baseProps, activeTab: 'history' }))
    expect(screen.getByText('Yesterday quiz')).toBeInTheDocument()
    expect(screen.queryByText('Predict this')).not.toBeInTheDocument()
  })

  it('shows a loading message on the History tab while loading', () => {
    render(createElement(ProblemsList, { ...baseProps, activeTab: 'history', isHistoryLoading: true }))
    expect(screen.getByText('Loading your history…')).toBeInTheDocument()
    expect(screen.queryByText('Yesterday quiz')).not.toBeInTheDocument()
  })

  it('fires onSelect with the clicked assignment id', () => {
    const onSelect = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, onSelect }))
    fireEvent.click(screen.getByText('Predict this'))
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('fires onToggleOpen from the collapse control in the header', () => {
    const onToggleOpen = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, onToggleOpen }))
    fireEvent.click(screen.getByLabelText('Collapse assignment list'))
    expect(onToggleOpen).toHaveBeenCalledOnce()
  })

  // The toggle is the only way back out of the collapsed rail, so it has to
  // survive the session details being hidden.
  it('keeps the expand control reachable when collapsed', () => {
    render(createElement(ProblemsList, { ...baseProps, isOpen: false }))
    expect(screen.queryByText('Hello, World!')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Expand assignment list')).toBeInTheDocument()
  })

  it('shows the timer badge while the countdown is still running', () => {
    const timerEndsAt = new Date(Date.now() + 60_000).toISOString()
    render(createElement(ProblemsList, { ...baseProps, timerEndsAt }))
    expect(screen.getByText(/Move to next at/)).toBeInTheDocument()
  })

  it('hides the timer badge once the countdown has ended', () => {
    const timerEndsAt = new Date(Date.now() - 60_000).toISOString()
    render(createElement(ProblemsList, { ...baseProps, timerEndsAt }))
    expect(screen.queryByText(/Move to next at/)).not.toBeInTheDocument()
  })
})

describe('formatSubmittedAt', () => {
  it('reads as a date at a time, not a raw stamp', () => {
    const formatted = formatSubmittedAt('2026-08-02T19:05:37.864681+00:00')
    expect(formatted).toContain(' at ')
    expect(formatted).not.toContain('T')
    expect(formatted).toContain('2026')
  })

  it('passes an unparseable value straight through rather than showing Invalid Date', () => {
    expect(formatSubmittedAt('not-a-date')).toBe('not-a-date')
  })
})
