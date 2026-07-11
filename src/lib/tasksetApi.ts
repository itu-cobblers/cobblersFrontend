/**
 * tasksetApi.ts — the taskset + roster data seam.
 *
 * ⚠️ TEMPORARY MOCK DATA ⚠️
 * Every function in this file currently returns hardcoded data derived from the
 * local `TASKS` array so the teacher/student UI can be built and reviewed BEFORE
 * the backend + SignalR are ready. None of this is real. When the API lands,
 * swap each function body for the real call named in its header comment — the
 * callers (useTeacherSession / useStudentSession) don't change.
 */
import type { Task, Taskset } from '@types'
import { TASKS } from './tasks'

export interface TaskSetSummary {
  tasksetId: string
  displayTitle: string
}

/**
 * MOCK — real: `GET /api/tasksets`. The teacher's session-creation picker. Each
 * day is its own independent taskset (Day 1 / Day 2 / Day 3).
 */
const MOCK_TASKSETS: { tasksetId: string; displayTitle: string; day: number }[] = [
  { tasksetId: 'mock-bootit-day1', displayTitle: 'BootIT — Day 1 · Basics', day: 1 },
  { tasksetId: 'mock-bootit-day2', displayTitle: 'BootIT — Day 2 · Loops & Logic', day: 2 },
  { tasksetId: 'mock-bootit-day3', displayTitle: 'BootIT — Day 3 · Objects & Projects', day: 3 },
]

export async function fetchTasksets(): Promise<TaskSetSummary[]> {
  // MOCK — delete this body when the API lands; replace with fetch('/api/tasksets').
  return Promise.resolve(MOCK_TASKSETS.map(({ tasksetId, displayTitle }) => ({ tasksetId, displayTitle })))
}

/**
 * MOCK — real: `GET /api/tasksets/:id`. The full taskset (with its tasks) the
 * teacher previews before creating a session. Each mock taskset holds only its
 * own day's tasks.
 */
export async function fetchTaskset(tasksetId: string): Promise<Taskset> {
  // MOCK — delete this body when the API lands.
  const summary = MOCK_TASKSETS.find((set) => set.tasksetId === tasksetId)
  const day = summary?.day
  return Promise.resolve({
    tasksetId,
    displayTitle: summary?.displayTitle ?? 'Task set',
    tasks: TASKS.filter((task: Task) => task.day === day),
  })
}

/**
 * MOCK — real: the taskset payload the socket returns from `joinSession` (class)
 * or the solo-practice endpoint. For now every student gets the Day-1 set.
 */
export async function fetchStudentTaskset(): Promise<Taskset> {
  // MOCK — delete this body when the socket returns a real taskset.
  return fetchTaskset('mock-bootit-day1')
}

/** Per-student answering status shown in the teacher roster. */
export type StudentStatus = 'working' | 'stuck' | 'done'

export interface MockStudentProgress {
  studentId: string
  displayName: string
  completed: number
  currentTitle: string
  status: StudentStatus
}

/**
 * MOCK — real: roster + progress arrive over the `observeSession` socket
 * (`RosterUpdated` + a future per-student progress event). Fabricates a small
 * class with deterministic progress so the active-session screen isn't empty
 * while the hub is unavailable.
 */
export async function fetchMockRoster(): Promise<MockStudentProgress[]> {
  // MOCK — delete this whole function when live roster/progress land.
  const day1 = TASKS.filter((task) => task.day === 1)
  const total = day1.length || 1
  const names = ['Maria', 'Chen', 'Aïsha', 'Tom']
  const statuses: StudentStatus[] = ['working', 'stuck', 'done', 'working']
  return Promise.resolve(
    names.map((displayName, index) => {
      const completed = Math.min(total, index * 2 + 1)
      const status = completed >= total ? 'done' : statuses[index]
      const current = day1[Math.min(completed, day1.length - 1)]
      return {
        studentId: `mock-student-${index}`,
        displayName,
        completed,
        currentTitle: status === 'done' ? 'Finished' : (current?.title ?? '—'),
        status,
      }
    }),
  )
}
