export const ENTRY_PORTAL_SCREEN_CLASS =
  'dark relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground'

export const ENTRY_PORTAL_GRID_CLASS = 'pointer-events-none absolute inset-0 bootit-grid opacity-70'

export const ENTRY_PORTAL_GLOW_CLASS =
  'pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 bootit-glow'

export const ENTRY_PORTAL_SCANLINE_CLASS =
  'pointer-events-none absolute inset-x-0 top-0 h-32 bootit-scanline opacity-40'

export const ENTRY_PORTAL_VIGNETTE_CLASS =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]'

export const ENTRY_PORTAL_HEADER_CLASS = 'relative z-10 flex items-center justify-center px-8 py-8'

export const ENTRY_PORTAL_BRAND_CLASS =
  'inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-foreground/60 backdrop-blur'

export const ENTRY_PORTAL_DOT_CLASS = 'h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_currentColor]'

export const ENTRY_PORTAL_CENTER_CLASS =
  'relative z-10 mx-auto flex min-h-[calc(100vh-200px)] w-full max-w-4xl flex-col items-center justify-center px-6 text-center'

export const ENTRY_PORTAL_TITLE_CLASS = 'bootit-title text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl'

export const ENTRY_PORTAL_SUBTITLE_CLASS = 'mt-6 text-lg font-light tracking-wide text-foreground/60'

export const ENTRY_PORTAL_NAME_LABEL_CLASS = 'mt-14 mb-5 text-[11px] uppercase tracking-[0.4em] text-foreground/40'

export const ENTRY_PORTAL_NAME_ROW_CLASS = 'flex min-h-[1.2em] w-full max-w-md items-center justify-center'

export const ENTRY_PORTAL_NAME_MEASURE_CLASS = 'relative inline-flex items-center'

export const ENTRY_PORTAL_NAME_INPUT_CLASS =
  'bootit-name-input [field-sizing:content] min-w-[1ch] max-w-full border-none bg-transparent text-center text-3xl font-light tracking-[0.02em] text-foreground outline-none sm:text-4xl'

export const ENTRY_PORTAL_CTA_ROW_CLASS = 'mt-12 flex flex-col-reverse items-center gap-4 sm:flex-row'

export const ENTRY_PORTAL_SOLO_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-white/[0.03] px-6 py-3 text-sm font-medium text-secondary-foreground backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_JOIN_BTN_CLASS =
  'inline-flex items-center gap-3 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/[0.03] disabled:text-foreground/40 disabled:shadow-none disabled:border disabled:border-border'

export const ENTRY_PORTAL_JOIN_BTN_CODE_CLASS =
  'rounded bg-black/20 px-2 py-0.5 text-xs font-semibold tracking-wider'

export const ENTRY_PORTAL_NO_SESSION_ROW_CLASS =
  'inline-flex items-center gap-3 rounded-md border border-border bg-white/[0.03] px-6 py-3 text-sm font-medium text-foreground/40'

export const ENTRY_PORTAL_REFRESH_BTN_CLASS =
  'inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/50 transition hover:bg-white/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'

export const ENTRY_PORTAL_FOOTER_CLASS =
  'relative z-10 flex items-center justify-between px-8 pb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/30'

export const ENTRY_PORTAL_NO_SESSION_LABEL = 'No current active session to join'

export const ENTRY_PORTAL_CHECKING_LABEL = 'Checking for a session…'