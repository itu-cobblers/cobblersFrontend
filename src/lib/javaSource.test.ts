import { describe, it, expect } from 'vitest'
import { sanitizeJava } from './javaSource'

describe('sanitizeJava', () => {
  it('blanks a trailing line comment but keeps the code and line length', () => {
    const { lines } = sanitizeJava('int x = 5; // five')
    expect(lines[0]).toHaveLength('int x = 5; // five'.length)
    expect(lines[0].trimEnd()).toBe('int x = 5;')
  })

  it('does not treat // inside a string literal as a comment', () => {
    const { lines } = sanitizeJava('String url = "https://x"; // real comment')
    expect(lines[0].trimEnd()).toBe('String url = "         ";')
  })

  it('blanks string contents but keeps the quotes', () => {
    const { lines } = sanitizeJava('println("a{b}(c;")')
    expect(lines[0]).toBe('println("       ")')
  })

  it('blanks block comments, including inline and multi-line ones', () => {
    const { lines } = sanitizeJava('/* a */ int x = 5; /* b\nstill { comment\n*/ int y = 6;')
    expect(lines[0].trim()).toBe('int x = 5;')
    expect(lines[1].trim()).toBe('')
    expect(lines[2].trim()).toBe('int y = 6;')
  })

  it('handles escaped quotes and backslashes', () => {
    expect(sanitizeJava('String s = "say \\"hi\\"";').unterminated).toEqual([])
    expect(sanitizeJava('String p = "C:\\\\";').unterminated).toEqual([])
  })

  it('reports an unterminated string with its line and opening column', () => {
    const { unterminated } = sanitizeJava('int a = 1;\nString s = "abc;')
    expect(unterminated).toEqual([{ line: 2, column: 12, kind: 'string' }])
  })

  it('recovers after an unterminated string so later lines still scan', () => {
    const { lines } = sanitizeJava('String s = "abc;\nint x = 5;')
    expect(lines[1].trim()).toBe('int x = 5;')
  })

  it('tracks the end state for cursor context checks', () => {
    expect(sanitizeJava('int x = ').endState).toBe('code')
    expect(sanitizeJava('String s = "ab').endState).toBe('string')
    expect(sanitizeJava("char c = 'a").endState).toBe('char')
    expect(sanitizeJava('x; // note').endState).toBe('lineComment')
    expect(sanitizeJava('/* doc').endState).toBe('blockComment')
    expect(sanitizeJava('// note\nint y').endState).toBe('code')
  })
})
