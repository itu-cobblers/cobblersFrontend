// The brief's real styling only exists in the original PDF (each project has
// its own colors/fonts) — embedding it directly reproduces that exactly,
// instead of a re-typeset excerpt that can only ever half-match it.

export const BRIEF_PDF_CLASS = 'mb-4 flex flex-col gap-1.5'

export const BRIEF_PDF_HEADER_CLASS = 'flex items-center justify-end'

export const BRIEF_PDF_LINK_CLASS =
  'inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground underline decoration-dotted hover:text-foreground'

// Sized off the PDF's own aspect ratio (US Letter) rather than a fixed
// viewport height, so it scales with the panel's actual width instead of
// over/underflowing it — `max-h` only steps in as a ceiling on short windows.
export const BRIEF_PDF_FRAME_CLASS = 'aspect-[8.5/11] h-[80vh]  w-full rounded-md bg-white'

// Best-effort PDF-viewer open-params (honored by Chromium's built-in PDF
// viewer, ignored harmlessly elsewhere): hide the toolbar/title bar, collapse
// the page-thumbnails sidebar, and default to 100% zoom.
export const PDF_VIEWER_FRAGMENT = '#toolbar=1&navpanes=0&zoom=page-width\''

// ── setup-guide popup trigger ───────────────────────────────────────────────

export const BRIEF_SETUP_BUTTON_CLASS =
  'm-4 flex w-80% items-center justify-between gap-2 rounded-md border border-border bg-muted px-3.5 py-2.5 text-left text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/60'

export const SETUP_MODAL_TITLE_CLASS = 'mb-1 text-[16px] font-semibold text-foreground'

export const SETUP_MODAL_BODY_CLASS = 'space-y-2.5 text-[13px] leading-relaxed text-muted-foreground'

export const SETUP_MODAL_H5_CLASS = 'text-[13px] font-semibold text-foreground'

export const SETUP_MODAL_LIST_CLASS = 'list-disc space-y-1 pl-5'

export const SETUP_MODAL_CLOSE_WRAP_CLASS = 'mt-4 flex justify-end'
