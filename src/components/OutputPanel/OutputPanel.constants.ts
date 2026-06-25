import type { ExecuteStatus } from '@types'

export const OUTPUT_STATUS_LABEL: Record<ExecuteStatus, string> = {
  success: 'Success',
  compile_error: 'Compile error',
  runtime_error: 'Runtime error',
}

export const OUTPUT_PANEL_CLASS =
  'flex h-[150px] shrink-0 flex-col border-t border-oak bg-espresso font-mono'

export const OUTPUT_HEADER_CLASS =
  'flex shrink-0 items-center justify-between border-b border-oak px-3.5 py-1.5 text-[11px] uppercase tracking-[0.8px] text-foam'

export const OUTPUT_STATUS_BASE_CLASS = 'font-bold'

export const OUTPUT_CONTENT_CLASS =
  'flex-1 overflow-y-auto whitespace-pre-wrap break-all px-3.5 py-2.5 text-[13px] leading-relaxed text-milk'

export const OUTPUT_PLACEHOLDER_CLASS = 'italic text-foam'
