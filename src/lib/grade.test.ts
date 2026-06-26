import { describe, it, expect } from 'vitest'
import { normalizeOutput, includesLine, includesAll, matches } from './grade'

describe('grade helpers', () => {
  it('normalizes trailing whitespace and edge blank lines', () => {
    expect(normalizeOutput('\n\n1  \n2\n\n')).toBe('1\n2')
  })

  it('includesLine matches a full trimmed line', () => {
    expect(includesLine('a\nHello World!\nb', 'Hello World!')).toBe(true)
    expect(includesLine('Hello World!!', 'Hello World!')).toBe(false)
  })

  it('includesAll requires every token', () => {
    expect(includesAll('37.5C is the same as 99.5F', ['37.5', '99.5'])).toBe(true)
    expect(includesAll('37.5 only', ['37.5', '99.5'])).toBe(false)
  })

  it('matches applies a regex', () => {
    expect(matches('it is daytime', /daytime|nighttime/)).toBe(true)
  })
})
