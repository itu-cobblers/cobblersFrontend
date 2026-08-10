import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import SubmissionBanner from './SubmissionBanner'
import { deriveSubmissionStatus, getSubmissionNumber } from './SubmissionBanner.utils'
import type { SubmissionHistoryItem } from '@types'

const history: SubmissionHistoryItem[] = [
  { subId: 'c', assignmentId: 3, status: 'passed', submittedAt: '2026-08-02T12:00:00Z' },
  { subId: 'a', assignmentId: 3, status: 'tried', submittedAt: '2026-08-02T10:00:00Z' },
  { subId: 'x', assignmentId: 9, status: 'passed', submittedAt: '2026-08-02T11:00:00Z' },
  { subId: 'b', assignmentId: 3, status: 'tried', submittedAt: '2026-08-02T11:00:00Z' },
]

describe('getSubmissionNumber', () => {
  // History arrives newest-first, so the count has to sort rather than trust order.
  it('numbers attempts from the student\'s first, not from list order', () => {
    expect(getSubmissionNumber(history, 3, 'a')).toBe(1)
    expect(getSubmissionNumber(history, 3, 'b')).toBe(2)
    expect(getSubmissionNumber(history, 3, 'c')).toBe(3)
  })

  it('counts only this assignment\'s attempts', () => {
    expect(getSubmissionNumber(history, 9, 'x')).toBe(1)
  })

  it('returns 0 for a submission that is not in the history', () => {
    expect(getSubmissionNumber(history, 3, 'missing')).toBe(0)
  })
})

describe('SubmissionBanner', () => {
  it('names the attempt and when it was made', () => {
    render(createElement(SubmissionBanner, {
      number: 2,
      submittedAt: '2026-08-02T11:00:00Z',
      passed: false,
      result: null,
    }))
    expect(screen.getByText('Submission #2')).toBeInTheDocument()
    expect(screen.getByText(/submitted on/)).toBeInTheDocument()
  })
})

describe('deriveSubmissionStatus', () => {
  it('reads a wrong-but-compiling answer as tried', () => {
    expect(deriveSubmissionStatus(false, { status: 'success', stdout: 'nope', stderr: '' })).toBe('tried')
  })

  it('reads a correct answer as passed', () => {
    expect(deriveSubmissionStatus(true, { status: 'success', stdout: 'ok', stderr: '' })).toBe('passed')
  })

  it('reads an ungraded submission with no result as passed, same as SubmissionRow', () => {
    expect(deriveSubmissionStatus(null, null)).toBe('passed')
  })

  it('reads a compile error as error even when passed is null', () => {
    expect(deriveSubmissionStatus(null, { status: 'compile_error', stdout: '', stderr: 'boom' })).toBe('error')
  })

  it('reads a runtime error as error', () => {
    expect(deriveSubmissionStatus(false, { status: 'runtime_error', stdout: '', stderr: 'boom' })).toBe('error')
  })
})
