import type { ComponentType } from 'react'
import type { Signals } from './assignment'

/** Props every theme `Scene` receives (the right-hand panel). */
export interface SceneProps {
  signals: Signals
  completedAssignments: Set<number>
  activeAssignment: number
}

/**
 * A pluggable visual skin. `Scene` is the right-hand panel component, or `null`
 * for the plain IDE with no scene. Swap themes via ACTIVE_THEME in themes/index.
 */
export interface Theme {
  id: string
  name: string
  /** Small text next to the logo; empty string hides it. */
  subtitle: string
  Scene: ComponentType<SceneProps> | null
}
