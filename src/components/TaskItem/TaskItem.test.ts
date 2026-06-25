import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskItem from './TaskItem'

const baseProps = {
  id: 2,
  title: 'Reverse a String',
  difficulty: 'Easy' as const,
  isActive: false,
  isDone: false,
}

describe('TaskItem', () => {
  it('selects by id on click', () => {
    const handleSelect = vi.fn()
    render(createElement(TaskItem, { ...baseProps, onSelect: handleSelect }))
    fireEvent.click(screen.getByText('Reverse a String'))
    expect(handleSelect).toHaveBeenCalledWith(2)
  })

  it('marks the title muted and shows a check when done', () => {
    render(createElement(TaskItem, { ...baseProps, isDone: true, onSelect: vi.fn() }))
    expect(screen.getByText('Reverse a String')).toHaveClass('text-foam')
    expect(screen.getByText('✓')).toBeInTheDocument()
  })
})
