import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import Toolbar from './Toolbar'

describe('Toolbar', () => {
  it('shows the following-teacher pill only when isFollowingTeacher is true', () => {
    const { rerender } = render(createElement(Toolbar, {}))
    expect(screen.queryByText('following teacher')).not.toBeInTheDocument()

    rerender(createElement(Toolbar, { isFollowingTeacher: true }))
    expect(screen.getByText('following teacher')).toBeInTheDocument()
  })
})
