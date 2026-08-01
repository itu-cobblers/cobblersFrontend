import { useEffect, useState } from 'react'
import type { Assignment, SourceFile } from '@types'
import { createSession, getSession, startTimer, endSession } from '@lib/sessionApi'
import { fetchAssignmentSets, fetchAssignmentSet, type AssignmentSetSummary } from '@lib/assignmentSetApi'
import { groupAssignments } from '@lib/assignmentSet'
import { observeSession, focusAssignment, type Student } from '@lib/sessionHub'
import { revokeTeacher } from '@lib/teacherAuth'
import { fetchAssignmentSolution } from '@lib/submissionApi'
import {
  getPersistedTeacherSession,
  setPersistedTeacherSession,
  clearPersistedTeacherSession,
} from '@lib/teacherSession'
import type { RosterEntry, AssignmentSetPreviewGroup } from '@components'

/** Owns the teacher session + timer lifecycle, the request state, and the live roster. */
export function useTeacherSession() {
  const [assignmentSets, setAssignmentSets] = useState<AssignmentSetSummary[]>([])
  const [selectedAssignmentSetId, setSelectedAssignmentSetId] = useState('')
  const [previewGroups, setPreviewGroups] = useState<AssignmentSetPreviewGroup[]>([])
  const [previewTitle, setPreviewTitle] = useState('')
  // Full assignment objects (incl. starter/starterFiles) — the flattened preview
  // items above only carry the fields the read-only AssignmentSetPreview needs.
  const [assignments, setAssignments] = useState<Assignment[]>([])

  const [sessionCode, setSessionCode] = useState<string | null>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const [students, setStudents] = useState<RosterEntry[]>([])
  // The assignment last broadcast to the room via the hub (best-effort; see focusAssignment).
  const [focusedAssignmentId, setFocusedAssignmentId] = useState<number | null>(null)

  const [minutes, setMinutes] = useState(10)
  const [isStartingTimer, setIsStartingTimer] = useState(false)
  const [timerEndsAt, setTimerEndsAt] = useState<string | null>(null)
  const [timerError, setTimerError] = useState<string | null>(null)

  // Read once on mount; drives the lazy initial state below and the rehydrate effect.
  const [persistedSession] = useState(getPersistedTeacherSession)
  const [isRestoringSession, setIsRestoringSession] = useState(persistedSession !== null)

  useEffect(() => {
    fetchAssignmentSets()
      .then((sets) => {
        setAssignmentSets(sets)
        setSelectedAssignmentSetId((current) => current || (sets[0]?.assignmentSetId ?? ''))
      })
      .catch((err: unknown) => {
        console.warn('[teacher] fetchAssignmentSets failed:', err instanceof Error ? err.message : String(err))
      })
  }, [])

  // Rehydrate a persisted active session on mount so a refresh resumes the
  // active-session view instead of dropping back to Browse. Roster and
  // assignment-set content are always re-fetched live.
  useEffect(() => {
    if (!persistedSession) return

    getSession(persistedSession.code)
      .then((info) => {
        setSessionCode(persistedSession.code)
        setSelectedAssignmentSetId(info.assignmentSetId ?? '')
        if (persistedSession.timerEndsAt && new Date(persistedSession.timerEndsAt) > new Date()) {
          setTimerEndsAt(persistedSession.timerEndsAt)
        }
        observe(persistedSession.code)
      })
      .catch(() => {
        clearPersistedTeacherSession()
        setSessionError('Your previous session is no longer available.')
      })
      .finally(() => setIsRestoringSession(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- observe/mergeLiveRoster are recreated every render; this is a mount-only rehydrate keyed on the stable persistedSession value
  }, [persistedSession])

  // Load the selected assignment set's assignments so the teacher can browse them read-only.
  useEffect(() => {
    if (!selectedAssignmentSetId) return
    let cancelled = false
    fetchAssignmentSet(selectedAssignmentSetId)
      .then((assignmentSet) => {
        if (cancelled) return
        setPreviewTitle(assignmentSet.displayTitle)
        setAssignments(assignmentSet.assignments)
        setPreviewGroups(
          groupAssignments(assignmentSet.assignments, 'Assignments').map((group) => ({
            label: group.label,
            items: group.items.map((assignment) => ({
              id: assignment.id,
              title: assignment.title,
              kind: assignment.kind,
              description: assignment.description,
              hint: assignment.hint,
            })),
          })),
        )
      })
      .catch((err: unknown) => {
        console.warn('[teacher] fetchAssignmentSet failed:', err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
    }
  }, [selectedAssignmentSetId])

  function observe(code: string) {
    // Best-effort: if the hub is unreachable the dashboard still works (mock roster below).
    observeSession(code, {
      onRoster: (roster) => mergeLiveRoster(roster),
      onStudentJoined: (student) => mergeLiveRoster([student]),
    }).catch((err: unknown) => {
      const reason = err instanceof Error ? err.message : String(err)
      console.warn('[room] observe failed:', reason)
    })
  }

  // Fold live SignalR students (name only, no progress yet) into the roster.
  function mergeLiveRoster(roster: Student[]) {
    setStudents((prev) => {
      const next = [...prev]
      for (const student of roster) {
        if (next.some((s) => s.studentId === student.studentId)) continue
        next.push({
          studentId: student.studentId,
          displayName: student.displayName,
          completed: 0,
          total: previewCount(),
          currentTitle: 'Just joined',
          status: 'working',
        })
      }
      return next
    })
  }

  function previewCount() {
    return previewGroups.reduce((sum, group) => sum + group.items.length, 0) || 1
  }

  async function handleCreateSession() {
    if (!selectedAssignmentSetId) return
    setIsCreatingSession(true)
    setSessionError(null)
    try {
      const { code } = await createSession(selectedAssignmentSetId)
      setSessionCode(code)
      setPersistedTeacherSession({ code, timerEndsAt: null })
      observe(code)
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsCreatingSession(false)
    }
  }

  async function handleStartTimer() {
    if (!sessionCode) return
    setIsStartingTimer(true)
    setTimerError(null)
    try {
      const { endsAt } = await startTimer(sessionCode, minutes)
      setTimerEndsAt(endsAt)
      setPersistedTeacherSession({ code: sessionCode, timerEndsAt: endsAt })
    } catch (err) {
      setTimerError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsStartingTimer(false)
    }
  }

  function handleMinutesChange(value: number) {
    setMinutes(value)
  }

  // Dual-selection states for Col 1 (Assignment) and Col 2 (Student).
  // Unlike the student toggle, the assignment side can never be empty — the
  // teacher always lands on some task. Rather than defaulting via an effect
  // (which would setState during render's commit phase), the raw selection
  // is derived against the current preview list on every render: `null` (or
  // a stale id from a since-changed set) falls back to the first assignment.
  const [selectedAssignmentIdRaw, setSelectedAssignmentIdRaw] = useState<number | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  const previewAssignmentIds = previewGroups.flatMap((group) => group.items.map((item) => item.id))
  const selectedAssignmentId =
    selectedAssignmentIdRaw !== null && previewAssignmentIds.includes(selectedAssignmentIdRaw)
      ? selectedAssignmentIdRaw
      : previewAssignmentIds[0] ?? null

  function handleSelectAssignment(id: number) {
    setSelectedAssignmentIdRaw(id)
  }

  function handleSelectStudent(studentId: string | null) {
    setSelectedStudentId((prev) => (prev === studentId ? null : studentId))
  }

  function handleClearStudentFilter() {
    setSelectedStudentId(null)
  }

  // ── project reference solution & predict expected-output reveal ──────────
  // Both mirror the student view's "Show answer" behavior — toggled by the
  // same shared button, no re-fetch on hide — but are never gated: the
  // teacher can reveal either at any time, with no submission required.
  const [solutionByAssignment, setSolutionByAssignment] = useState<Record<number, SourceFile[]>>({})
  const [loadingSolutionAssignmentId, setLoadingSolutionAssignmentId] = useState<number | null>(null)
  const [isSolutionVisibleByAssignment, setIsSolutionVisibleByAssignment] = useState<Record<number, boolean>>({})
  const [isAnswerVisibleByAssignment, setIsAnswerVisibleByAssignment] = useState<Record<number, boolean>>({})

  async function handleToggleSolution(assignmentId: number) {
    if (isSolutionVisibleByAssignment[assignmentId]) {
      setIsSolutionVisibleByAssignment((prev) => ({ ...prev, [assignmentId]: false }))
      return
    }
    if (!solutionByAssignment[assignmentId]) {
      setLoadingSolutionAssignmentId(assignmentId)
      try {
        const result = await fetchAssignmentSolution(assignmentId)
        if (Array.isArray(result.solution)) {
          setSolutionByAssignment((prev) => ({ ...prev, [assignmentId]: result.solution as SourceFile[] }))
        }
      } finally {
        setLoadingSolutionAssignmentId((current) => (current === assignmentId ? null : current))
      }
    }
    setIsSolutionVisibleByAssignment((prev) => ({ ...prev, [assignmentId]: true }))
  }

  function handleToggleAnswer(assignmentId: number) {
    setIsAnswerVisibleByAssignment((prev) => ({ ...prev, [assignmentId]: !prev[assignmentId] }))
  }


  /**
   * The teacher's manual "End session" action: marks the room ended in the DB
   * (`POST /api/sessions/:code/end`), which fans out `SessionEnded` over the
   * hub so any still-connected students bounce back to their entry screen —
   * then clears the local teacher-side state regardless of the request's
   * outcome, since there's nothing useful to keep around either way.
   */
  async function handleEndSession() {
    if (sessionCode) {
      setIsEndingSession(true)
      try {
        await endSession(sessionCode)
      } catch (err) {
        console.warn('[teacher] endSession failed:', err instanceof Error ? err.message : String(err))
      } finally {
        setIsEndingSession(false)
      }
    }
    clearPersistedTeacherSession()
    setSessionCode(null)
    setStudents([])
    setTimerEndsAt(null)
    setSessionError(null)
    setTimerError(null)
    setFocusedAssignmentId(null)
  }

  /** Broadcasts "teacher moved to this assignment" to every student in the room (best-effort). */
  function handleFocusAssignment(id: number) {
    if (!sessionCode) return
    setFocusedAssignmentId(id)
    focusAssignment(sessionCode, id).catch((err: unknown) => {
      console.warn('[room] focusAssignment failed:', err instanceof Error ? err.message : String(err))
    })
  }

  function handleLogout() {
    clearPersistedTeacherSession()
    revokeTeacher()
    window.location.reload()
  }

  return {
    assignmentSets,
    selectedAssignmentSetId,
    onAssignmentSetChange: setSelectedAssignmentSetId,
    previewGroups,
    previewTitle,
    assignments,
    sessionCode,
    isCreatingSession,
    isEndingSession,
    sessionError,
    students,
    minutes,
    isStartingTimer,
    timerEndsAt,
    timerError,
    isRestoringSession,
    focusedAssignmentId,
    handleCreateSession,
    handleStartTimer,
    handleMinutesChange,
    handleEndSession,
    handleFocusAssignment,
    handleLogout,
    // Dual selection state & handlers
    selectedAssignmentId,
    selectedStudentId,
    handleSelectAssignment,
    handleSelectStudent,
    handleClearStudentFilter,
    // Project reference solution & predict expected-output reveal
    solutionByAssignment,
    loadingSolutionAssignmentId,
    isSolutionVisibleByAssignment,
    isAnswerVisibleByAssignment,
    handleToggleSolution,
    handleToggleAnswer,
  }
}
