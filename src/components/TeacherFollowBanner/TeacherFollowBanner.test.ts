import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TeacherFollowBanner from './TeacherFollowBanner'

describe('TeacherFollowBanner', () => {
  it('shows the focus target and fires onFollow', () => {
    const onFollow = vi.fn()
    render(createElement(TeacherFollowBanner, { label: '#6 · String concatenation', onFollow }))
    expect(screen.getByRole('status')).toHaveTextContent('#6')
    expect(screen.getByRole('status')).toHaveTextContent('String concatenation')
    fireEvent.click(screen.getByText('Follow →'))
    expect(onFollow).toHaveBeenCalledOnce()
  })
})
