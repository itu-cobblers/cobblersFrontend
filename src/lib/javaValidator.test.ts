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

  it('flags redeclaring the same variable in the same scope', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int age = 27;',
      '',
      '        int age = 28;',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain("Variable 'age' is already declared")
    expect(issues[0].line).toBe(5)
  })

  it('flags every name redeclared in a comma-separated declaration', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int a = 1, b = 2;',
      '        int a = 3;',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain("Variable 'a' is already declared")
  })

  it('tracks the second name in a no-initializer comma declaration for redeclaration', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int f, g;',
      '        int g = 5;',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain("Variable 'g' is already declared")
  })

  it('does not flag plain reassignment as redeclaration', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int x = 5;',
      '        x = 6;',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('does not flag the same loop variable name reused across sibling for-loops', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        for (int i = 0; i < 3; i++) {',
      '            System.out.println(i);',
      '        }',
      '        for (int i = 0; i < 3; i++) {',
      '            System.out.println(i);',
      '        }',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('flags assigning a string literal to an int variable', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int a = 1;',
      '        a = "hehe";',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toBe("'a' expects a number, but this is text in double quotes")
    expect(issues[0].line).toBe(4)
  })

  it('flags assigning a number literal to a boolean variable', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        boolean flag = true;',
      '        flag = 5;',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toBe("'flag' expects true or false, but this is a number")
  })

  it('flags a mismatched literal at the point of declaration', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        String a = 1;',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toBe("'a' expects text in double quotes, but this is a number")
    expect(issues[0].line).toBe(3)
  })

  it('checks every initializer in a comma-separated declaration', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int a = 1, b = "oops", c = 3;',
      '    }',
      '}',
    ].join('\n')
    const issues = collectJavaIssues(code)
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toBe("'b' expects a number, but this is text in double quotes")
  })

  it('does not flag a method-call initializer it cannot classify', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int e = Math.max(1, 2);',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('allows a numeric literal assigned to char (a code point)', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        char c = \'x\';',
      '        c = 65;',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('does not flag reassignment to a non-literal expression', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        int x = 5;',
      '        x = x + 1;',
      '        String s = "a";',
      '        s = s + "b";',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })

  it('does not flag the same variable name declared in separate nested scopes', () => {
    const code = [
      'public class Main {',
      '    public static void main(String[] args) {',
      '        if (true) {',
      '            int y = 1;',
      '        } else {',
      '            int y = 2;',
      '        }',
      '    }',
      '}',
    ].join('\n')
    expect(collectJavaIssues(code)).toEqual([])
  })
})
