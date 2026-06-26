import { describe, it, expect } from 'vitest'
import { TASKS } from './tasks'

const codeCheck = (id: number) => {
  const task = TASKS.find((t) => t.id === id)
  if (task?.kind !== 'code') throw new Error(`task ${id} is not a code task`)
  return task.check
}

describe('task grading', () => {
  it('café task passes on any output and broadcasts cafeName', () => {
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

  it('every task has a unique sequential id and a valid day', () => {
    const ids = TASKS.map((t) => t.id)
    expect(ids).toEqual(ids.map((_, i) => i))
    expect(TASKS.every((t) => [1, 2, 3].includes(t.day))).toBe(true)
  })
})
