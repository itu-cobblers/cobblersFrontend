import { useEffect, useState } from 'react'
import {
  applyTheme,
  getSystemTheme,
  readThemePreference,
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
 * `theme` is derived rather than held in state: storing it would mean setting
 * state from an effect on every preference change, which cascades renders.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  const theme: ResolvedTheme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Tracked always, applied only while the preference is `system` — an explicit
  // choice shouldn't be overridden when the OS appearance changes.
  useEffect(() => watchSystemTheme(setSystemTheme), [])

  function changePreference(next: ThemePreference) {
    writeThemePreference(next)
    setPreference(next)
  }

  return { theme, preference, setPreference: changePreference }
}
