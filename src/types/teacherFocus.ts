/** What the teacher's live "Focus" broadcast is currently pointing students at — an exercise, or a Slides page. */
export type TeacherFocus = { kind: 'assignment'; id: number } | { kind: 'slide'; id: number } | null
