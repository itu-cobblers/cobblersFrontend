export type SlideBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'code'; code: string }
  | { kind: 'image'; src: string; alt: string }

/** A full-bleed teaching page, independent of `Assignment` — scoped to the same assignment set a session runs. */
export interface SlidePage {
  id: number
  assignmentSetId: string
  title: string
  blocks: SlideBlock[]
  /** Jump target into Practice — "Try this now". Omitted for pure-theory pages. */
  relatedAssignmentId?: number
}
