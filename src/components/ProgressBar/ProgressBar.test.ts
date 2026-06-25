import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render } from '@testing-library/react'
import ProgressBar from './ProgressBar'
import { getProgressPercent } from './ProgressBar.utils'

describe('getProgressPercent', () => {
  it('computes a percentage', () => {
    expect(getProgressPercent(1, 4)).toBe(25)
  })

  it('guards against a zero max', () => {
    expect(getProgressPercent(3, 0)).toBe(0)
  })

  it('clamps above 100', () => {
    expect(getProgressPercent(9, 4)).toBe(100)
  })
})

describe('ProgressBar', () => {
  it('renders the fill at the computed width', () => {
    const { container } = render(createElement(ProgressBar, { value: 2, max: 4 }))
    const fill = container.querySelector('.bg-caramel')
    expect(fill).toHaveStyle({ width: '50%' })
  })
})
