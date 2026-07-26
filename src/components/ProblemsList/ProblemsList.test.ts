import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProblemsList from './ProblemsList'
import type { ProblemListItem } from './ProblemsList.types'

const sessionItems: ProblemListItem[] = [
  { id: 1, title: 'Hello, World!', kind: 'code', status: 'passed' },
  { id: 2, title: 'Predict this', kind: 'predict', status: 'failed' },
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
  onLeaveSession: vi.fn(),
  leaveLabel: 'Leave',
}

describe('ProblemsList', () => {
  it('renders one row per session item with its title and count on the Session tab', () => {
    render(createElement(ProblemsList, baseProps))
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
    expect(screen.getByText('Predict this')).toBeInTheDocument()
    expect(screen.getByText('Build a Tree')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders history items instead when the History tab is active', () => {
    render(createElement(ProblemsList, { ...baseProps, activeTab: 'history' }))
    expect(screen.getByText('Yesterday quiz')).toBeInTheDocument()
    expect(screen.queryByText('Predict this')).not.toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('fires onTabChange when a rail tab is clicked', () => {
    const onTabChange = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, onTabChange }))
    fireEvent.click(screen.getByTitle('History'))
    expect(onTabChange).toHaveBeenCalledWith('history')
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

  it('fires onToggleOpen when the collapse button is clicked', () => {
    const onToggleOpen = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, onToggleOpen }))
    fireEvent.click(screen.getByLabelText('Collapse problems list'))
    expect(onToggleOpen).toHaveBeenCalledOnce()
  })

  it('hides titles and labels but keeps rows when collapsed', () => {
    render(createElement(ProblemsList, { ...baseProps, isOpen: false }))
    expect(screen.queryByText('Hello, World!')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Expand problems list')).toBeInTheDocument()
  })

  it('shows the session label and signed-in name when provided', () => {
    render(createElement(ProblemsList, { ...baseProps, sessionLabel: 'Room: CWJ6', displayName: 'Aiting' }))
    expect(screen.getByText('Room: CWJ6')).toBeInTheDocument()
    expect(screen.getByText('Aiting')).toBeInTheDocument()
  })

  it('fires onLeaveSession with the given label', () => {
    const onLeaveSession = vi.fn()
    render(createElement(ProblemsList, { ...baseProps, onLeaveSession, leaveLabel: 'Exit' }))
    fireEvent.click(screen.getByText('Exit'))
    expect(onLeaveSession).toHaveBeenCalledOnce()
  })
})
