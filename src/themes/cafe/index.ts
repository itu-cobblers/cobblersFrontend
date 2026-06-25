/**
 * Hygge Café theme — a self-contained skin. It owns a 3D scene that reacts to
 * `signals` broadcast by tasks (here: `signals.cafeName` → the shop board).
 */
import type { Theme } from '@types'
import CafeScene from './CafeScene'

const cafe: Theme = {
  id: 'cafe',
  name: 'Hygge Café',
  subtitle: '· Hygge Café ·',
  Scene: CafeScene,
}

export default cafe
