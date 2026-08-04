// ==========================================
// 1. Shared Base Models
// Common entities used across multiple API payloads.
// ==========================================

export interface StudentDto {
    studentId: string
    displayName: string
}

export interface TimerDto {
    endsAt: string // ISO 8601 string
}

export interface SourceFileDto {
    name: string
    content: string
}

// ==========================================
// 2. Session & Hub (Rooms, Rosters, Timers)
// DTOs for /api/sessions REST endpoints and SignalR Hub connections.
// ==========================================

export interface SessionCreateResponseDto {
    code: string
}

export interface SessionInfoDto {
    code: string
    assignmentSetId: string | null
}

export interface AttendanceStudentDto {
    studentId: string
    displayName: string
}

export interface SessionStateDto {
    activeTimer?: TimerDto
    focusedAssignmentId?: number
    raisedHandStudentIds?: string[]
}

export interface JoinArgsDto {
    code: string
    studentId: string
    displayName: string
}

export interface StudentCallbacks {
    onTimerStarted?: (timer: TimerDto) => void
    onAssignmentFocused?: (assignmentId: number) => void
    onSessionEnded?: () => void
    onHandsUpdated?: (studentIds: string[]) => void
}

export interface TeacherCallbacks {
    onStudentJoined?: (student: StudentDto) => void
    onRoster?: (roster: StudentDto[]) => void
    onSubmissionRecorded?: (submission: SessionSubmissionDto) => void
    onHandsUpdated?: (studentIds: string[]) => void
}

// ==========================================
// 3. Execution & Submissions
// DTOs for code execution, grading, and history logs.
// ==========================================

export type ExecuteStatus = 'success' | 'compile_error' | 'runtime_error'

export interface ExecuteRequestDto {
    code?: string
    files?: SourceFileDto[]
    entryClass?: string
    stdin?: string
}

export interface ExecuteResponseDto {
    status: ExecuteStatus
    stdout: string
    stderr: string
}

export interface SubmissionRequestDto {
    studentId: string
    sessionId?: string
    content: string | SourceFileDto[]
}

export interface SubmissionResponseDto {
    subId: string
    passed: boolean | null
    result: ExecuteResponseDto | null
    submittedAt: string
}

export interface SubmissionHistoryDto {
    subId: string
    assignmentId: number
    sessionId?: string | null
    passed: boolean | null
    submittedAt: string
}

export interface SubmissionDetailDto {
    subId: string
    studentId: string
    assignmentId: number
    sessionId: string | null
    content: string
    result: ExecuteResponseDto | null
    passed: boolean | null
    submittedAt: string
}

export interface SessionSubmissionDto {
    subId: string
    studentId: string
    assignmentId: number
    passed: boolean | null
    submittedAt: string
}

export interface SolutionResponseDto {
    solution: string | SourceFileDto[] | null
}

// ==========================================
// 4. Assignments & Content
// Wire shapes for fetching assignment data from the backend.
// ==========================================

export interface AssignmentSetSummaryDto {
    assignmentSetId: string
    displayTitle: string
}

/** Wire shape of one assignment from GET /api/assignmentsets/:id/assignments. */
export interface ApiAssignmentDto {
    id: number
    kind: 'code' | 'predict' | 'project'
    title: string
    description: string
    lesson?: Record<string, unknown>[]
    hint?: string
    content: Record<string, unknown>
    solution?: string | SourceFileDto[] | null
}