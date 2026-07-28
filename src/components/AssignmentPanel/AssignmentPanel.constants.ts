// 4:6 split with the editor column (STUDENT_EDITOR_COLUMN_CLASS / PROJECT_PANEL_CLASS) — description gets 4, code gets 6.
export const PANEL_CLASS = 'flex min-w-0 flex-[4] flex-col overflow-hidden border-r border-border bg-card/40'

export const PANEL_SCROLL_CLASS = 'flex-1 overflow-y-auto px-5 py-4'

export const PANEL_TITLE_CLASS = 'mb-3 text-[19px] font-semibold tracking-tight text-foreground'

export const PANEL_LESSON_TEXT_CLASS = 'mb-3 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground'

export const PANEL_LESSON_CODE_CLASS =
  'mb-3 overflow-x-auto rounded-md bg-black/30 px-3.5 py-3 font-mono text-[12px] leading-relaxed whitespace-pre text-foreground/90'

export const PANEL_TASK_LABEL_CLASS = 'mb-1.5 mt-4 text-[13px] font-semibold uppercase tracking-[0.8px] text-accent'

export const PANEL_TASK_CLASS = 'whitespace-pre-wrap text-[15px] leading-relaxed text-foreground'

export const PANEL_BODY_CLASS = 'mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground'

// ── project brief (embedded PDF) ────────────────────────────────────────────
// The brief's real styling only exists in the original PDF (each project has
// its own colors/fonts) — embedding it directly reproduces that exactly,
// instead of a re-typeset excerpt that can only ever half-match it.

export const PANEL_PROJECT_PDF_CLASS = 'mb-4 flex flex-col gap-1.5'

export const PANEL_PROJECT_PDF_HEADER_CLASS = 'flex items-center justify-end'

export const PANEL_PROJECT_PDF_LINK_CLASS =
  'inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground underline decoration-dotted hover:text-foreground'

export const PANEL_PROJECT_PDF_FRAME_CLASS = 'h-[80vh] w-full rounded-md border border-border bg-white'

// Best-effort PDF-viewer open-params (honored by Chromium's built-in PDF
// viewer, ignored harmlessly elsewhere): hide the toolbar/title bar, collapse
// the page-thumbnails sidebar, and default to 100% zoom.
export const PDF_VIEWER_FRAGMENT = '#toolbar=0&navpanes=0&scrollbar=0&zoom=100'

// ── project setup-guide disclosure ─────────────────────────────────────────

export const PANEL_SETUP_CLASS = 'mb-4 rounded-md border border-border bg-muted/40 px-3.5 py-2.5'

export const PANEL_SETUP_TOGGLE_CLASS =
  'flex w-full items-center justify-between gap-2 text-left text-[13px] font-semibold text-foreground'

export const PANEL_SETUP_BODY_CLASS = 'mt-2.5 space-y-2.5 text-[13px] leading-relaxed text-muted-foreground'

export const PANEL_SETUP_H5_CLASS = 'text-[13px] font-semibold text-foreground'

export const PANEL_SETUP_LIST_CLASS = 'list-disc space-y-1 pl-5'

export const PANEL_HINT_CLASS =
  'mt-4 rounded border-l-[3px] border-accent bg-accent/10 px-2.5 py-2 text-[12px] leading-relaxed text-foreground'

export const PANEL_HINT_TOGGLE_CLASS =
  'flex w-full items-center justify-between gap-2 text-left font-medium text-foreground'

export const PANEL_HINT_ARROW_CLASS = 'inline-block text-[18px] transition-transform'

export const PANEL_HINT_ARROW_EXPANDED_CLASS = 'rotate-90'

export const PANEL_HINT_BODY_CLASS = 'mt-1.5'

export const PANEL_HINT_CODE_CLASS = 'font-mono text-[11px] text-foreground'

export const PANEL_TABS_CLASS = 'flex h-10 shrink-0 items-stretch gap-1 border-b border-border px-3'

export const PANEL_TAB_BASE_CLASS = 'relative flex h-full items-center px-3 text-sm transition-colors'

export const PANEL_TAB_ACTIVE_CLASS = 'text-foreground'

export const PANEL_TAB_IDLE_CLASS = 'text-muted-foreground hover:text-foreground'

export const PANEL_TAB_UNDERLINE_CLASS = 'absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent'

export const PANEL_TAB_COUNT_CLASS = 'ml-2 rounded bg-muted px-1.5 text-[10px]'

export const PANEL_SUBMISSIONS_EMPTY_CLASS =
  'flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground'

export const PANEL_SUBMISSIONS_LIST_CLASS = 'divide-y divide-border rounded-md border border-border'

export const PANEL_SUBMISSION_ROW_CLASS = 'flex items-center justify-between gap-3 px-4 py-3 text-left text-sm'

export const PANEL_SUBMISSION_BADGE_PASSED_CLASS =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500'

export const PANEL_SUBMISSION_BADGE_FAILED_CLASS =
  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500'

export const PANEL_SUBMISSION_TITLE_CLASS = 'text-sm font-medium text-foreground'

export const PANEL_SUBMISSION_META_CLASS = 'text-[11px] text-muted-foreground'
