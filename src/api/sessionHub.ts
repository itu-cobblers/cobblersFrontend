// src/lib/sessionHub.ts
import * as signalR from '@microsoft/signalr'
import type {
  StudentDto,
  TimerDto,
  SessionStateDto,
  JoinArgsDto,
  StudentCallbacks,
  TeacherCallbacks,
  SessionSubmissionDto
} from '@types';

const HUB_URL = '/hub'
let connection: signalR.HubConnection | null = null

async function getConnection(): Promise<signalR.HubConnection> {
  if (connection && connection.state === signalR.HubConnectionState.Connected) return connection
  const conn = new signalR.HubConnectionBuilder().withUrl(HUB_URL).withAutomaticReconnect().build()
  await conn.start()
  connection = conn
  return conn
}

export async function joinSession(args: JoinArgsDto, callbacks: StudentCallbacks = {}): Promise<void> {
  const conn = await getConnection()
  if (callbacks.onTimerStarted) {
    conn.on('TimerStarted', (timer: TimerDto) => callbacks.onTimerStarted?.(timer))
  }
  if (callbacks.onAssignmentFocused) {
    conn.on('AssignmentFocused', (assignmentId: number) => callbacks.onAssignmentFocused?.(assignmentId))
  }
  if (callbacks.onSessionEnded) {
    conn.on('SessionEnded', () => callbacks.onSessionEnded?.())
  }
  const state = await conn.invoke<SessionStateDto>('JoinSession', args)
  if (state?.activeTimer) callbacks.onTimerStarted?.(state.activeTimer)
  if (state?.focusedAssignmentId != null) callbacks.onAssignmentFocused?.(state.focusedAssignmentId)
}

export async function focusAssignment(code: string, assignmentId: number): Promise<void> {
  const conn = await getConnection()
  await conn.invoke('FocusAssignment', code, assignmentId)
}

/**
 * Closes the shared hub connection so the server's OnDisconnectedAsync fires
 * right away, instead of leaving the student's connection (and therefore
 * their spot in the live roster) dangling until the tab itself closes.
 */
export async function leaveSession(): Promise<void> {
  if (!connection) return
  const conn = connection
  connection = null
  await conn.stop()
}

export async function observeSession(code: string, callbacks: TeacherCallbacks = {}): Promise<void> {
  const conn = await getConnection()

  if (callbacks.onStudentJoined) {
    conn.on('StudentJoined', (student: StudentDto) => callbacks.onStudentJoined?.(student))
  }
  if (callbacks.onRoster) {
    conn.on('RosterUpdated', (roster: StudentDto[]) => callbacks.onRoster?.(roster))
  }
  if (callbacks.onSubmissionRecorded) {
    conn.on('SubmissionRecorded', (submission: SessionSubmissionDto) => callbacks.onSubmissionRecorded?.(submission))
  }

  const roster = await conn.invoke<StudentDto[]>('ObserveSession', code)
  if (roster) callbacks.onRoster?.(roster)
}