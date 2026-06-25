import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

vi.stubEnv('VITE_TEACHER_CODE', 'secret')

const { default: TeacherGate } = await import('./TeacherGate')

describe('TeacherGate', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the access form', () => {
    render(createElement(TeacherGate))
    expect(screen.getByRole('heading', { name: 'BootIT' })).toBeInTheDocument()
    expect(screen.getByText('Teacher access')).toBeInTheDocument()
  })

  it('shows an error for the wrong code', () => {
    render(createElement(TeacherGate))
    fireEvent.change(screen.getByPlaceholderText('Enter teacher code'), {
      target: { value: 'nope' },
    })
    fireEvent.click(screen.getByText('Enter'))
    expect(screen.getByText('Incorrect code — try again.')).toBeInTheDocument()
  })

  it('unlocks the dashboard for the correct code', () => {
    render(createElement(TeacherGate))
    fireEvent.change(screen.getByPlaceholderText('Enter teacher code'), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByText('Enter'))
    expect(screen.getByText('BootIT — Teacher')).toBeInTheDocument()
  })
})
