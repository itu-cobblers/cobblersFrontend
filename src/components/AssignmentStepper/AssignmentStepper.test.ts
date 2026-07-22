import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentStepper from './AssignmentStepper'
import type { StepperStep } from './AssignmentStepper.types'

const steps: StepperStep[] = [
  { id: 0, title: 'Hello ITU', isDone: true, isActive: false },
  { id: 1, title: 'Print three values', isDone: false, isActive: true },
  { id: 2, title: 'Use variables', isDone: false, isActive: false },
]

describe('AssignmentStepper', () => {
  it('shows assignment numbers in each node, not titles', () => {
    render(createElement(AssignmentStepper, { steps, onSelect: vi.fn() }))
    expect(screen.getByRole('button', { name: 'Hello ITU' })).toHaveTextContent('1')
    expect(screen.getByRole('button', { name: 'Print three values' })).toHaveTextContent('2')
    expect(screen.getByRole('button', { name: 'Use variables' })).toHaveTextContent('3')
    expect(screen.queryByText('Print three values')).not.toBeInTheDocument()
  })

  it('shows the completed count', () => {
    render(createElement(AssignmentStepper, { steps, onSelect: vi.fn() }))
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('fires onSelect with the clicked step id', () => {
    const onSelect = vi.fn()
    render(createElement(AssignmentStepper, { steps, onSelect }))
    fireEvent.click(screen.getByRole('button', { name: 'Use variables' }))
    expect(onSelect).toHaveBeenCalledWith(2)
  })
})
