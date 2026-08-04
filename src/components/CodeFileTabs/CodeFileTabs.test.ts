import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeFileTabs from './CodeFileTabs'

describe('CodeFileTabs', () => {
  it('renders a tab per file and calls onSelectFile with its index', () => {
    const onSelectFile = vi.fn()
    render(
      createElement(CodeFileTabs, {
        files: [{ name: 'Main.java' }, { name: 'Person.java' }],
        activeIndex: 0,
        onSelectFile,
      }),
    )
    expect(screen.getByRole('button', { name: /Main\.java/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Person\.java/ }))
    expect(onSelectFile).toHaveBeenCalledWith(1)
  })

  it('renders the actions node on the right of the rail', () => {
    render(
      createElement(CodeFileTabs, {
        files: [{ name: 'Main.java' }],
        activeIndex: 0,
        onSelectFile: vi.fn(),
        actions: createElement('span', null, 'Submit'),
      }),
    )
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
