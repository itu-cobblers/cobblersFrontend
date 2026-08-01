// import { describe, it, expect, vi } from 'vitest'
// import { createElement } from 'react'
// import { render, screen, fireEvent } from '@testing-library/react'
// import PredictPanel from './PredictPanel'
//
// const base = {
//   answer: '',
//   expectedOutput: '1\n2\n3',
//   canRevealAnswer: false,
//   isSolutionVisible: false,
//   onToggleSolution: vi.fn(),
//   canMarkAsDone: false,
//   onMarkAsDone: vi.fn(),
//   onAnswerChange: vi.fn(),
//   onSubmit: vi.fn(),
// }
//
// describe('PredictPanel', () => {
//   it('submits the typed answer (idle)', () => {
//     const onSubmit = vi.fn()
//     render(createElement(PredictPanel, { ...base, status: 'idle', answer: '1', onSubmit }))
//     fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
//     expect(onSubmit).toHaveBeenCalledOnce()
//   })
//
//   it('disables submit when the answer is empty', () => {
//     render(createElement(PredictPanel, { ...base, status: 'idle' }))
//     expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
//   })
//
//   it('shows the waiting state while grading', () => {
//     render(createElement(PredictPanel, { ...base, status: 'idle', answer: '1', isSubmitting: true }))
//     expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
//   })
//
//   it('flashes "Not Quite" only when this exact attempt was the wrong one', () => {
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'tried',
//         answer: 'nope',
//         lastAnswerCorrect: false,
//         canRevealAnswer: true,
//       }),
//     )
//     expect(screen.getByRole('button', { name: 'Not Quite' })).toBeInTheDocument()
//   })
//
//   it('reads idle — not "Not Quite" — for a "tried" assignment with no fresh outcome (e.g. revisited)', () => {
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'tried',
//         answer: 'nope',
//         lastAnswerCorrect: null,
//         canRevealAnswer: true,
//       }),
//     )
//     expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
//     expect(screen.queryByRole('button', { name: 'Not Quite' })).not.toBeInTheDocument()
//   })
//
//   it('reopens the input and offers "Show reference answer" once tried', () => {
//     const onToggleSolution = vi.fn()
//     const onSubmit = vi.fn()
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'tried',
//         answer: 'nope',
//         canRevealAnswer: true,
//         onToggleSolution,
//         onSubmit,
//       }),
//     )
//     expect(screen.getByPlaceholderText(/type what you think it prints/)).toBeInTheDocument()
//     fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
//     expect(onSubmit).toHaveBeenCalledOnce()
//     fireEvent.click(screen.getByText('Show reference answer'))
//     expect(onToggleSolution).toHaveBeenCalledOnce()
//   })
//
//   it('places "Show reference answer" to the left of Submit', () => {
//     render(createElement(PredictPanel, { ...base, status: 'tried', answer: 'nope', canRevealAnswer: true }))
//     const buttons = screen.getAllByRole('button')
//     const showAnswerIndex = buttons.findIndex((button) => button.textContent === 'Show reference answer')
//     const submitIndex = buttons.findIndex((button) => button.textContent === 'Submit')
//     expect(showAnswerIndex).toBeGreaterThanOrEqual(0)
//     expect(showAnswerIndex).toBeLessThan(submitIndex)
//   })
//
//   it('reveals the expected output and binds completion to Submit while the reference answer is open', () => {
//     const onMarkAsDone = vi.fn()
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'tried',
//         answer: 'nope',
//         canRevealAnswer: true,
//         isSolutionVisible: true,
//         canMarkAsDone: true,
//         onMarkAsDone,
//       }),
//     )
//     expect(screen.getByText('Correct output')).toBeInTheDocument()
//     expect(
//       screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === '1\n2\n3'),
//     ).toBeInTheDocument()
//     expect(screen.queryByText('Marked as done')).not.toBeInTheDocument()
//     fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
//     expect(onMarkAsDone).toHaveBeenCalledOnce()
//   })
//
//   it('shows a disabled submitting state while the completing submission is in flight', () => {
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'tried',
//         answer: 'nope',
//         canRevealAnswer: true,
//         isSolutionVisible: true,
//         canMarkAsDone: true,
//         isMarkingDone: true,
//       }),
//     )
//     expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled()
//   })
//
//   it('hides the reveal controls and restores a clean answering view when the reference answer is hidden', () => {
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'tried',
//         answer: 'nope',
//         canRevealAnswer: true,
//         isSolutionVisible: false,
//       }),
//     )
//     expect(screen.getByPlaceholderText(/type what you think it prints/)).toBeInTheDocument()
//     expect(screen.queryByText('Marked as done')).not.toBeInTheDocument()
//     expect(screen.getByText('Show reference answer')).toBeInTheDocument()
//   })
//
//   it('flashes "Well Done" only right when a correct answer just landed', () => {
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'correct',
//         answer: '1\n2\n3',
//         lastAnswerCorrect: true,
//       }),
//     )
//     expect(screen.getByText(/well predicted/)).toBeInTheDocument()
//     expect(screen.getByRole('button', { name: 'Well Done' })).toBeDisabled()
//   })
//
//   it('reads idle — not "Well Done" — for a "correct" assignment with no fresh outcome (e.g. revisited)', () => {
//     render(
//       createElement(PredictPanel, {
//         ...base,
//         status: 'correct',
//         answer: '1\n2\n3',
//         lastAnswerCorrect: null,
//       }),
//     )
//     expect(screen.getByText(/well predicted/)).toBeInTheDocument()
//     expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
//   })
//
//   it('shows a completed note for the done state, with no more reveal actions offered', () => {
//     render(createElement(PredictPanel, { ...base, status: 'done', answer: 'nope' }))
//     expect(screen.getByText(/Marked complete/)).toBeInTheDocument()
//     expect(screen.queryByText('Show reference answer')).not.toBeInTheDocument()
//     expect(screen.queryByText('Marked as done')).not.toBeInTheDocument()
//   })
// })
