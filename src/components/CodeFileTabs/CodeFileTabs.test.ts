import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeFileTabs from './CodeFileTabs'

const baseProps = {
  files: [{ name: 'Main.java' }],
  activeIndex: 0,
  onSelectFile: vi.fn(),
  isRunning: false,
  onRun: vi.fn(),
}

describe('CodeFileTabs', () => {
  it('renders a tab per file', () => {
    render(
      createElement(CodeFileTabs, {
        ...baseProps,
        files: [{ name: 'Container.java' }, { name: 'Main.java' }],
      }),
    )
    expect(screen.getByText('Container.java')).toBeInTheDocument()
    expect(screen.getByText('Main.java')).toBeInTheDocument()
  })

  it('fires onSelectFile with the clicked file index', () => {
    const onSelectFile = vi.fn()
    render(
      createElement(CodeFileTabs, {
        ...baseProps,
        files: [{ name: 'Container.java' }, { name: 'Main.java' }],
        onSelectFile,
      }),
    )
    fireEvent.click(screen.getByText('Main.java'))
    expect(onSelectFile).toHaveBeenCalledWith(1)
  })

  it('fires onRun and disables the button while running', () => {
    const onRun = vi.fn()
    const { rerender } = render(createElement(CodeFileTabs, { ...baseProps, onRun }))
    fireEvent.click(screen.getByText('Run'))
    expect(onRun).toHaveBeenCalledOnce()

    rerender(createElement(CodeFileTabs, { ...baseProps, onRun, isRunning: true }))
    expect(screen.getByText('Run').closest('button')).toBeDisabled()
  })
})
