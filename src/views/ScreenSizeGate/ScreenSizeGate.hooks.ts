import { useViewportWidth } from '@hooks/useViewportWidth'
import { MIN_SUPPORTED_WIDTH } from './ScreenSizeGate.constants'

export function useScreenSizeGate() {
  const viewportWidth = useViewportWidth()
  return viewportWidth < MIN_SUPPORTED_WIDTH
}
