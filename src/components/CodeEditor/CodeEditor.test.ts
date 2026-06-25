import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'

// Monaco can't run in jsdom — stand in with a textarea reflecting `value`.
vi.mock('@monaco-editor/react', () => ({
  default: ({ value }: { value: string }) =>
    createElement('textarea', { 'data-testid': 'editor', defaultValue: value }),
}))

const { default: CodeEditor } = await import('./CodeEditor')

describe('CodeEditor', () => {
  it('renders the editor with the provided value', () => {
    render(createElement(CodeEditor, { value: 'class Main {}', onChange: vi.fn() }))
    expect(screen.getByTestId('editor')).toHaveValue('class Main {}')
  })
})
