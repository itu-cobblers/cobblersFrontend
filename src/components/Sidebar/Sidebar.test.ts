import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'
import type { SidebarProps } from './Sidebar.types'

const props: SidebarProps = {
  groups: [
    {
      label: 'BootIT Day 1 — 2026',
      items: [
        { id: 1, title: 'Name your Café shop', isActive: true, isDone: true },
      ],
    },
    {
      label: 'Extra practice',
      items: [{ id: 2, title: 'FizzBuzz', isActive: false, isDone: false }],
    },
  ],
  detail: { title: 'Name your Café shop', description: 'Print a name.', hint: 'println' },
  progress: { completed: 1, total: 5 },
  isFolded: false,
  onSelect: vi.fn(),
}

describe('Sidebar', () => {
  it('renders group headers, progress label, and task rows', () => {
    render(createElement(Sidebar, props))
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('BootIT Day 1 — 2026')).toBeInTheDocument()
    expect(screen.getByText('Extra practice')).toBeInTheDocument()
    expect(screen.getByText('1/5 completed')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('folds when isFolded', () => {
    const { container } = render(createElement(Sidebar, { ...props, isFolded: true }))
    expect(container.querySelector('aside')).toHaveClass('w-0')
  })
})
