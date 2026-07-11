import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Monaco can't run in jsdom.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) =>
    createElement('textarea', { 'data-testid': 'editor', defaultValue: value }),
}))

// The taskset now comes from the backend; stub the seam so the solo flow
// works without a running API.
vi.mock('@lib/tasksetApi', () => ({
  SOLO_TASKSET_ID: 'all-tasks-for-solo-2026',
  fetchTasksets: vi.fn(),
  fetchTaskset: vi.fn(),
  fetchStudentTaskset: vi.fn().mockResolvedValue({
    tasksetId: 'all-tasks-for-solo-2026',
    displayTitle: 'BootIT — All Tasks (Solo) 2026',
    tasks: [
      {
        id: 1,
        kind: 'code',
        title: 'Hello, World!',
        description: 'Make the program print exactly: Hello World!',
        starter: 'public class Main {}',
      },
    ],
  }),
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
