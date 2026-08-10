/**
 * Light/dark selection. `'system'` follows the OS and is the default; the two
 * explicit values pin it and survive a reload.
 *
 * The class goes on `<html>` because the Tailwind variant is
 * `@custom-variant dark (&:is(.dark *))` — it styles *descendants* of `.dark`,
 * so the flag has to sit above everything the app renders. Putting it on a view
 * root (as this app used to) means anything portalled outside that root — a
 * modal, a Monaco overlay — silently stays light.
 */
export type ThemePreference = 'light' | 'dark' | 'system'

export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'bootit.theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Guarded: jsdom has no `matchMedia`, and neither would any non-browser host. */
export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export function readThemePreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

export function writeThemePreference(preference: ThemePreference): void {
  if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
  else localStorage.setItem(STORAGE_KEY, preference)
  preferenceListeners.forEach((listener) => listener())
}

/**
 * Every `useTheme()` call reads the same localStorage-backed preference, but
 * each call site is a separate React instance — without this, only the
 * component that called `setPreference` would re-render, and every other
 * consumer (Monaco's theme name, for one) would stay stale until a remount.
 */
const preferenceListeners = new Set<() => void>()

export function subscribeThemePreference(onChange: () => void): () => void {
  preferenceListeners.add(onChange)
  return () => preferenceListeners.delete(onChange)
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference
}

/** Single place the class is actually written, so nothing else touches it. */
export function applyTheme(theme: ResolvedTheme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/** Fires while the preference is `system`; returns an unsubscribe. */
export function watchSystemTheme(onChange: (theme: ResolvedTheme) => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const query = window.matchMedia(DARK_QUERY)
  const handler = (event: MediaQueryListEvent) => onChange(event.matches ? 'dark' : 'light')
  query.addEventListener('change', handler)
  return () => query.removeEventListener('change', handler)
}
