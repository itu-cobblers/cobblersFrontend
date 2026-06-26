import { describe, it, expect } from 'vitest'
import { isPredictionCorrect } from './predict'

describe('isPredictionCorrect', () => {
  it('matches exact normalized output', () => {
    expect(isPredictionCorrect('1\n2\n3', '1\n2\n3')).toBe(true)
  })

  it('tolerates trailing whitespace and blank edge lines', () => {
    expect(isPredictionCorrect('1  \n2\n3\n\n', '1\n2\n3')).toBe(true)
  })

  it('rejects a wrong prediction', () => {
    expect(isPredictionCorrect('1\n2', '1\n2\n3')).toBe(false)
  })

  it('accepts infinite-loop phrasings via accept', () => {
    const accept = ['infinite', 'forever', 'never stops']
    expect(isPredictionCorrect('infinite loop', 'infinite loop', accept)).toBe(true)
    expect(isPredictionCorrect('it just goes on forever', 'infinite loop', accept)).toBe(true)
    expect(isPredictionCorrect('1\n1\n1', 'infinite loop', accept)).toBe(false)
  })
})
