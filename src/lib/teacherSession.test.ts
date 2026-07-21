import { describe, it, expect, beforeEach } from 'vitest'
import {
  getPersistedTeacherSession,
  setPersistedTeacherSession,
  clearPersistedTeacherSession,
} from './teacherSession'

describe('teacherSession', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when nothing is persisted', () => {
    expect(getPersistedTeacherSession()).toBeNull()
  })

  it('round-trips a session with no timer', () => {
    setPersistedTeacherSession({ code: 'ABCD1234', timerEndsAt: null })
    expect(getPersistedTeacherSession()).toEqual({ code: 'ABCD1234', timerEndsAt: null })
  })

  it('round-trips a session with a running timer', () => {
    setPersistedTeacherSession({ code: 'ABCD1234', timerEndsAt: '2026-07-21T12:00:00.000Z' })
    expect(getPersistedTeacherSession()).toEqual({ code: 'ABCD1234', timerEndsAt: '2026-07-21T12:00:00.000Z' })
  })

  it('clears the persisted session', () => {
    setPersistedTeacherSession({ code: 'ABCD1234', timerEndsAt: null })
    clearPersistedTeacherSession()
    expect(getPersistedTeacherSession()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    localStorage.setItem('bootit.teacherSession', '{not json')
    expect(getPersistedTeacherSession()).toBeNull()
  })

  it('returns null for a session missing a code', () => {
    localStorage.setItem('bootit.teacherSession', JSON.stringify({ timerEndsAt: null }))
    expect(getPersistedTeacherSession()).toBeNull()
  })
})
