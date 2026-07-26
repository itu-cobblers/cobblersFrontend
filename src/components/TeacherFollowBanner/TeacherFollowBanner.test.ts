import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TeacherFollowBanner from './TeacherFollowBanner'

describe('TeacherFollowBanner', () => {
  it('shows the focused assignment and fires onFollow', () => {
    const onFollow = vi.fn()
    render(createElement(TeacherFollowBanner, { assignmentId: 6, assignmentTitle: 'String concatenation', onFollow }))
    expect(screen.getByRole('status')).toHaveTextContent('#6')
    expect(screen.getByRole('status')).toHaveTextContent('String concatenation')
    fireEvent.click(screen.getByText('Follow →'))
    expect(onFollow).toHaveBeenCalledOnce()
  })
})
