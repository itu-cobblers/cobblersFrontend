import { Button } from '@components/Button'
import type { SlideViewerProps } from './SlideViewer.types'
import {
  VIEWER_CLASS,
  VIEWER_SCROLL_CLASS,
  VIEWER_HEADING_CLASS,
  VIEWER_TEXT_CLASS,
  VIEWER_CODE_CLASS,
  VIEWER_IMAGE_CLASS,
  VIEWER_EMPTY_CLASS,
  VIEWER_NAV_CLASS,
} from './SlideViewer.constants'

/** Full-bleed renderer for one `SlidePage` — the Slides view's main pane. */
export default function SlideViewer({ slide, onNavigateToAssignment }: SlideViewerProps) {
  if (!slide) {
    return (
      <div className={VIEWER_CLASS}>
        <div className={VIEWER_EMPTY_CLASS}>No slides yet.</div>
      </div>
    )
  }

  const relatedAssignmentId = slide.relatedAssignmentId

  return (
    <div className={VIEWER_CLASS}>
      <div className={VIEWER_SCROLL_CLASS}>
        {slide.blocks.map((block, index) => {
          switch (block.kind) {
            case 'heading':
              return (
                <h2 key={index} className={VIEWER_HEADING_CLASS}>
                  {block.text}
                </h2>
              )
            case 'code':
              return (
                <pre key={index} className={VIEWER_CODE_CLASS}>
                  {block.code}
                </pre>
              )
            case 'image':
              return <img key={index} src={block.src} alt={block.alt} className={VIEWER_IMAGE_CLASS} />
            case 'text':
              return (
                <p key={index} className={VIEWER_TEXT_CLASS}>
                  {block.text}
                </p>
              )
          }
        })}

        {relatedAssignmentId != null && onNavigateToAssignment && (
          <div className={VIEWER_NAV_CLASS}>
            <Button variant="zinc" onClick={() => onNavigateToAssignment(relatedAssignmentId)}>
              Try this now →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
