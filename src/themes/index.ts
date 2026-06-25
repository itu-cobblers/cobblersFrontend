/**
 * Theme registry — the plug-in / plug-out boundary.
 *
 * To swap themes: change ACTIVE_THEME. Set it to `nullTheme` to run the plain
 * IDE with no 3D scene. To add a theme: drop a folder under src/themes/, export
 * the Theme shape, register it in THEMES, and point ACTIVE_THEME at it.
 */
import type { Theme } from '@types'
import cafe from './cafe'

/** No-scene theme: the IDE works on its own without any visual skin. */
export const nullTheme: Theme = {
  id: 'none',
  name: 'No theme',
  subtitle: '',
  Scene: null,
}

export const THEMES: Record<string, Theme> = {
  cafe,
  none: nullTheme,
}

/**
 * The theme the app currently renders. Currently `nullTheme` (plain IDE).
 * Set `ACTIVE_THEME = cafe` to re-enable the café scene.
 */
export const ACTIVE_THEME: Theme = nullTheme
