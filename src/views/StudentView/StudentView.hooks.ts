import { useEffect, useState } from 'react'
import type { AssignmentSet, SubmissionHistoryItem } from '@types'
import type { JoinMode, ToastTone } from '@components'
import { getStudentId, getDisplayName } from '@lib/identity'
import { upsertStudent } from '@lib/studentApi'
import { fetchSoloAssignmentSet, fetchAssignmentSet } from '@lib/assignmentSetApi'
import { fetchSubmissionHistory } from '@lib/submissionApi'
import { joinSession } from '@lib/sessionHub'
import {
  getPersistedStudentSession,
  setPersistedStudentSession,
  clearPersistedStudentSession,
} from '@lib/studentSession'
import { getSession } from "@lib/sessionApi"

interface ToastState {
  message: string
  tone: ToastTone
}

export function useStudentApp() {
  const [persistedSession] = useState(getPersistedStudentSession)
  const [isRestoring, setIsRestoring] = useState(persistedSession !== null)

  const [assignmentSet, setAssignmentSet] = useState<AssignmentSet | null>(null)
  const [mode, setMode] = useState<JoinMode>('join')
  const [code, setCode] = useState('')
  const [teacherFocusedAssignmentId, setTeacherFocusedAssignmentId] = useState<number | null>(null)

  const [toast, setToast] = useState<ToastState | null>(null)
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)

  function handleLeaveSession() {
    clearPersistedStudentSession()
    setAssignmentSet(null)
    setCode('')
    setTeacherFocusedAssignmentId(null)
  }

  function connectToRoom(roomCode: string, displayName: string) {
    const studentId = getStudentId()
    joinSession(
        { code: roomCode, studentId, displayName },
        {
          onAssignmentFocused: setTeacherFocusedAssignmentId,
          onSessionEnded: () => {
            handleLeaveSession()
            setToast({ message: 'This session has ended — ask your teacher for the new code.', tone: 'error' })
          },
        }
    ).catch(() => console.warn('[join] hub join failed'))
  }

  useEffect(() => {
    const studentId = getStudentId()
    fetchSubmissionHistory(studentId)
        .then(setSubmissionHistory)
        .finally(() => setIsHistoryLoading(false))
  }, [])

  useEffect(() => {
    if (!persistedSession) return

    const restore = async () => {
      try {
        if (persistedSession.mode === 'solo') {
          await upsertStudent(getDisplayName())
          const set = await fetchSoloAssignmentSet()
          setAssignmentSet(set)
          setMode('solo')
        } else {
          const session = await getSession(persistedSession.code)
          if (!session.assignmentSetId) throw new Error('No assignment set')
          await upsertStudent(getDisplayName())

          connectToRoom(persistedSession.code, getDisplayName())
          const set = await fetchAssignmentSet(session.assignmentSetId)

          setAssignmentSet(set)
          setMode('join')
          setCode(persistedSession.code)
        }
      } catch (err) {
        clearPersistedStudentSession()
        setToast({ message: 'Session could not be restored — please start again. err: ' + err, tone: 'error' })
      } finally {
        setIsRestoring(false)
      }
    }

    restore()
  }, [persistedSession])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast])


  function handleJoinSuccess(roomCode: string, displayName: string, set: AssignmentSet) {
    setPersistedStudentSession({ mode: 'join', code: roomCode })
    connectToRoom(roomCode, displayName)
    setAssignmentSet(set)
    setMode('join')
    setCode(roomCode)
  }

  function handleSoloSuccess(set: AssignmentSet) {
    setPersistedStudentSession({ mode: 'solo' })
    setAssignmentSet(set)
    setMode('solo')
  }

  function refreshHistory() {
    setIsHistoryLoading(true)
    fetchSubmissionHistory(getStudentId())
        .then(setSubmissionHistory)
        .finally(() => setIsHistoryLoading(false))
  }

  return {
    isRestoring,
    toast,
    dismissToast: () => setToast(null),
    showToast: (message: string, tone: ToastTone = 'error') => setToast({ message, tone }),

    entryActions: {
      onJoinSuccess: handleJoinSuccess,
      onSoloSuccess: handleSoloSuccess,
    },

    session: {
      assignmentSet,
      mode,
      code,
      label: mode === 'solo' ? 'Solo practice' : `Room: ${code}`,
      actionLabel: mode === 'solo' ? 'Exit' : 'Leave',
      onLeave: handleLeaveSession,
      displayName: getDisplayName(),
      teacherFocusedAssignmentId: mode === 'join' ? teacherFocusedAssignmentId : null,
    },
    progress: {
      isLoading: isHistoryLoading,
      history: submissionHistory,
      onRefresh: refreshHistory,
    }
  }
}