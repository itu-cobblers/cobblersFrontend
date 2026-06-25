import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'
import type { SidebarProps } from './Sidebar.types'

const props: SidebarProps = {
  items: [{ id: 0, title: 'Name your Café shop', difficulty: 'Easy', isActive: true, isDone: true }],
  detail: { title: 'Name your Café shop', description: 'Print a name.', hint: 'println' },
  progress: { completed: 1, total: 5 },
  isFolded: false,
  onSelect: vi.fn(),
}

describe('Sidebar', () => {
  it('renders the heading, progress label, and a task row', () => {
    render(createElement(Sidebar, props))
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('1/5 completed')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('folds when isFolded', () => {
    const { container } = render(createElement(Sidebar, { ...props, isFolded: true }))
    expect(container.querySelector('aside')).toHaveClass('w-0')
  })
})
