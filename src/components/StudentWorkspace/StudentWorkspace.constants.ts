export const STUDENT_WORKSPACE_LAYOUT_CLASS = 'relative flex h-screen flex-col overflow-hidden bg-background text-foreground'

/**
 * `p-3` keeps the folder tabs off the app header and the window edges; `gap-3`
 * is what separates the rail from the rest. The three sections are cards now,
 * so the old shared dividers are gone.
 */
export const STUDENT_WORKSPACE_MAIN_CLASS = 'relative z-10 flex flex-1 gap-3 overflow-hidden p-3'

export const STUDENT_WORKSPACE_CLASS = 'flex min-w-0 flex-1 gap-3 overflow-hidden'

export const STUDENT_WORKSPACE_CONTENT_COLUMN_CLASS = 'flex min-w-0 flex-1 flex-col overflow-hidden'

// 4:6 split with AssignmentPanel (PANEL_CLASS) — description gets 4, code/project gets 6.
export const STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS =
  'flex min-w-0 flex-[6] flex-col overflow-hidden bg-card'

/**
 * Carries the card's outline instead of the section, so the sides start at the
 * tab row's rule rather than running up past it and exposing the seam.
 */
export const STUDENT_WORKSPACE_EDITOR_BODY_CLASS =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-md border-x border-b border-divider'

/** Shown after the brand lockup in the header bar: "ITU BootIT / BootCode". */
export const WORKSPACE_SECTION_LABEL = 'BootCode'
