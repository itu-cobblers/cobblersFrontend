import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'
import type { SidebarProps } from './Sidebar.types'

const props: SidebarProps = {
  groups: [
    {
      day: 1,
      label: 'Day 1 · Basics',
      items: [
        { id: 0, title: 'Name your Café shop', difficulty: 'Easy', isActive: true, isDone: true },
      ],
    },
    {
      day: 2,
      label: 'Day 2 · Loops',
      items: [{ id: 1, title: 'FizzBuzz', difficulty: 'Easy', isActive: false, isDone: false }],
    },
  ],
  detail: { title: 'Name your Café shop', description: 'Print a name.', hint: 'println' },
  progress: { completed: 1, total: 5 },
  isFolded: false,
  onSelect: vi.fn(),
}

describe('Sidebar', () => {
  it('renders day headers, progress label, and task rows', () => {
    render(createElement(Sidebar, props))
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Day 1 · Basics')).toBeInTheDocument()
    expect(screen.getByText('Day 2 · Loops')).toBeInTheDocument()
    expect(screen.getByText('1/5 completed')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('folds when isFolded', () => {
    const { container } = render(createElement(Sidebar, { ...props, isFolded: true }))
    expect(container.querySelector('aside')).toHaveClass('w-0')
  })
})
