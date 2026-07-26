export const STUDENT_LAYOUT_CLASS = 'dark relative flex h-screen flex-col overflow-hidden bg-background text-foreground'

export const STUDENT_RESTORING_CLASS = 'dark flex h-screen items-center justify-center bg-background text-foreground'

// Ambient grid + glow, same effect as the entry screen — kept behind the workspace chrome (z-0);
// the panels' translucent backgrounds (bg-card/40, /70…) let it show through.
export const STUDENT_GRID_CLASS = 'pointer-events-none absolute inset-0 z-0 bootit-grid opacity-40'

export const STUDENT_GLOW_CLASS =
  'pointer-events-none absolute -top-40 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 bootit-glow opacity-50'

export const STUDENT_MAIN_CLASS = 'relative z-10 flex flex-1 overflow-hidden'

export const STUDENT_WORKSPACE_CLASS = 'flex min-w-0 flex-1 overflow-hidden'

export const STUDENT_CONTENT_COLUMN_CLASS = 'flex min-w-0 flex-1 flex-col overflow-hidden'

// 4:6 split with AssignmentPanel (PANEL_CLASS) — description gets 4, code/project gets 6.
export const STUDENT_EDITOR_COLUMN_CLASS = 'flex min-w-0 flex-[6] flex-col overflow-hidden'
