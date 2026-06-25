import type { SceneProps } from '@types'
import { useCafeScene } from './CafeScene.hooks'
import {
  CAFE_PANEL_CLASS,
  CAFE_HEADER_CLASS,
  CAFE_NAME_TAG_CLASS,
  CAFE_CANVAS_WRAP_CLASS,
} from './CafeScene.constants'

/**
 * Café theme scene. Reads `signals.cafeName` (the only signal it cares about)
 * and renders a live 3D café whose shop board shows the name.
 */
export default function CafeScene({ signals }: SceneProps) {
  const cafeName = typeof signals.cafeName === 'string' ? signals.cafeName.trim() : ''
  const { wrapRef } = useCafeScene(cafeName)

  return (
    <div className={CAFE_PANEL_CLASS}>
      <div className={CAFE_HEADER_CLASS}>
        <span>Your Café</span>
        {cafeName && <span className={CAFE_NAME_TAG_CLASS}>“{cafeName}”</span>}
      </div>
      <div className={CAFE_CANVAS_WRAP_CLASS} ref={wrapRef} />
    </div>
  )
}
