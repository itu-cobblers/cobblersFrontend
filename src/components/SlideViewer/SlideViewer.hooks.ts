import { useEffect, useState } from 'react'

/** Whether the page-thumbnail strip is expanded — local UI state, not persisted. */
export function useThumbnailPanel() {
  const [isOpen, setIsOpen] = useState(false)
  return { isOpen, toggle: () => setIsOpen((open) => !open) }
}

/**
 * Tracks the page container's rendered size and the PDF's native page aspect
 * ratio (read off the first page that loads), and derives the `width` to hand
 * `<Page>` so the rendered page fits both the container's width AND height at
 * once instead of always filling the width and letting height overflow.
 */
export function useFitPageWidth() {
  // A plain `useRef` + effect-on-mount would read `current` before it's ever
  // attached: `<Document>` renders its `loading` fallback (not `children`,
  // where this container lives) until the PDF file resolves, so the element
  // doesn't exist yet on first mount. A state-backed callback ref re-fires
  // the effect once the node actually appears.
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [pageAspect, setPageAspect] = useState<number | null>(null)

  useEffect(() => {
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [container])

  const handlePageLoadSuccess = ({ originalWidth, originalHeight }: { originalWidth: number; originalHeight: number }) =>
    setPageAspect(originalWidth / originalHeight)

  const fitWidth =
    containerSize.width > 0 && containerSize.height > 0 && pageAspect
      ? Math.min(containerSize.width, containerSize.height * pageAspect)
      : containerSize.width || undefined

  return { containerRef: setContainer, fitWidth, handlePageLoadSuccess }
}
