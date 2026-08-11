import classNames from 'classnames'
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Icon } from '@components/Icon'
import { useFitPageWidth, usePageArrowKeys, useThumbnailPanel } from './SlideViewer.hooks'
import type { SlideViewerProps } from './SlideViewer.types'
import {
  VIEWER_CLASS,
  VIEWER_DOCUMENT_CLASS,
  VIEWER_SCROLL_CLASS,
  VIEWER_PAGE_WRAPPER_CLASS,
  VIEWER_LOADING_CLASS,
  VIEWER_FOCUS_BUTTON_CLASS,
  VIEWER_FOCUS_BUTTON_ACTIVE_CLASS,
  VIEWER_FOCUS_BUTTON_IDLE_CLASS,
  VIEWER_LIVE_BADGE_CLASS,
  VIEWER_THUMBNAILS_CLASS,
  VIEWER_THUMBNAIL_BUTTON_CLASS,
  VIEWER_THUMBNAIL_BUTTON_ACTIVE_CLASS,
  VIEWER_THUMBNAIL_LABEL_CLASS,
  VIEWER_FOOTER_CLASS,
  VIEWER_FOOTER_LEFT_CLASS,
  VIEWER_FOOTER_EXPAND_BUTTON_CLASS,
  VIEWER_FOOTER_EXPAND_ICON_CLASS,
  VIEWER_FOOTER_PAGER_CLASS,
  VIEWER_FOOTER_BUTTON_CLASS,
  VIEWER_FOOTER_COUNTER_CLASS,
  VIEWER_FOOTER_RIGHT_CLASS,
  VIEWER_FOOTER_GOTO_BUTTON_CLASS,
  VIEWER_FOOTER_FOLLOW_CLASS,
  VIEWER_FOOTER_FOLLOW_DOT_CLASS,
  VIEWER_FOOTER_FOLLOW_LABEL_CLASS,
  VIEWER_FOOTER_FOLLOW_BUTTON_CLASS,
} from './SlideViewer.constants'

// react-pdf renders off a background worker; Vite needs the explicit `?url`-style
// resolution below to bundle it correctly (a bare package path won't emit a file).
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

/** Full-bleed renderer for one page of the Content deck's PDF, with an expand/pager/go-to footer — the Slides view's main pane. */
export default function SlideViewer({
  pdfSrc,
  pageNumber,
  pageCount,
  onNavigate,
  onLoadSuccess,
  relatedAssignmentId,
  onNavigateToAssignment,
  isPageLive,
  onToggleFocus,
  followBanner,
}: SlideViewerProps) {
  const { containerRef, fitWidth, handlePageLoadSuccess } = useFitPageWidth()
  const thumbnails = useThumbnailPanel()

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => onLoadSuccess(numPages)
  const handleTryThisNow = () => {
    if (relatedAssignmentId != null) onNavigateToAssignment?.(relatedAssignmentId)
  }
  const handlePrevPage = () => onNavigate(pageNumber - 1)
  const handleNextPage = () => onNavigate(pageNumber + 1)

  usePageArrowKeys({ onPrev: handlePrevPage, onNext: handleNextPage, canGoPrev: pageNumber > 1, canGoNext: pageCount > 0 && pageNumber < pageCount })

  return (
    <div className={VIEWER_CLASS}>
      <Document
        file={pdfSrc}
        onLoadSuccess={handleDocumentLoadSuccess}
        loading={<div className={VIEWER_LOADING_CLASS}>Loading…</div>}
        className={VIEWER_DOCUMENT_CLASS}
      >
        <div ref={containerRef} className={VIEWER_SCROLL_CLASS}>
          <div className={VIEWER_PAGE_WRAPPER_CLASS}>
            <Page
              pageNumber={pageNumber}
              width={fitWidth}
              onLoadSuccess={handlePageLoadSuccess}
              renderTextLayer={false}
            />
          </div>
        </div>

        {thumbnails.isOpen && pageCount > 0 && (
          <div className={VIEWER_THUMBNAILS_CLASS}>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className={classNames(VIEWER_THUMBNAIL_BUTTON_CLASS, page === pageNumber && VIEWER_THUMBNAIL_BUTTON_ACTIVE_CLASS)}
              >
                <Thumbnail pageNumber={page} width={88} />
                <span className={VIEWER_THUMBNAIL_LABEL_CLASS}>{page}</span>
              </button>
            ))}
          </div>
        )}
      </Document>

      <div className={VIEWER_FOOTER_CLASS}>
        <div className={VIEWER_FOOTER_LEFT_CLASS}>
          <button
            type="button"
            onClick={thumbnails.toggle}
            title={thumbnails.isOpen ? 'Hide page thumbnails' : 'Show page thumbnails'}
            aria-label={thumbnails.isOpen ? 'Hide page thumbnails' : 'Show page thumbnails'}
            className={VIEWER_FOOTER_EXPAND_BUTTON_CLASS}
          >
            <span className={classNames(VIEWER_FOOTER_EXPAND_ICON_CLASS, !thumbnails.isOpen && 'rotate-180')}>
              <Icon name="chevronDown" />
            </span>
          </button>
        </div>

        <div className={VIEWER_FOOTER_PAGER_CLASS}>
          <button type="button" onClick={handlePrevPage} disabled={pageNumber <= 1} className={VIEWER_FOOTER_BUTTON_CLASS} aria-label="Previous page">
            ‹
          </button>
          <span className={VIEWER_FOOTER_COUNTER_CLASS}>{pageNumber} / {pageCount || '–'}</span>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={pageCount === 0 || pageNumber >= pageCount}
            className={VIEWER_FOOTER_BUTTON_CLASS}
            aria-label="Next page"
          >
            ›
          </button>
        </div>

        <div className={VIEWER_FOOTER_RIGHT_CLASS}>
          {relatedAssignmentId != null && onNavigateToAssignment && (
            <button type="button" onClick={handleTryThisNow} className={VIEWER_FOOTER_GOTO_BUTTON_CLASS}>
              Try this now →
            </button>
          )}
          {(onToggleFocus || isPageLive) && (
            onToggleFocus ? (
              <button
                type="button"
                onClick={onToggleFocus}
                title="Broadcast this page to every student in the room"
                className={classNames(
                  VIEWER_FOCUS_BUTTON_CLASS,
                  isPageLive ? VIEWER_FOCUS_BUTTON_ACTIVE_CLASS : VIEWER_FOCUS_BUTTON_IDLE_CLASS,
                )}
              >
                <Icon name={isPageLive ? 'check' : 'arrowUp'} />
                {isPageLive ? 'Live for students' : 'Focus this page'}
              </button>
            ) : (
              <span className={VIEWER_LIVE_BADGE_CLASS}>
                <Icon name="check" />
                live
              </span>
            )
          )}
          {followBanner && (
            <div className={VIEWER_FOOTER_FOLLOW_CLASS} role="status">
              <span className={VIEWER_FOOTER_FOLLOW_DOT_CLASS} aria-hidden="true" />
              <span className={VIEWER_FOOTER_FOLLOW_LABEL_CLASS}>
                Teacher moved to <strong>{followBanner.label}</strong>
              </span>
              <button type="button" className={VIEWER_FOOTER_FOLLOW_BUTTON_CLASS} onClick={followBanner.onFollow}>
                Follow →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
