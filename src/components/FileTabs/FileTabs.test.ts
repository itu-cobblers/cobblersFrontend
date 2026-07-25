import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FileTabs from './FileTabs'
import type { SourceFile } from '@types'

const files: SourceFile[] = [
  { name: 'Main.java', content: 'public class Main {}' },
  { name: 'Person.java', content: 'public class Person {}' },
]

describe('FileTabs', () => {
  it('renders one tab per file, marking the active one', () => {
    render(createElement(FileTabs, { files, activeFileName: 'Person.java', onSelectFile: vi.fn() }))
    expect(screen.getByRole('tab', { name: 'Main.java' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Person.java' })).toHaveAttribute('aria-selected', 'true')
  })

  it('fires onSelectFile with the clicked file name', () => {
    const onSelectFile = vi.fn()
    render(createElement(FileTabs, { files, activeFileName: 'Main.java', onSelectFile }))
    fireEvent.click(screen.getByRole('tab', { name: 'Person.java' }))
    expect(onSelectFile).toHaveBeenCalledWith('Person.java')
  })

  it('never renders file names as editable input — selection only', () => {
    render(createElement(FileTabs, { files, activeFileName: 'Main.java', onSelectFile: vi.fn() }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
