/** Same spaced-card rhythm as STUDENT_WORKSPACE_MAIN_CLASS. */
export const TEACHER_WORKSPACE_MAIN_CLASS = 'relative z-10 flex flex-1 gap-3 overflow-hidden p-3'

/** The assignment column between the roster and the editor — the gap separates it, so no divider. */
export const TEACHER_WORKSPACE_PANEL_COLUMN_CLASS = 'flex min-w-0 flex-[4] flex-col overflow-hidden'

/**
 * Mirrors STUDENT_WORKSPACE_EDITOR_COLUMN_CLASS: no top border, so the tab
 * row's own rule is the card's top edge and the active tab breaks it.
 */
export const TEACHER_WORKSPACE_EDITOR_COLUMN_CLASS =
  'flex min-w-0 flex-[5] flex-col overflow-hidden rounded-b-md border-x border-b border-divider bg-card'
