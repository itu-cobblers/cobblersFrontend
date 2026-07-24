import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PredictPanel from './PredictPanel'

const base = {
  answer: '',
  expectedOutput: '1\n2\n3',
  onAnswerChange: vi.fn(),
  onSubmit: vi.fn(),
  onRedo: vi.fn(),
  onReveal: vi.fn(),
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

  it('offers Redo and Reveal answer when wrong, without revealing yet', () => {
    const onRedo = vi.fn()
    const onReveal = vi.fn()
    render(
      createElement(PredictPanel, {
        ...base,
        status: 'wrong',
        answer: 'nope',
        onRedo,
        onReveal,
      }),
    )
    expect(screen.queryByText('Correct output')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Redo'))
    expect(onRedo).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByText('Reveal answer'))
    expect(onReveal).toHaveBeenCalledOnce()
  })

  it('shows a success note and expected output when correct', () => {
    render(createElement(PredictPanel, { ...base, status: 'correct', answer: '1\n2\n3' }))
    expect(screen.getByText(/well predicted/)).toBeInTheDocument()
    expect(screen.getByText('Correct output')).toBeInTheDocument()
  })

  it('shows the expected output for the done (revealed) state', () => {
    render(createElement(PredictPanel, { ...base, status: 'done', answer: 'nope' }))
    expect(screen.getByText(/Marked complete/)).toBeInTheDocument()
    expect(screen.getByText('Correct output')).toBeInTheDocument()
    expect(
      screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === '1\n2\n3'),
    ).toBeInTheDocument()
  })
})
