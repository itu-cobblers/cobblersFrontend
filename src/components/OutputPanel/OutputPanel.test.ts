import { describe, it, expect } from 'vitest'
import { isErrorStatus, getStatusLabel } from './OutputPanel.utils'

describe('OutputPanel.utils', () => {
  it('flags error statuses', () => {
    expect(isErrorStatus('compile_error')).toBe(true)
    expect(isErrorStatus('success')).toBe(false)
    expect(isErrorStatus(null)).toBe(false)
  })

  it('labels statuses', () => {
    expect(getStatusLabel('runtime_error')).toBe('Runtime error')
    expect(getStatusLabel(null)).toBe('')
  })
})
