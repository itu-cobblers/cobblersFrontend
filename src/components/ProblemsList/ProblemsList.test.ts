import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProblemsList from './ProblemsList'
import type { ProblemListItem } from './ProblemsList.types'

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

  it('tags the Session tab with the assignment count', () => {
    render(createElement(ProblemsList, baseProps))
    expect(screen.getByTitle('Session')).toHaveTextContent('3')
  })

  it('keeps the count on the Session tab while History is the active tab', () => {
    render(createElement(ProblemsList, { ...baseProps, activeTab: 'history' }))
    expect(screen.getByTitle('Session')).toHaveTextContent('3')
    expect(screen.getByTitle('History')).not.toHaveTextContent('2')
  })

  it('renders history items instead when the History tab is active', () => {
    render(createElement(ProblemsList, { ...baseProps, activeTab: 'history' }))
    expect(screen.getByText('Yesterday quiz')).toBeInTheDocument()
    expect(screen.queryByText('Predict this')).not.toBeInTheDocument()
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

  it('fires onToggleOpen from the collapse control in the session row', () => {
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


})
