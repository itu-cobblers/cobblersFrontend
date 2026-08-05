import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  applyTheme,
  getSystemTheme,
  readThemePreference,
  resolveTheme,
  watchSystemTheme,
  writeThemePreference,
} from './theme'

function stubMatchMedia(prefersDark: boolean, listeners: Array<(e: MediaQueryListEvent) => void> = []) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: prefersDark,
    media: query,
    addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => listeners.push(fn),
    removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => {
      const i = listeners.indexOf(fn)
      if (i >= 0) listeners.splice(i, 1)
    },
  }))
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('theme preference', () => {
  it('defaults to following the system', () => {
    expect(readThemePreference()).toBe('system')
  })

  it('round-trips an explicit choice', () => {
    writeThemePreference('dark')
    expect(readThemePreference()).toBe('dark')
  })

  // Storing 'system' as a value would make it indistinguishable from a stale
  // explicit choice — clearing the key is what keeps "follow the OS" the default.
  it('clears storage rather than storing "system"', () => {
    writeThemePreference('dark')
    writeThemePreference('system')
    expect(localStorage.getItem('bootit.theme')).toBeNull()
    expect(readThemePreference()).toBe('system')
  })

  it('ignores a junk stored value', () => {
    localStorage.setItem('bootit.theme', 'chartreuse')
    expect(readThemePreference()).toBe('system')
  })
})

describe('resolveTheme', () => {
  it('passes an explicit preference straight through', () => {
    stubMatchMedia(true)
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })

  it('asks the system only when the preference is "system"', () => {
    stubMatchMedia(true)
    expect(resolveTheme('system')).toBe('dark')
    stubMatchMedia(false)
    expect(resolveTheme('system')).toBe('light')
  })
})

describe('applyTheme', () => {
  // The Tailwind variant is `&:is(.dark *)`, so the flag has to be above
  // everything the app renders — including anything portalled out of a view.
  it('toggles the class on the document element', () => {
    applyTheme('dark')
    expect(document.documentElement).toHaveClass('dark')
    applyTheme('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })
})

describe('environments without matchMedia', () => {
  it('falls back to light instead of throwing', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(getSystemTheme()).toBe('light')
    expect(() => watchSystemTheme(() => {})()).not.toThrow()
  })
})

describe('watchSystemTheme', () => {
  it('reports changes and unsubscribes cleanly', () => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = []
    stubMatchMedia(false, listeners)
    const seen: string[] = []

    const stop = watchSystemTheme((theme) => seen.push(theme))
    listeners.forEach((fn) => fn({ matches: true } as MediaQueryListEvent))
    expect(seen).toEqual(['dark'])

    stop()
    expect(listeners).toHaveLength(0)
  })
})
