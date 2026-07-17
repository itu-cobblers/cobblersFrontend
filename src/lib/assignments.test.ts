import { describe, it, expect } from 'vitest'
import { ASSIGNMENTS } from './assignments'

const codeCheck = (id: number) => {
  const assignment = ASSIGNMENTS.find((t) => t.id === id)
  if (assignment?.kind !== 'code') throw new Error(`assignment ${id} is not a code assignment`)
  return assignment.check
}

describe('assignment grading', () => {
  it('café assignment passes on any output and broadcasts cafeName', () => {
    const check = codeCheck(0)
    const verdict = check?.({ code: '', output: 'My Cozy Café\n', stderr: '', exitCode: 0 })
    expect(verdict?.passed).toBe(true)
    expect(verdict?.signals).toEqual({ cafeName: 'My Cozy Café' })
  })

  it('Container passes when filled correctly and capped at max', () => {
    const check = codeCheck(31)
    const verdict = check?.({
      code: '',
      output: 'Container: AX35 (23/30)\nContainer: AX35 (30/30)',
      stderr: '',
      exitCode: 0,
    })
    expect(verdict?.passed).toBe(true)
  })

  it('Container fails when over-filled past max', () => {
    const check = codeCheck(31)
    const verdict = check?.({
      code: '',
      output: 'Container: AX35 (23/30)\nContainer: AX35 (63/30)',
      stderr: '',
      exitCode: 0,
    })
    expect(verdict?.passed).toBe(false)
  })

  it('every assignment has a unique sequential id and a valid day', () => {
    const ids = ASSIGNMENTS.map((t) => t.id)
    expect(ids).toEqual(ids.map((_, i) => i))
    // `day` is optional on Assignment now (API assignments drop it), but every entry in
    // the legacy local bundle must still carry one.
    expect(ASSIGNMENTS.every((t) => t.day !== undefined && [1, 2, 3].includes(t.day))).toBe(true)
  })
})
