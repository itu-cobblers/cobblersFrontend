import { useEffect, useState } from 'react'
import { createSession, startTimer } from '@lib/sessionApi'
import { fetchAssignmentSets, fetchAssignmentSet, type AssignmentSetSummary } from '@lib/assignmentSetApi'
import { groupAssignments } from '@lib/assignmentSet'
import { observeSession, type Student } from '@lib/sessionHub'
import { revokeTeacher } from '@lib/teacherAuth'
import type { RosterEntry, AssignmentSetPreviewGroup } from '@components'

/** Owns the teacher session + timer lifecycle, the request state, and the live roster. */
export function useTeacherSession() {
  const [assignmentSets, setAssignmentSets] = useState<AssignmentSetSummary[]>([])
  const [selectedAssignmentSetId, setSelectedAssignmentSetId] = useState('')
  const [previewGroups, setPreviewGroups] = useState<AssignmentSetPreviewGroup[]>([])
  const [previewTitle, setPreviewTitle] = useState('')

  const [sessionCode, setSessionCode] = useState<string | null>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  const [students, setStudents] = useState<RosterEntry[]>([])

  const [minutes, setMinutes] = useState(10)
  const [isStartingTimer, setIsStartingTimer] = useState(false)
  const [timerEndsAt, setTimerEndsAt] = useState<string | null>(null)
  const [timerError, setTimerError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssignmentSets()
      .then((sets) => {
        setAssignmentSets(sets)
        setSelectedAssignmentSetId((current) => current || (sets[0]?.tasksetId ?? ''))
      })
      .catch((err: unknown) => {
        console.warn('[teacher] fetchAssignmentSets failed:', err instanceof Error ? err.message : String(err))
      })
  }, [])

  // Load the selected assignment set's assignments so the teacher can browse them read-only.
  useEffect(() => {
    if (!selectedAssignmentSetId) return
    let cancelled = false
    fetchAssignmentSet(selectedAssignmentSetId)
      .then((assignmentSet) => {
        if (cancelled) return
        setPreviewTitle(assignmentSet.displayTitle)
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
    } catch (err) {
      setTimerError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsStartingTimer(false)
    }
  }

  function handleMinutesChange(value: string) {
    setMinutes(Number(value))
  }

  function handleLogout() {
    revokeTeacher()
    window.location.reload()
  }

  return {
    assignmentSets,
    selectedAssignmentSetId,
    onAssignmentSetChange: setSelectedAssignmentSetId,
    previewGroups,
    previewTitle,
    sessionCode,
    isCreatingSession,
    sessionError,
    students,
    minutes,
    isStartingTimer,
    timerEndsAt,
    timerError,
    handleCreateSession,
    handleStartTimer,
    handleMinutesChange,
    handleLogout,
  }
}
