import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TeacherProblemsList from './TeacherProblemsList'
import type { TeacherProblemsListProps, TeacherProblemItem } from './TeacherProblemsList.types'

const codeItem: TeacherProblemItem = { id: 1, title: 'Celsius to Fahrenheit', kind: 'code', passedNum: 0, totalNum: 5 }
const projectItem: TeacherProblemItem = { id: 2, title: 'Café Analog', kind: 'project', passedNum: 0, totalNum: 5 }

const baseProps: TeacherProblemsListProps = {
  sessionCode: 'ABCD1234',
  items: [codeItem, projectItem],
  activeId: codeItem.id,
  onSelect: vi.fn(),
  teacherFocusId: null,
  isOpen: true,
  onToggleOpen: vi.fn(),
  minutes: 10,
  isStartingTimer: false,
  timerEndsAt: null,
  timerAssignmentId: null,
  timerError: null,
  onMinutesChange: vi.fn(),
  onStartTimer: vi.fn(),
  onEndSession: vi.fn(),
}

function expandTimer() {
  fireEvent.click(screen.getByText('Timer'))
}

/** The countdown pill is the only `.bg-muted` element that also carries `.rounded-full`. */
function findCountdownBadge(container: HTMLElement) {
  return container.querySelector('.bg-muted.rounded-full')
}

describe('TeacherProblemsList', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-27T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a minutes input and Start button for a code assignment', () => {
    render(createElement(TeacherProblemsList, baseProps))
    expandTimer()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('starting the timer for a code assignment calls onStartTimer', () => {
    const onStartTimer = vi.fn()
    render(createElement(TeacherProblemsList, { ...baseProps, onStartTimer }))
    expandTimer()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(onStartTimer).toHaveBeenCalled()
  })

  it('shows the same minutes input and Start button for a project assignment — the timer is just pacing, not a reveal trigger', () => {
    render(createElement(TeacherProblemsList, { ...baseProps, activeId: projectItem.id }))
    expandTimer()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('shows which assignment the active timer is scoped to', () => {
    const { container } = render(
      createElement(TeacherProblemsList, {
        ...baseProps,
        timerEndsAt: '2026-07-27T12:10:00.000Z',
        timerAssignmentId: codeItem.id,
      }),
    )
    const badge = findCountdownBadge(container)
    expect(badge?.textContent).toContain('Celsius to Fahrenheit')
  })

  it('shows a live mm:ss countdown, matching the student view badge format, instead of an end time', () => {
    const { container } = render(
      createElement(TeacherProblemsList, {
        ...baseProps,
        timerEndsAt: '2026-07-27T12:03:05.000Z',
        timerAssignmentId: codeItem.id,
      }),
    )
    const badge = findCountdownBadge(container)
    expect(badge?.textContent).toContain('⏱ 3:05')
  })

  it('ticks the countdown down once a second', () => {
    const { container } = render(
      createElement(TeacherProblemsList, {
        ...baseProps,
        timerEndsAt: '2026-07-27T12:00:10.000Z',
        timerAssignmentId: codeItem.id,
      }),
    )
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    const badge = findCountdownBadge(container)
    expect(badge?.textContent).toContain('⏱ 0:07')
  })
})
