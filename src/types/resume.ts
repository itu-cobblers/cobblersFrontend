/**
 * `GET /api/students/{studentId}/resume-suggestion` (api repo CONTRACT.md,
 * "Resume suggestion (planned)"). `null` means nothing to suggest. Not yet
 * implemented on the backend — the frontend calls it defensively (see
 * `@lib/sessionApi.fetchResumeSuggestion`) and treats any failure the same
 * as "nothing to suggest" until it exists.
 */
export interface ResumeSuggestion {
  code: string
  assignmentSetDisplayTitle: string
  createAt: string
}
