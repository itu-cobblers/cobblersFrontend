import type { JoinMode } from './EntryPortal.types.ts'

export const ENTRY_PORTAL_SCREEN_CLASS =
  'dark relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground'

export const ENTRY_PORTAL_GRID_CLASS = 'pointer-events-none absolute inset-0 bootit-grid opacity-70'

export const ENTRY_PORTAL_GLOW_CLASS =
  'pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 bootit-glow'

export const ENTRY_PORTAL_SCANLINE_CLASS =
  'pointer-events-none absolute inset-x-0 top-0 h-32 bootit-scanline opacity-40'

export const ENTRY_PORTAL_VIGNETTE_CLASS =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]'

export const ENTRY_PORTAL_HEADER_CLASS = 'relative z-10 flex items-center justify-between px-8 py-6'

export const ENTRY_PORTAL_BRAND_CLASS =
  'flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-foreground/60'

export const ENTRY_PORTAL_DOT_CLASS = 'h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_currentColor]'

export const ENTRY_PORTAL_CENTER_CLASS =
  'relative z-10 mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-4xl flex-col items-center justify-center px-6 text-center'

export const ENTRY_PORTAL_TITLE_CLASS = 'bootit-title text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl'

export const ENTRY_PORTAL_SUBTITLE_CLASS = 'mt-6 text-lg font-light tracking-wide text-foreground/60'

export const ENTRY_PORTAL_NAME_LABEL_CLASS = 'mb-4 text-[11px] uppercase tracking-[0.4em] text-foreground/40'

export const ENTRY_PORTAL_NAME_INPUT_CLASS =
  'w-full max-w-md border-none bg-transparent text-center text-3xl font-light tracking-[0.02em] text-foreground outline-none placeholder:text-foreground/20 sm:text-4xl'

export const ENTRY_PORTAL_TOGGLE_CLASS = 'mt-14 flex gap-1 rounded-lg border border-border bg-white/[0.03] p-1'

export const ENTRY_PORTAL_TOGGLE_BTN_BASE_CLASS =
  'rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors'

export const ENTRY_PORTAL_TOGGLE_BTN_ACTIVE_CLASS = 'bg-accent text-accent-foreground'

export const ENTRY_PORTAL_TOGGLE_BTN_IDLE_CLASS = 'text-foreground/50 hover:text-foreground'

export const ENTRY_PORTAL_FIELD_CLASS = 'mt-8 w-full max-w-xs'

export const ENTRY_PORTAL_FIELD_LABEL_CLASS = 'mb-2 text-[11px] uppercase tracking-[0.3em] text-foreground/40'

export const ENTRY_PORTAL_HINT_CLASS = 'mt-8 max-w-sm text-[12px] leading-relaxed text-foreground/50'

export const ENTRY_PORTAL_CTA_ROW_CLASS = 'mt-10 flex flex-col-reverse items-center gap-4 sm:flex-row'

export const ENTRY_PORTAL_SOLO_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-white/[0.03] px-6 py-3 text-sm font-medium text-secondary-foreground backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_JOIN_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_FOOTER_CLASS =
  'relative z-10 flex items-center justify-between px-8 pb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/30'

export const ENTRY_PORTAL_TOGGLE_LABELS: Record<JoinMode, string> = {
  join: 'Join a class',
  solo: 'Solo practice',
}

export const ENTRY_PORTAL_SOLO_HINT =
  "Solo practice is for when you can't join a class on site — work through the assignments at your own pace."
