/** Half of the IDE column so the prediction input shares the viewport with the snippet. */
export const PREDICT_PANEL_CLASS =
  'flex h-1/2 shrink-0 flex-col border-t border-terminal-line bg-terminal font-mono'

export const PREDICT_HEADER_CLASS =
  'flex shrink-0 items-center justify-between border-b border-terminal-line px-3.5 py-1.5 text-[11px] uppercase tracking-[0.8px] text-terminal-muted'

export const PREDICT_STATUS_OK_CLASS = 'font-bold text-term-ok'

export const PREDICT_STATUS_BAD_CLASS = 'font-bold text-term-err'

export const PREDICT_BODY_CLASS = 'flex min-h-0 flex-1 flex-col overflow-y-auto p-3.5'

export const PREDICT_HINT_CLASS = 'mb-2 shrink-0 font-sans text-[12px] text-terminal-muted'

export const PREDICT_SUCCESS_CLASS = 'shrink-0 font-sans text-[13px] text-term-ok'

/** Fills the panel body so the input reads as half the IDE column. */
export const PREDICT_TEXTAREA_CLASS =
  'min-h-0 w-full flex-1 resize-none rounded-md border border-terminal-line bg-black/30 px-3 py-2 text-[13px] text-terminal-ink outline-none focus:border-terminal-muted'

export const PREDICT_REVEAL_LABEL_CLASS =
  'mb-1 mt-3 shrink-0 text-[11px] uppercase tracking-[0.8px] text-terminal-muted'

export const PREDICT_REVEAL_CLASS =
  'min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap break-all rounded-md border border-terminal-line bg-black/30 px-3 py-2 text-[13px] text-terminal-ink'

export const PREDICT_FOOTER_CLASS =
  'flex shrink-0 items-center justify-end gap-2.5 border-t border-terminal-line px-3.5 py-2'

/** Secondary action on the dark terminal chrome (Button's ghost uses light ink tokens). */
export const PREDICT_SECONDARY_BUTTON_CLASS =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-terminal-line bg-transparent px-4 py-1.5 text-[13px] font-semibold text-terminal-muted transition enabled:hover:border-terminal-muted enabled:hover:text-terminal-ink'
