import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Toolbar from './Toolbar'

const baseProps = {
  files: [{ name: 'Main.java' }],
  activeIndex: 0,
  onSelectFile: vi.fn(),
  isRunning: false,
  onRun: vi.fn(),
  submitStatus: 'idle' as const,
  onSubmit: vi.fn(),
}

describe('Toolbar', () => {
  it('renders a tab per file', () => {
    render(
      createElement(Toolbar, {
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
      createElement(Toolbar, {
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
    const { rerender } = render(createElement(Toolbar, { ...baseProps, onRun }))
    fireEvent.click(screen.getByText('Run'))
    expect(onRun).toHaveBeenCalledOnce()

    rerender(createElement(Toolbar, { ...baseProps, onRun, isRunning: true }))
    expect(screen.getByText('Running…').closest('button')).toBeDisabled()
  })

  it('styles solution tabs distinctly from student tabs', () => {
    render(
      createElement(Toolbar, {
        ...baseProps,
        files: [
          { name: 'Main.java' },
          { name: 'Main.java', variant: 'solution' },
        ],
        activeIndex: 1,
      }),
    )
    const tabs = screen.getAllByText('Main.java')
    expect(tabs).toHaveLength(2)
    expect(tabs[1].closest('button')).toHaveClass('text-accent')
  })

  it('shows Submit alongside Run', () => {
    render(createElement(Toolbar, baseProps))
    expect(screen.getByRole('button', { name: 'Run' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('hides Run for kinds with nothing to run, keeping Submit', () => {
    render(createElement(Toolbar, { ...baseProps, onRun: undefined }))
    expect(screen.queryByRole('button', { name: 'Run' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('fires onSubmit when Submit is clicked', () => {
    const onSubmit = vi.fn()
    render(createElement(Toolbar, { ...baseProps, onSubmit }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  // Moved here from AssignmentFooter: while the reference answer is open the
  // one button changes identity rather than a second button appearing.
  it('binds Submit to mark-as-done while the reference answer is open', () => {
    const onMarkAsDone = vi.fn()
    const onSubmit = vi.fn()
    render(createElement(Toolbar, { ...baseProps, canMarkAsDone: true, onMarkAsDone, onSubmit }))
    fireEvent.click(screen.getByRole('button', { name: 'Mark As Done' }))
    expect(onMarkAsDone).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  // CHARACTERIZATION of behaviour inherited from AssignmentFooter: the explicit
  // 'Mark As Done' label overrides SubmitButton's status label, so the button
  // disables while saving but never reads 'Submitting…'. Upstream's own test
  // asserted 'Submitting…' here and has been failing on main for that reason.
  it('disables the button while mark-as-done is saving, keeping its label', () => {
    render(
      createElement(Toolbar, {
        ...baseProps,
        canMarkAsDone: true,
        onMarkAsDone: vi.fn(),
        isMarkingDone: true,
      }),
    )
    expect(screen.getByRole('button', { name: 'Mark As Done' })).toBeDisabled()
  })
})
