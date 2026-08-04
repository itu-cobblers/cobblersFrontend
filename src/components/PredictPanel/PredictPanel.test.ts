import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PredictPanel from './PredictPanel'

const base = {
  answer: '',
  expectedOutput: '1\n2\n3',
  isSolutionVisible: false,
  onAnswerChange: vi.fn(),
}

describe('PredictPanel', () => {
  it('shows the answer textarea and reports typed input', () => {
    const onAnswerChange = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'idle', onAnswerChange }))
    const textarea = screen.getByPlaceholderText(/type what you think it prints/i)
    fireEvent.change(textarea, { target: { value: '1\n2\n3' } })
    expect(onAnswerChange).toHaveBeenCalledWith('1\n2\n3')
  })

  it('shows a Correct badge once the status lands correct', () => {
    render(createElement(PredictPanel, { ...base, status: 'correct', answer: '1\n2\n3' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('does not show the Correct badge for idle or tried', () => {
    render(createElement(PredictPanel, { ...base, status: 'tried' }))
    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
  })

  it('reveals the expected output in place of the textarea when the solution is visible', () => {
    render(createElement(PredictPanel, { ...base, status: 'tried', isSolutionVisible: true }))
    expect(screen.getByText('Correct Output')).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === '1\n2\n3'),
    ).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/type what you think it prints/i)).not.toBeInTheDocument()
  })
})
