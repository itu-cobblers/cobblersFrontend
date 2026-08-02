import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PredictPanel from './PredictPanel'

/**
 * PredictPanel is now only the answer surface: the input, the status header,
 * and the revealed expected output. Submitting and marking-as-done moved to the
 * Toolbar; toggling the reference answer moved to AssignmentPanel. Their tests
 * live there.
 */
const base = {
  answer: '',
  expectedOutput: '1\n2\n3',
  isSolutionVisible: false,
  onAnswerChange: vi.fn(),
}

describe('PredictPanel', () => {
  it('takes the typed answer', () => {
    const onAnswerChange = vi.fn()
    render(createElement(PredictPanel, { ...base, status: 'idle', onAnswerChange }))
    fireEvent.change(screen.getByPlaceholderText(/type what you think it prints/i), {
      target: { value: '42' },
    })
    expect(onAnswerChange).toHaveBeenCalledWith('42')
  })

  it('nudges a wrong attempt without closing the input', () => {
    render(createElement(PredictPanel, { ...base, status: 'tried', answer: 'nope' }))
    expect(screen.getByText(/not quite — try again/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/type what you think it prints/i)).toBeInTheDocument()
  })

  it('replaces the input with the expected output while the reference answer is open', () => {
    render(
      createElement(PredictPanel, {
        ...base,
        status: 'tried',
        answer: 'nope',
        isSolutionVisible: true,
      }),
    )
    expect(screen.queryByPlaceholderText(/type what you think it prints/i)).not.toBeInTheDocument()
    expect(screen.getByText('Correct output')).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === '1\n2\n3'),
    ).toBeInTheDocument()
  })

  it('closes the input and confirms once the answer was correct', () => {
    render(createElement(PredictPanel, { ...base, status: 'correct', answer: '1\n2\n3' }))
    expect(screen.getByText(/well predicted/)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/type what you think it prints/i)).not.toBeInTheDocument()
  })

  it('reads as completed once marked done', () => {
    render(createElement(PredictPanel, { ...base, status: 'done', answer: 'nope' }))
    expect(screen.getByText(/Marked complete/)).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })
})
