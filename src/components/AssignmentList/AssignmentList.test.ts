import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentList from './AssignmentList'
import type { AssignmentListEntry } from './AssignmentList.types'

const items: AssignmentListEntry[] = [
  { id: 0, title: 'Name your Café shop', isActive: true, isDone: true },
  { id: 1, title: 'FizzBuzz', isActive: false, isDone: false },
]

describe('AssignmentList', () => {
  it('renders one row per item', () => {
    render(createElement(AssignmentList, { items, onSelect: vi.fn() }))
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('forwards the selected id', () => {
    const handleSelect = vi.fn()
    render(createElement(AssignmentList, { items, onSelect: handleSelect }))
    fireEvent.click(screen.getByText('FizzBuzz'))
    expect(handleSelect).toHaveBeenCalledWith(1)
  })
})
