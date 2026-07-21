import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@lib/assignmentSetApi', () => ({
  fetchAssignmentSets: vi.fn().mockResolvedValue([{ assignmentSetId: 'set-1', displayTitle: 'Day 1' }]),
  fetchAssignmentSet: vi.fn().mockResolvedValue({ assignmentSetId: 'set-1', displayTitle: 'Day 1', assignments: [] }),
}))

vi.mock('@lib/sessionApi', () => ({
  createSession: vi.fn().mockResolvedValue({ code: 'ABCD1234' }),
  getSession: vi.fn().mockResolvedValue({ code: 'WXYZ5678', assignmentSetId: 'set-1' }),
  startTimer: vi.fn().mockResolvedValue({ endsAt: '2026-07-21T12:00:00.000Z' }),
}))

vi.mock('@lib/sessionHub', () => ({
  observeSession: vi.fn().mockResolvedValue(undefined),
}))

const { default: TeacherDashboard } = await import('./TeacherDashboard')

describe('TeacherDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the Browse screen when there is no persisted session', async () => {
    render(createElement(TeacherDashboard))
    expect(await screen.findByRole('heading', { name: 'Start a session' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'End session' })).not.toBeInTheDocument()
  })

  it('creating a session persists it and shows an End session button', async () => {
    render(createElement(TeacherDashboard))
    await screen.findByRole('option', { name: 'Day 1' })

    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))

    expect(await screen.findByRole('button', { name: 'End session' })).toBeInTheDocument()
    expect(localStorage.getItem('bootit.teacherSession')).toEqual(JSON.stringify({ code: 'ABCD1234', timerEndsAt: null }))
  })

  it('resumes a persisted session on mount', async () => {
    localStorage.setItem('bootit.teacherSession', JSON.stringify({ code: 'WXYZ5678', timerEndsAt: null }))

    render(createElement(TeacherDashboard))

    expect(await screen.findByRole('button', { name: 'End session' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Start a session' })).not.toBeInTheDocument()
  })

  it('ending a session clears storage and returns to Browse', async () => {
    render(createElement(TeacherDashboard))
    await screen.findByRole('option', { name: 'Day 1' })
    fireEvent.click(screen.getByRole('button', { name: 'Create session' }))
    await screen.findByRole('button', { name: 'End session' })

    fireEvent.click(screen.getByRole('button', { name: 'End session' }))

    expect(await screen.findByRole('heading', { name: 'Start a session' })).toBeInTheDocument()
    expect(localStorage.getItem('bootit.teacherSession')).toBeNull()
  })
})
