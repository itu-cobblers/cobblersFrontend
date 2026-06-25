import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'

// Monaco can't run in jsdom.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) =>
    createElement('textarea', { 'data-testid': 'editor', defaultValue: value }),
}))

const { default: StudentView } = await import('./StudentView')

describe('StudentView', () => {
  it('renders the workspace chrome (toolbar, tasks, terminal)', () => {
    render(createElement(StudentView))
    expect(screen.getByText('bootIT')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByTestId('editor')).toBeInTheDocument()
  })
})
