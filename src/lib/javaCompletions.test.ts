import { describe, it, expect } from 'vitest'
import { inferVariableTypes, resolveChainKey } from './javaCompletions'

describe('inferVariableTypes', () => {
  it('reads simple declarations', () => {
    expect(inferVariableTypes('String name = "x";')).toEqual({ name: 'String' })
    expect(inferVariableTypes('int count = 3;')).toEqual({ count: 'int' })
  })

  it('reads generic declarations', () => {
    expect(inferVariableTypes('ArrayList<Integer> nums = new ArrayList<>();')).toEqual({ nums: 'ArrayList' })
    expect(inferVariableTypes('HashMap<String, Integer> ages = new HashMap<>();')).toEqual({ ages: 'HashMap' })
  })

  it('reads var declarations from the new-expression', () => {
    expect(inferVariableTypes('var sb = new StringBuilder();')).toEqual({ sb: 'StringBuilder' })
  })

  it('reads array declarations', () => {
    expect(inferVariableTypes('String[] parts;')).toEqual({ parts: 'String[]' })
    expect(inferVariableTypes('int[] scores;')).toEqual({ scores: 'int[]' })
  })

  it('reads for-each variables and method parameters', () => {
    expect(inferVariableTypes('for (String w : words)')).toEqual({ w: 'String' })
    expect(inferVariableTypes('void greet(String name, int age)')).toEqual({ name: 'String', age: 'int' })
  })

  it('prefers the declared type over the new-expression', () => {
    expect(inferVariableTypes('List<Integer> nums = new ArrayList<>();')).toEqual({ nums: 'List' })
  })

  it('ignores declarations inside comments and strings', () => {
    expect(inferVariableTypes('// String fake = "";')).toEqual({})
    expect(inferVariableTypes('String s = "int bogus = 1;";')).toEqual({ s: 'String' })
  })
})

describe('resolveChainKey', () => {
  it('resolves static chains', () => {
    expect(resolveChainKey('System', {})).toBe('system')
    expect(resolveChainKey('System.out', {})).toBe('systemOut')
    expect(resolveChainKey('Math', {})).toBe('math')
  })

  it('resolves variables by their declared type', () => {
    expect(resolveChainKey('reader', { reader: 'Scanner' })).toBe('scanner')
    expect(resolveChainKey('ages', { ages: 'HashMap' })).toBe('map')
    expect(resolveChainKey('parts', { parts: 'String[]' })).toBe('array')
  })

  it('falls back to name heuristics for undeclared variables', () => {
    expect(resolveChainKey('name', {})).toBe('string')
    expect(resolveChainKey('sb', {})).toBe('sb')
  })

  it('lets a declared type veto a misleading name heuristic', () => {
    expect(resolveChainKey('line', { line: 'int' })).toBe(null)
    expect(resolveChainKey('name', { name: 'Person' })).toBe(null)
  })

  it('follows chained calls with known return types', () => {
    expect(resolveChainKey('sc.nextLine()', { sc: 'Scanner' })).toBe('string')
    expect(resolveChainKey('sb.append(x).append(y)', { sb: 'StringBuilder' })).toBe('sb')
    expect(resolveChainKey('ages.keySet()', { ages: 'HashMap' })).toBe('set')
    expect(resolveChainKey('name.split(",")', {})).toBe('array')
  })

  it('resolves a bare call continuing the previous line', () => {
    expect(resolveChainKey('append(x)', {})).toBe('sb')
    expect(resolveChainKey('nextLine()', {})).toBe('string')
  })

  it('returns null for unknown receivers', () => {
    expect(resolveChainKey('mystery', {})).toBe(null)
    expect(resolveChainKey('sc.nextInt()', { sc: 'Scanner' })).toBe(null)
  })
})
