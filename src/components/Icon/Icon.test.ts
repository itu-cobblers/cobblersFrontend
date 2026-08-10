import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render } from '@testing-library/react'
import Icon from './Icon'

describe('Icon', () => {
  it('renders the menu icon as three lines', () => {
    const { container } = render(createElement(Icon, { name: 'menu' }))
    expect(container.querySelectorAll('line')).toHaveLength(3)
  })

  it('renders the play icon as a polygon', () => {
    const { container } = render(createElement(Icon, { name: 'play' }))
    expect(container.querySelector('polygon')).not.toBeNull()
  })

  it('renders distinct handStop and handOff icons', () => {
    const { container: stop } = render(createElement(Icon, { name: 'handStop' }))
    const { container: off } = render(createElement(Icon, { name: 'handOff' }))

    expect(stop.querySelector('.icon-tabler-hand-stop')).not.toBeNull()
    // handOff carries a diagonal strike the raise icon doesn't have.
    expect(off.querySelector('.icon-tabler-hand-off')).not.toBeNull()
    expect(off.querySelector('path[d="M3 3l18 18"]')).not.toBeNull()
    expect(stop.querySelector('path[d="M3 3l18 18"]')).toBeNull()
  })
})
