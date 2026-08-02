import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RunMenu from './RunMenu'

const base = { onSubmit: vi.fn(), onRun: vi.fn() }

describe('RunMenu', () => {
  it('runs from the play half when the assignment has code to run', () => {
    const onRun = vi.fn()
    render(createElement(RunMenu, { ...base, onRun }))
    fireEvent.click(screen.getByRole('button', { name: 'Run' }))
    expect(onRun).toHaveBeenCalledOnce()
  })


  it('keeps the list closed until the chevron is used', () => {
    render(createElement(RunMenu, base))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('offers both actions in the list when the assignment can run', () => {
    render(createElement(RunMenu, base))
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    const items = screen.getAllByRole('menuitem')
    expect(items.map((item) => item.textContent)).toEqual(['Run', 'Submit'])
  })


  it('submits from the list and closes it', () => {
    const onSubmit = vi.fn()
    render(createElement(RunMenu, { ...base, onSubmit }))
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  // A menu left hanging over the editor after you click away reads as stuck.
  it('closes on an outside click and on Escape', () => {
    render(createElement(RunMenu, base))
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('disables Submit in the list while a submission is in flight', () => {
    render(createElement(RunMenu, { ...base, onRun: vi.fn(), isSubmitting: true }))
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    expect(screen.getByRole('menuitem', { name: 'Submit' })).toBeDisabled()
  })
})
