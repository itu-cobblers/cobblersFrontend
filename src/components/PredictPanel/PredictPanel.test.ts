import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PredictPanel from './PredictPanel'

const base = {
  answer: '',
  expectedOutput: '1\n2\n3',
  onAnswerChange: vi.fn(),
  onSubmit: vi.fn(),
  onUnderstood: vi.fn(),
}

describe('PredictPanel', () => {
  it('submits the typed answer (idle)', () => {
    const onSubmit = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'idle', answer: '1', onSubmit }))
    fireEvent.click(screen.getByText('Submit answer'))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('disables submit when the answer is empty', () => {
    render(createElement(PredictPanel, { ...base, status: 'idle' }))
    expect(screen.getByText('Submit answer').closest('button')).toBeDisabled()
  })

  it('reveals the expected output and offers "I understand now" when wrong', () => {
    const onUnderstood = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'wrong', answer: 'nope', onUnderstood }))
    expect(screen.getByText('Correct output')).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === '1\n2\n3'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText('I understand now'))
    expect(onUnderstood).toHaveBeenCalledOnce()
  })

  it('shows a success note when correct', () => {
    render(createElement(PredictPanel, { ...base, status: 'correct', answer: '1\n2\n3' }))
    expect(screen.getByText(/well predicted/)).toBeInTheDocument()
  })

  it('shows a completed note for the done state', () => {
    render(createElement(PredictPanel, { ...base, status: 'done', answer: 'nope' }))
    expect(screen.getByText(/Marked complete/)).toBeInTheDocument()
  })
})
