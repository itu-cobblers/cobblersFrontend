import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TextField from './TextField'

describe('TextField', () => {
  it('reports the raw value on change', () => {
    const handleChange = vi.fn()
    render(createElement(TextField, { value: '', placeholder: 'Code', onChange: handleChange }))
    fireEvent.change(screen.getByPlaceholderText('Code'), { target: { value: 'abc' } })
    expect(handleChange).toHaveBeenCalledWith('abc')
  })

  it('shows the error border when hasError', () => {
    render(createElement(TextField, { value: '', placeholder: 'Code', hasError: true, onChange: vi.fn() }))
    expect(screen.getByPlaceholderText('Code')).toHaveClass('border-error')
  })
})
