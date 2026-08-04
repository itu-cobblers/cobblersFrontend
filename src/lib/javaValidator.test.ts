import { describe, it, expect } from 'vitest'
import { collectJavaIssues } from './javaValidator'

function messagesOf(code: string): string[] {
  return collectJavaIssues(code).map((issue) => issue.message)
}

describe('collectJavaIssues', () => {
  it('accepts a clean hello world', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        System.out.println("Hello");',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('does not flag code followed by an inline // comment', () => {
    expect(collectJavaIssues('int x = 5; // five')).toEqual([])
    expect(collectJavaIssues('int x = 5; /* five */')).toEqual([])
  })

  it('still flags a missing semicolon before an inline comment, underlining only the code', () => {
    const issues = collectJavaIssues('int x = 5 // five')
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain("Missing ';'")
    expect(issues[0].startColumn).toBe(1)
    expect(issues[0].endColumn).toBe('int x = 5'.length + 1)
  })

  it('does not treat // inside a string as a comment', () => {
    expect(collectJavaIssues('String url = "https://example.com";')).toEqual([])
    expect(messagesOf('String url = "https://example.com"')[0]).toContain("Missing ';'")
  })

  it('flags a missing semicolon on a plain statement', () => {
    expect(messagesOf('int x = 5')[0]).toContain("Missing ';'")
    expect(messagesOf('return x')[0]).toContain("Missing ';'")
    expect(messagesOf('i++')[0]).toContain("Missing ';'")
    expect(messagesOf('import java.util.Scanner')[0]).toContain("Missing ';'")
  })

  it('does not flag control flow, declarations or annotations', () => {
    expect(collectJavaIssues('if (a > b)')).toEqual([])
    expect(collectJavaIssues('@Override')).toEqual([])
    expect(collectJavaIssues('public class Person')).toEqual([])
    expect(collectJavaIssues('public static int add(int a, int b)')).toEqual([])
  })

  it('flags an unterminated string and skips further checks on that line', () => {
    const issues = collectJavaIssues('String s = "abc;')
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain('closing double quote')
  })

  it('accepts escaped quotes and trailing double backslashes', () => {
    expect(collectJavaIssues('String s = "say \\"hi\\"";')).toEqual([])
    expect(collectJavaIssues('String p = "C:\\\\";')).toEqual([])
  })

  it('flags unbalanced braces in both directions', () => {
    expect(messagesOf('void f() {')[0]).toContain("Unclosed '{'")
    expect(messagesOf('}')[0]).toContain("Unexpected '}'")
  })

  it('ignores braces inside strings and comments', () => {
    expect(collectJavaIssues('String s = "{{{";')).toEqual([])
    expect(collectJavaIssues('// {\nint x = 1;')).toEqual([])
  })

  it('flags a parenthesis left open at end of file, without a semicolon complaint', () => {
    const issues = collectJavaIssues('System.out.println("hi"')
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain("Unclosed '('")
  })

  it('accepts a call whose arguments span multiple lines', () => {
    const code = [
      'System.out.println(',
      '    "hello"',
      ');',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('accepts a statement split across lines by method chaining', () => {
    const code = [
      'String s = name',
      '    .toUpperCase()',
      '    .trim();',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('flags the missing semicolon at the end of a chained statement', () => {
    const code = [
      'String s = name',
      '    .trim()',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].line).toBe(2)
    expect(issues[0].message).toContain("Missing ';'")
  })
})
