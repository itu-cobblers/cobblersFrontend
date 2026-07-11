import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Monaco can't run in jsdom.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) =>
    createElement('textarea', { 'data-testid': 'editor', defaultValue: value }),
}))

const { default: StudentView } = await import('./StudentView')

describe('StudentView', () => {
  it('shows the entry screen first, not the IDE', () => {
    render(createElement(StudentView))
    expect(screen.getByText('Welcome to bootIT')).toBeInTheDocument()
    expect(screen.queryByTestId('editor')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Tasks' })).not.toBeInTheDocument()
  })

  it('reveals the workspace chrome after starting solo practice', async () => {
    render(createElement(StudentView))
    fireEvent.change(screen.getByPlaceholderText('e.g. Maria'), { target: { value: 'Maria' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solo practice' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start solo practice' }))

    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByText('Terminal')).toBeInTheDocument()
    expect(screen.getByTestId('editor')).toBeInTheDocument()
  })
})
