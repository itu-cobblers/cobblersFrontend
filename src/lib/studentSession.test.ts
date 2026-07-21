import { describe, it, expect, beforeEach } from 'vitest'
import {
  getPersistedStudentSession,
  setPersistedStudentSession,
  clearPersistedStudentSession,
} from './studentSession'

describe('studentSession', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when nothing is persisted', () => {
    expect(getPersistedStudentSession()).toBeNull()
  })

  it('round-trips a join session', () => {
    setPersistedStudentSession({ mode: 'join', code: 'ABCD1234' })
    expect(getPersistedStudentSession()).toEqual({ mode: 'join', code: 'ABCD1234' })
  })

  it('round-trips a solo session', () => {
    setPersistedStudentSession({ mode: 'solo' })
    expect(getPersistedStudentSession()).toEqual({ mode: 'solo' })
  })

  it('clears the persisted session', () => {
    setPersistedStudentSession({ mode: 'solo' })
    clearPersistedStudentSession()
    expect(getPersistedStudentSession()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    localStorage.setItem('bootit.studentSession', '{not json')
    expect(getPersistedStudentSession()).toBeNull()
  })

  it('returns null for an unknown mode', () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'bogus' }))
    expect(getPersistedStudentSession()).toBeNull()
  })

  it('returns null for a join session missing a code', () => {
    localStorage.setItem('bootit.studentSession', JSON.stringify({ mode: 'join' }))
    expect(getPersistedStudentSession()).toBeNull()
  })
})
