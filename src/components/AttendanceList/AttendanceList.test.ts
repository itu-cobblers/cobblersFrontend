import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AttendanceList from './AttendanceList'
import type { AttendanceStudent } from './AttendanceList.types'

const students: AttendanceStudent[] = [
  { studentId: 'student-maria', displayName: 'Maria', isActive: true },
  { studentId: 'student-jonas', displayName: 'Jonas', isActive: false },
]

const baseProps = {
  students,
  activeStudentId: null,
  onSelectStudent: vi.fn(),
}

describe('AttendanceList', () => {
  it('renders one row per student', () => {
    render(createElement(AttendanceList, baseProps))
    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByText('Jonas')).toBeInTheDocument()
  })

  it('shows an empty state when there are no students', () => {
    render(createElement(AttendanceList, { ...baseProps, students: [] }))
    expect(screen.getByText('No active students in room.')).toBeInTheDocument()
  })

  it('fires onSelectStudent with the clicked student', () => {
    const onSelectStudent = vi.fn()
    render(createElement(AttendanceList, { ...baseProps, onSelectStudent }))
    fireEvent.click(screen.getByText('Maria'))
    expect(onSelectStudent).toHaveBeenCalledWith('student-maria')
  })

  it('clears selection when clicking the already-active student', () => {
    const onSelectStudent = vi.fn()
    render(createElement(AttendanceList, { ...baseProps, onSelectStudent, activeStudentId: 'student-maria' }))
    fireEvent.click(screen.getByText('Maria'))
    expect(onSelectStudent).toHaveBeenCalledWith(null)
  })

  // Raise Hand, teacher side.
  it('does not render a hand icon for a student without a raised hand', () => {
    render(createElement(AttendanceList, baseProps))
    expect(screen.queryByRole('button', { name: 'Lower hand' })).not.toBeInTheDocument()
  })

  it('renders both hand icons (for the hover swap) for a student with a raised hand', () => {
    const raised = [{ ...students[0], isHandRaised: true }, students[1]]
    const { container } = render(createElement(AttendanceList, { ...baseProps, students: raised }))

    expect(screen.getByRole('button', { name: 'Lower hand' })).toBeInTheDocument()
    expect(container.querySelector('.icon-tabler-hand-stop')).not.toBeNull()
    expect(container.querySelector('.icon-tabler-hand-off')).not.toBeNull()
  })

  it('fires onLowerHand, and not onSelectStudent, when the hand icon is clicked', () => {
    const onLowerHand = vi.fn()
    const onSelectStudent = vi.fn()
    const raised = [{ ...students[0], isHandRaised: true }, students[1]]
    render(createElement(AttendanceList, { ...baseProps, students: raised, onLowerHand, onSelectStudent }))

    fireEvent.click(screen.getByRole('button', { name: 'Lower hand' }))

    expect(onLowerHand).toHaveBeenCalledWith('student-maria')
    // The hand icon sits inside the row's own selection button — it must not
    // also select/deselect the student it's putting down.
    expect(onSelectStudent).not.toHaveBeenCalled()
  })
})
