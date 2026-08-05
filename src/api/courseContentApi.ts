import type { SlidePage } from '@types'

/**
 * TEMPORARY fixture — Phase 2 replaces this with a real
 * `GET /api/assignmentsets/:id/slides` call once the backend serves slide
 * content. Call sites don't change: they already await `fetchCourseContent`.
 *
 * `firstAssignmentId` (whatever assignment currently sits first in the loaded
 * set) stands in for a real backend-authored link, so the "Try this now" /
 * "Go to slide to learn more" round trip has something real to demo against.
 */
export async function fetchCourseContent(assignmentSetId: string, firstAssignmentId?: number): Promise<SlidePage[]> {
  return [
    {
      id: 1,
      assignmentSetId,
      title: 'What is a programming language?',
      blocks: [
        { kind: 'heading', text: 'What is a programming language?' },
        {
          kind: 'text',
          text: 'A programming language is how we tell a computer what to do — a set of words and rules the computer understands, sitting between how humans think and how computers actually work.',
        },
        {
          kind: 'text',
          text: 'There are several families: imperative (step-by-step instructions), object-oriented (objects with data + behavior), functional, and logical. Java — what we\'ll use this camp — is imperative and object-oriented.',
        },
      ],
    },
    {
      id: 2,
      assignmentSetId,
      title: 'Layers of languages',
      blocks: [
        { kind: 'heading', text: 'Layers of languages' },
        {
          kind: 'text',
          text: 'Code you write (high-level) is compiled down through assembly, and finally into the 1s and 0s (machine code) the computer\'s processor actually runs. Each layer is a translation of the one above it.',
        },
        { kind: 'code', code: 'System.out.println("Hello, world!");\n// → compiled → assembly → machine code → runs' },
      ],
    },
    {
      id: 3,
      assignmentSetId,
      title: 'Try it yourself',
      blocks: [
        { kind: 'heading', text: 'Try it yourself' },
        { kind: 'text', text: 'Now that you\'ve seen how Java turns into something the computer runs, write and run your first program.' },
      ],
      relatedAssignmentId: firstAssignmentId,
    },
  ]
}
