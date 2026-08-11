/**
 * Encodes/decodes a `TeacherFocus` onto the single numeric id the
 * `FocusAssignment` SignalR hub method carries. The hub only knows about
 * assignment ids — there is no `FocusSlide` method or `focusedSlideId` field
 * on the wire — so this is a stand-in convention until the backend adds real
 * support: positive id = assignment, negative id = -(slide id), 0 = cleared.
 * Safe because real assignment ids (Postgres serial) and slide ids are both
 * always positive, so the two spaces never collide.
 */
import type { TeacherFocus } from '@types'

export function encodeTeacherFocus(focus: TeacherFocus): number {
  if (focus === null) return 0
  return focus.kind === 'slide' ? -focus.id : focus.id
}

export function decodeTeacherFocus(rawId: number | null | undefined): TeacherFocus {
  if (rawId == null || rawId === 0) return null
  return rawId < 0 ? { kind: 'slide', id: -rawId } : { kind: 'assignment', id: rawId }
}
