import { describe, it, expect } from 'vitest'
import {
  normalizeOutput,
  includesLine,
  includesAll,
  matches,
  stripComments,
  stripStrings,
  stripCode,
  printlnArgs,
  callArgs,
} from './grade'

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

describe('stripComments', () => {
  it('removes line and block comments', () => {
    expect(stripComments('int x = 1; // set x\nint y = 2;')).not.toContain('set x')
    expect(stripComments('int x = 1; /* a\nmulti-line\ncomment */ int y = 2;')).not.toContain('multi-line')
  })

  it('keeps // inside string literals', () => {
    expect(stripComments('String url = "https://itu.dk"; // homepage')).toContain('https://itu.dk')
  })

  it('handles quotes inside comments', () => {
    const stripped = stripComments('// this " is not a string\nint x = 1;')
    expect(stripped).toContain('int x = 1;')
    expect(stripped).not.toContain('not a string')
  })

  it('handles escaped quotes in strings', () => {
    expect(stripComments('String s = "he said \\"hi\\""; // note')).toContain('\\"hi\\"')
  })
})

describe('stripStrings', () => {
  it('empties string literal contents', () => {
    expect(stripStrings('println("while (true)")')).toBe('println("")')
  })

  it('honors escaped quotes', () => {
    expect(stripStrings('String s = "a \\" b"; int x = 1;')).toBe('String s = ""; int x = 1;')
  })
})

describe('stripCode', () => {
  it('kills matches that only exist in comments or strings', () => {
    const code = '// c2f(\nString s = "f2c(";\nSystem.out.println(s);'
    const structure = stripCode(code)
    expect(structure).not.toContain('c2f(')
    expect(structure).not.toContain('f2c(')
  })
})

describe('printlnArgs', () => {
  it('collects args of print and println calls in order', () => {
    const code = 'System.out.print("a");\nSystem.out.println(x);'
    expect(printlnArgs(code)).toEqual(['"a"', 'x'])
  })

  it('handles concatenation and nested parens', () => {
    const code = 'System.out.println("total: " + (a + b));'
    expect(printlnArgs(code)).toEqual(['"total: " + (a + b)'])
  })

  it('ignores println calls inside comments', () => {
    expect(printlnArgs('// System.out.println(42);\nSystem.out.println(x);')).toEqual(['x'])
  })

  it('is not fooled by parens inside string args', () => {
    expect(printlnArgs('System.out.println("smile :)");')).toEqual(['"smile :)"'])
  })
})

describe('callArgs', () => {
  const code = `class Valuta {
    static void cafeEuroPrice(String item, int dkk) {
        System.out.println("A cup of " + item + " cost " + (dkk / 7.45) + " euros.");
    }

    public static void main(String[] args) {
        cafeEuroPrice("Cappuccino", 17);
        cafeEuroPrice("Matcha Latte", 20);
        // cafeEuroPrice("commented out", 1);
    }
}`

  it('collects call sites but not the declaration or comments', () => {
    expect(callArgs(code, 'cafeEuroPrice')).toEqual(['"Cappuccino", 17', '"Matcha Latte", 20'])
  })

  it('keeps string args so same-price different-name calls differ', () => {
    const calls = callArgs(code, 'cafeEuroPrice')
    expect(new Set(calls).size).toBe(2)
  })
})
