import { useEffect, useState } from 'react'
import { createSession, startTimer } from '@lib/sessionApi'
import { fetchTasksets, fetchTaskset, type TaskSetSummary } from '@lib/tasksetApi'
import { groupTasks } from '@lib/taskset'
import { observeSession, type Student } from '@lib/sessionHub'
import { revokeTeacher } from '@lib/teacherAuth'
import type { RosterEntry, TasksetPreviewGroup } from '@components'

/** Owns the teacher session + timer lifecycle, the request state, and the live roster. */
export function useTeacherSession() {
  const [tasksets, setTasksets] = useState<TaskSetSummary[]>([])
  const [selectedTasksetId, setSelectedTasksetId] = useState('')
  const [previewGroups, setPreviewGroups] = useState<TasksetPreviewGroup[]>([])
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
    fetchTasksets()
      .then((sets) => {
        setTasksets(sets)
        setSelectedTasksetId((current) => current || (sets[0]?.tasksetId ?? ''))
      })
      .catch((err: unknown) => {
        console.warn('[teacher] fetchTasksets failed:', err instanceof Error ? err.message : String(err))
      })
  }, [])

  // Load the selected taskset's tasks so the teacher can browse them read-only.
  useEffect(() => {
    if (!selectedTasksetId) return
    let cancelled = false
    fetchTaskset(selectedTasksetId)
      .then((taskset) => {
        if (cancelled) return
        setPreviewTitle(taskset.displayTitle)
        setPreviewGroups(
          groupTasks(taskset.tasks, 'Tasks').map((group) => ({
            label: group.label,
            items: group.items.map((task) => ({
              id: task.id,
              title: task.title,
              kind: task.kind,
              description: task.description,
              hint: task.hint,
            })),
          })),
        )
      })
      .catch((err: unknown) => {
        console.warn('[teacher] fetchTaskset failed:', err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
    }
  }, [selectedTasksetId])

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
    if (!selectedTasksetId) return
    setIsCreatingSession(true)
    setSessionError(null)
    try {
      const { code } = await createSession(selectedTasksetId)
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
    tasksets,
    selectedTasksetId,
    onTasksetChange: setSelectedTasksetId,
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
