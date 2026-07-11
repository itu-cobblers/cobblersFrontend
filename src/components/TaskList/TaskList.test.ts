import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskList from './TaskList'
import type { TaskListEntry } from './TaskList.types'

const items: TaskListEntry[] = [
  { id: 0, title: 'Name your Café shop', isActive: true, isDone: true },
  { id: 1, title: 'FizzBuzz', isActive: false, isDone: false },
]

describe('TaskList', () => {
  it('renders one row per item', () => {
    render(createElement(TaskList, { items, onSelect: vi.fn() }))
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('forwards the selected id', () => {
    const handleSelect = vi.fn()
    render(createElement(TaskList, { items, onSelect: handleSelect }))
    fireEvent.click(screen.getByText('FizzBuzz'))
    expect(handleSelect).toHaveBeenCalledWith(1)
  })
})
