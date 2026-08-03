import type {SourceFileDto} from "@types";

export type AssignmentKind = 'code' | 'predict' | 'project'
export type LessonBlock = { kind: 'text'; text: string } | { kind: 'code'; code: string }
export type SourceFile = SourceFileDto

interface AssignmentBase {
  /** Server-assigned assignment id — used as the active/completed key. */
  id: number
  title: string
  /** The actual task the student must solve — shown under "Your task". */
  description: string
  /** Teaching content (concept + example code) shown above the task. */
  lesson?: LessonBlock[]
  hint?: string
  kind: AssignmentKind
  solution?: string | SourceFile[] | null
}

/** Write-and-run Java assignment (coding exercises, incl. class-authoring). */
export interface CodeAssignment extends AssignmentBase {
  kind: 'code'
  /** Initial Java shown when the assignment is opened (single-file assignments). */
  starter?: string
  /** Canned stdin for interactive programs (e.g. the guess game). */
  stdin?: string
  /**
   * Multiple editable files shown as tabs (Day-3 class-authoring assignments —
   * `person-class`, `container-class`, `flight-ticket-class` — e.g. a
   * driver `Main.java` + a stubbed `Person.java`). Mutually exclusive with
   * `starter`. File names are fixed by the assignment and are never renamed
   * by the student, only their contents change.
   */
  starterFiles?: SourceFile[]
  /** The class whose `main` is run/submitted when `starterFiles` is set. */
  entryClass?: string
}

/** Predict-the-output quiz: read-only snippet, student types the expected output. */
export interface PredictAssignment extends AssignmentBase {
  kind: 'predict'
  /** Read-only code shown in the editor. */
  snippet: string
  /** The canonical expected printed output. */
  expectedOutput: string
  /** Extra accepted answers (e.g. infinite-loop phrasings), matched after normalization. */
  accept?: string[]
}

/** Multi-file mini-project uploaded from the student's IDE (scaffolded grading). */
export interface ProjectAssignment extends AssignmentBase {
  kind: 'project'
  /** Long-form project brief. */
  brief: string
  /** Class names the project is expected to contain (for future test-case grading). */
  requiredClasses?: string[]
  /** The class whose `main` is run when the uploaded files are executed. */
  entryClass?: string
}

export type Assignment = CodeAssignment | PredictAssignment | ProjectAssignment
