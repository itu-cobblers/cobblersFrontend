import { useEffect, useState } from 'react'

/**
 * Live `window.innerWidth`, updated on resize (rotating a tablet fires this
 * too). Used to gate the whole app below a minimum screen size — see
 * `ScreenSizeGate`.
 */
export function useViewportWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
