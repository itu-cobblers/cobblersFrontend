// src/api/sessionApi.ts

import type {AttendanceStudentDto, SessionCreateResponseDto, SessionInfoDto, SessionSubmissionDto, TimerDto} from "@types";

export async function createSession(assignmentSetId: string): Promise<SessionCreateResponseDto> {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignmentSetId }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getSession(code: string): Promise<SessionInfoDto> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(code)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function startTimer(sessionCode: string, durationMinutes: number): Promise<TimerDto> {
  const res = await fetch(`/api/sessions/${sessionCode}/timer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ durationMinutes }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function endSession(code: string): Promise<void> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(code)}/end`, { method: 'POST' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function fetchTodayLatestSession(): Promise<SessionInfoDto | null> {
  try {
    const res = await fetch('/api/sessions/today-latest')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchSessionAttendance(code: string): Promise<AttendanceStudentDto[]> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(code)}/attendance`);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchSessionSubmissions(code: string): Promise<SessionSubmissionDto[]> {
  const res = await fetch(`/api/sessions/${encodeURIComponent(code)}/submissions`);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}