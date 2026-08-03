import { useEffect, useState } from 'react'
import { getDisplayName, setDisplayName, sanitizeDisplayName, getStudentId } from '@lib/identity'
import { fetchTodayLatestSession, getSession } from '@/api/sessionApi.ts'
import { upsertStudent } from '@/api/studentApi.ts'
import { fetchSoloAssignmentSet, fetchAssignmentSet } from '@/api/assignmentSetApi.ts'
import type {AssignmentSet, SessionInfo} from '@types'

interface UseEntryPortalOptions {
  onJoinSuccess: (roomCode: string, displayName: string, set: AssignmentSet) => void
  onSoloSuccess: (set: AssignmentSet) => void
  onError: (message: string) => void
}

export function useEntryPortal({ onJoinSuccess, onSoloSuccess, onError }: UseEntryPortalOptions) {
  const [name, setName] = useState(getDisplayName)
  const [isReturningStudent] = useState(() => Boolean(getDisplayName()))
  const [isJoining, setIsJoining] = useState(false)
  const [isStartingSolo, setIsStartingSolo] = useState(false)
  const [todayLatestSession, setTodayLatestSession] = useState<SessionInfo | null | undefined>(undefined)

  useEffect(() => {
    fetchTodayLatestSession().then(setTodayLatestSession)
  }, [])

  function handleNameChange(value: string) {
    setName(sanitizeDisplayName(value))
  }

  function handleRefreshTodayLatestSession() {
    setTodayLatestSession(undefined)
    fetchTodayLatestSession().then(setTodayLatestSession)
  }

  async function handleJoinToday() {
    if (!todayLatestSession) return
    const displayName = name.trim()
    setDisplayName(displayName)
    setIsJoining(true)

    try {
      const roomCode = todayLatestSession.code
      const sessionInfo = await getSession(roomCode)
      if (!sessionInfo.assignmentSetId) throw new Error('room has no assignment set')

      await upsertStudent(displayName)
      const set = await fetchAssignmentSet(sessionInfo.assignmentSetId)

      onJoinSuccess(roomCode, displayName, set)
    } catch {
      onError('That session is no longer available — ask your teacher for a new code.')
      setTodayLatestSession(null)
    } finally {
      setIsJoining(false)
    }
  }

  async function handleStartSolo() {
    const displayName = name.trim()
    setDisplayName(displayName)
    getStudentId() // Ensure persistent ID exists
    setIsStartingSolo(true)

    try {
      await upsertStudent(displayName)
      const set = await fetchSoloAssignmentSet()

      onSoloSuccess(set)
    } catch {
      onError('Could not load the assignments — please try again in a moment.')
    } finally {
      setIsStartingSolo(false)
    }
  }

  return {
    name,
    isReturningStudent,
    todayLatestSessionCode: todayLatestSession?.code ?? (todayLatestSession === undefined ? undefined : null),
    isJoining,
    isStartingSolo,
    onNameChange: handleNameChange,
    onJoinToday: handleJoinToday,
    onStartSolo: handleStartSolo,
    onRefreshTodayLatestSession: handleRefreshTodayLatestSession,
  }
}
