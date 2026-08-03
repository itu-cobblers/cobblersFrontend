/**
 * Drops in between the tab rail and the editor while a past submission is open,
 * pushing the editor down. Says which attempt you're looking at — the job the
 * old "Viewing historical submission from …" label used to do, but in the pane
 * it describes rather than off in the action rail.
 */
export const SUBMISSION_BANNER_CLASS =
  'flex h-10 shrink-0 items-center gap-2.5 border-b border-divider bg-background px-3 text-[13px]'

export const SUBMISSION_BANNER_TITLE_CLASS = 'font-medium text-foreground'

export const SUBMISSION_BANNER_META_CLASS = 'truncate text-muted-foreground'
