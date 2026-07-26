/**
 * sessionHub.ts — the single seam to the SignalR hub (teacher↔student rooms).
 *
 * Best-effort: if the backend isn't running, connecting throws and the caller
 * degrades gracefully (solo students simply stay offline). When the backend is
 * up, this exercises the real hub — no frontend change needed. See CONTRACT.md
 * (Sessions / rooms, Timer).
 */
import * as signalR from '@microsoft/signalr'

export interface Student {
  studentId: string
  displayName: string
}

export interface Timer {
  endsAt: string
}

/** State the hub replies with on join (so late joiners sync). */
interface SessionState {
  activeTimer?: Timer
}

export interface JoinArgs {
  code: string
  studentId: string
  displayName: string
}

export interface StudentCallbacks {
  onTimerStarted?: (timer: Timer) => void
  /** The teacher moved to a different assignment — id of the newly-focused assignment. */
  onAssignmentFocused?: (assignmentId: number) => void
}

export interface TeacherCallbacks {
  onStudentJoined?: (student: Student) => void
  onRoster?: (roster: Student[]) => void
}

const HUB_URL = '/hub'

let connection: signalR.HubConnection | null = null

async function getConnection(): Promise<signalR.HubConnection> {
  if (connection && connection.state === signalR.HubConnectionState.Connected) return connection
  const conn = new signalR.HubConnectionBuilder().withUrl(HUB_URL).withAutomaticReconnect().build()
  await conn.start()
  connection = conn
  return conn
}

/** Student joins a room; receives the timer + "teacher moved to" broadcasts. */
export async function joinSession(args: JoinArgs, callbacks: StudentCallbacks = {}): Promise<void> {
  const conn = await getConnection()
  if (callbacks.onTimerStarted) {
    conn.on('TimerStarted', (timer: Timer) => callbacks.onTimerStarted?.(timer))
  }
  if (callbacks.onAssignmentFocused) {
    conn.on('AssignmentFocused', (assignmentId: number) => callbacks.onAssignmentFocused?.(assignmentId))
  }
  const state = await conn.invoke<SessionState>('JoinSession', args)
  if (state?.activeTimer) callbacks.onTimerStarted?.(state.activeTimer)
}

/** Teacher moves to a different assignment; broadcasts it to every student in the room (best-effort — see CONTRACT.md). */
export async function focusAssignment(code: string, assignmentId: number): Promise<void> {
  const conn = await getConnection()
  await conn.invoke('FocusAssignment', code, assignmentId)
}

/** Teacher observes a room; receives the live roster of students. */
export async function observeSession(code: string, callbacks: TeacherCallbacks = {}): Promise<void> {
  const conn = await getConnection()
  if (callbacks.onStudentJoined) {
    conn.on('StudentJoined', (student: Student) => callbacks.onStudentJoined?.(student))
  }
  if (callbacks.onRoster) {
    conn.on('RosterUpdated', (roster: Student[]) => callbacks.onRoster?.(roster))
  }
  const roster = await conn.invoke<Student[]>('ObserveSession', code)
  if (roster) callbacks.onRoster?.(roster)
}
