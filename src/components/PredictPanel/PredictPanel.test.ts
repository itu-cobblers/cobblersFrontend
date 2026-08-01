import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PredictPanel from './PredictPanel'

const base = {
  answer: '',
  expectedOutput: '1\n2\n3',
  onAnswerChange: vi.fn(),
  onSubmit: vi.fn(),
  onShowAnswer: vi.fn(),
  onMarkAsDone: vi.fn(),
}

describe('PredictPanel', () => {
  it('submits the typed answer (idle)', () => {
    const onSubmit = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'idle', answer: '1', onSubmit }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables submit when the answer is empty', () => {
    render(createElement(PredictPanel, { ...base, status: 'idle' }))
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('shows the waiting state while grading', () => {
    render(createElement(PredictPanel, { ...base, status: 'idle', answer: '1', isSubmitting: true }))
    expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
  })

  it('flashes "Not Quite" only when this exact attempt was the wrong one', () => {
    render(createElement(PredictPanel, { ...base, status: 'tried', answer: 'nope', lastAnswerCorrect: false }))
    expect(screen.getByRole('button', { name: 'Not Quite' })).toBeInTheDocument()
  })

  it('reads idle — not "Not Quite" — for a "tried" assignment with no fresh outcome (e.g. revisited)', () => {
    render(createElement(PredictPanel, { ...base, status: 'tried', answer: 'nope', lastAnswerCorrect: null }))
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Not Quite' })).not.toBeInTheDocument()
  })

  it('reopens the input and offers "Show answer" once tried', () => {
    const onShowAnswer = vi.fn()
    const onSubmit = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'tried', answer: 'nope', onShowAnswer, onSubmit }))
    // the input stays open for another attempt
    expect(screen.getByPlaceholderText(/type what you think it prints/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByText('Show answer'))
    expect(onShowAnswer).toHaveBeenCalledOnce()
  })

  it('places "Show answer" to the left of Submit', () => {
    render(createElement(PredictPanel, { ...base, status: 'tried', answer: 'nope' }))
    const buttons = screen.getAllByRole('button')
    const showAnswerIndex = buttons.findIndex((button) => button.textContent === 'Show answer')
    const submitIndex = buttons.findIndex((button) => button.textContent === 'Submit')
    expect(showAnswerIndex).toBeGreaterThanOrEqual(0)
    expect(showAnswerIndex).toBeLessThan(submitIndex)
  })

  it('reveals the expected output and offers "Marked as done" once revealed', () => {
    const onMarkAsDone = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'revealed', answer: 'nope', onMarkAsDone }))
    expect(screen.getByText('Correct output')).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === '1\n2\n3'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('Marked as done'))
    expect(onMarkAsDone).toHaveBeenCalledOnce()
  })

  it('disables "Marked as done" while the completing submission is in flight', () => {
    render(createElement(PredictPanel, { ...base, status: 'revealed', answer: 'nope', isMarkingDone: true }))
    expect(screen.getByText('Marked as done').closest('button')).toBeDisabled()
  })

  it('flashes "Well Done" only right when a correct answer just landed', () => {
    render(createElement(PredictPanel, { ...base, status: 'correct', answer: '1\n2\n3', lastAnswerCorrect: true }))
    expect(screen.getByText(/well predicted/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Well Done' })).toBeDisabled()
  })

  it('reads idle — not "Well Done" — for a "correct" assignment with no fresh outcome (e.g. revisited)', () => {
    render(createElement(PredictPanel, { ...base, status: 'correct', answer: '1\n2\n3', lastAnswerCorrect: null }))
    expect(screen.getByText(/well predicted/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })

  it('shows a completed note for the done state, with no more actions offered', () => {
    render(createElement(PredictPanel, { ...base, status: 'done', answer: 'nope' }))
    expect(screen.getByText(/Marked complete/)).toBeInTheDocument()
    expect(screen.queryByText('Show answer')).not.toBeInTheDocument()
    expect(screen.queryByText('Marked as done')).not.toBeInTheDocument()
  })
})
