/**
 * Anonymous, persistent student identity — no login (see the api repo's
 * CONTRACT.md "Identity"). A UUID is generated once and kept in localStorage;
 * the server keys progress by it. `displayName` is a label shown to the teacher.
 */
const ID_KEY = 'bootit.studentId'
const NAME_KEY = 'bootit.displayName'

/**
 * `displayName` shows up in tight spaces (the entry headline, the teacher's
 * roster, submission lists) — cap it so one student can't blow out that UI.
 */
export const DISPLAY_NAME_MAX_LENGTH = 24

// Control chars, bidi-override/isolate chars, and zero-width chars: harmless
// to type by accident (e.g. pasted from somewhere) but can reverse text
// direction or hide characters, visually breaking every place the name is
// rendered. Strip them rather than trying to render around them.
// eslint-disable-next-line no-control-regex -- stripping control characters is the point of this regex
const DISPLAY_NAME_UNSAFE_CHARS_RE = /[\u0000-\u001F\u007F-\u009F\u200B\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g

/** Strips control/bidi/zero-width characters and clamps to `DISPLAY_NAME_MAX_LENGTH` — call on every keystroke, not just on submit. */
export function sanitizeDisplayName(value: string): string {
  return value.replace(DISPLAY_NAME_UNSAFE_CHARS_RE, '').slice(0, DISPLAY_NAME_MAX_LENGTH)
}

export function getStudentId(): string {
  let id = localStorage.getItem(ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(ID_KEY, id)
  }
  return id
}

export function getDisplayName(): string {
  return localStorage.getItem(NAME_KEY) ?? ''
}

export function setDisplayName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}
