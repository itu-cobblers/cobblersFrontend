/**
 * Drops in between the tab rail and the editor while a past submission is open,
 * pushing the editor down. Says which attempt you're looking at — the job the
 * old "Viewing historical submission from …" label used to do, but in the pane
 * it describes rather than off in the action rail.
 *
 * `bg-terminal` matches the editor and the active file tab, so it reads as a
 * strip inside the pane rather than a second bar of chrome breaking the join
 * between them — it is the one thing that ever comes between the two. Its
 * `border-b` is then all that separates it from the code. Invisible in light,
 * where `--terminal` and `--background` are both pure white.
 */
export const SUBMISSION_BANNER_CLASS =
  'flex h-10 shrink-0 items-center gap-2.5 border-b border-divider bg-terminal px-3 text-[13px]'

export const SUBMISSION_BANNER_TITLE_CLASS = 'font-medium text-foreground'

export const SUBMISSION_BANNER_META_CLASS = 'truncate text-muted-foreground'
