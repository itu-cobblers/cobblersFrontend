import type { ExecuteStatus } from '@types'

export const OUTPUT_STATUS_LABEL: Record<ExecuteStatus, string> = {
  success: 'Executed',
  compile_error: 'Compile error',
  runtime_error: 'Runtime error',
}

export const OUTPUT_PANEL_CLASS =
  'flex h-[40%] shrink-0 flex-col border-t border-divider bg-terminal font-mono'

export const OUTPUT_HEADER_CLASS =
  'flex shrink-0 items-center justify-between px-3.5 py-1.5 text-[11px] uppercase tracking-[0.8px] text-terminal-muted'

export const OUTPUT_HEADER_LEFT_CLASS = 'flex items-center gap-2'

export const OUTPUT_STATUS_BASE_CLASS = 'font-bold'

export const OUTPUT_CONTENT_CLASS =
  'flex-1 overflow-y-auto whitespace-pre-wrap break-all px-3.5 py-2.5 text-[13px] leading-relaxed text-terminal-ink'

export const OUTPUT_PLACEHOLDER_CLASS = 'italic text-terminal-muted'
