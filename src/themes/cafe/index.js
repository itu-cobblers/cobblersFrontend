/**
 * Hygge Café theme.
 *
 * A theme is a self-contained "skin" for the app. It owns a 3D scene that
 * reacts to `signals` broadcast by tasks (see src/lib/tasks.js). The core
 * app never interprets signals — this theme decides which ones it cares about
 * (here: `signals.cafeName` → the shop board).
 *
 * Theme shape: { id, name, subtitle, Scene }
 *   Scene is a React component rendered as the right-hand panel. It receives
 *   { signals, completedTasks, activeTask } and may use any/none of them.
 */
import CafeScene from './CafeScene'

export default {
  id: 'cafe',
  name: 'Hygge Café',
  subtitle: '· Hygge Café ·',
  Scene: CafeScene,
}
