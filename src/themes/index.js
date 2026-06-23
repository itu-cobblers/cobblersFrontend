/**
 * Theme registry — the plug in / plug out boundary.
 *
 * Every theme implements the same shape:
 *   { id, name, subtitle, Scene }
 *     - id       unique string
 *     - name     human label
 *     - subtitle small text shown next to the logo (empty hides it)
 *     - Scene    React component for the right panel, or null for "no scene".
 *                Receives { signals, completedTasks, activeTask }.
 *
 * To swap themes: change ACTIVE_THEME below. Set it to `nullTheme` to run the
 * plain IDE with no 3D scene at all — the editor, tasks and output still work.
 * To add a theme: drop a folder under src/themes/, export the shape, register
 * it in THEMES, and point ACTIVE_THEME at it.
 */
import cafe from './cafe'

/** No-scene theme: the IDE works on its own without any visual skin. */
export const nullTheme = {
  id: 'none',
  name: 'No theme',
  subtitle: '',
  Scene: null,
}

export const THEMES = {
  cafe,
  none: nullTheme,
}

/**
 * The theme the app currently renders. Swap this to plug a theme in/out.
 * Currently `nullTheme`: plain unbranded IDE, no 3D scene. The café theme is
 * kept registered (above) but inactive — set `ACTIVE_THEME = cafe` to re-enable it.
 */
export const ACTIVE_THEME = nullTheme
