import { useEffect, useSyncExternalStore } from 'react'
import {
  applyTheme,
  getSystemTheme,
  readThemePreference,
  subscribeThemePreference,
  watchSystemTheme,
  writeThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from '@lib/theme'

/**
 * The app's light/dark state. Returns the *resolved* theme as well as the
 * preference, because consumers that aren't CSS — Monaco's theme name, for one
 * — need to know which one is actually showing, not which one was asked for.
 *
 * Preference and system theme are read via `useSyncExternalStore` rather than
 * local `useState`: every call site — `AppHeader`'s toggle, `CodeEditor`'s
 * theme prop — must see the same value the moment it changes, not just the
 * component that called `setPreference`.
 */
export function useTheme() {
  const preference = useSyncExternalStore(subscribeThemePreference, readThemePreference)
  const systemTheme = useSyncExternalStore(watchSystemTheme, getSystemTheme)

  const theme: ResolvedTheme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function changePreference(next: ThemePreference) {
    writeThemePreference(next)
  }

  return { theme, preference, setPreference: changePreference }
}
