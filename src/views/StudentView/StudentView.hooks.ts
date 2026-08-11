import { useEffect, useState } from 'react'
import type { AssignmentSet, SubmissionHistoryItem, TeacherFocus } from '@types'
import type { JoinMode, ToastTone, ViewMode } from '@components'
import { getStudentId, getDisplayName } from '@lib/identity'
import { upsertStudent } from '@/api/studentApi.ts'
import { fetchSoloAssignmentSet, fetchAssignmentSet } from '@/api/assignmentSetApi.ts'
import { fetchSubmissionHistory } from '@/api/submissionApi.ts'
import { joinSession, leaveSession, raiseHand, lowerHand } from '@/api/sessionHub.ts'
import { decodeTeacherFocus } from '@lib/teacherFocus'
import {
  getPersistedStudentSession,
  setPersistedStudentSession,
  clearPersistedStudentSession,
} from '@lib/studentSession'
import { getPersistedWorkspaceUI, setPersistedWorkspaceUI } from '@lib/studentWorkspaceUI'
import { getSession } from "@/api/sessionApi.ts"

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
  // Raw encoded value off the hub — see @lib/teacherFocus for the sentinel
  // convention (positive = assignment, negative = -(slide id), 0 = cleared).
  const [teacherFocusRaw, setTeacherFocusRaw] = useState<number | null>(null)
  const teacherFocus: TeacherFocus = decodeTeacherFocus(teacherFocusRaw)
  const [timerEndsAt, setTimerEndsAt] = useState<string | null>(null)
  const [raisedHandStudentIds, setRaisedHandStudentIds] = useState<string[]>([])

  const [toast, setToast] = useState<ToastState | null>(null)
  const [submissionHistory, setSubmissionHistory] = useState<SubmissionHistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)

  // Opens on the deck, not the exercises — the instructor talks over Slides, then
  // switches to Practice when it's time for students to do something. Only a
  // genuinely fresh session (nothing persisted yet) defaults to Slides; a
  // refresh mid-session restores whichever tab/page was last open.
  const [viewMode, setViewMode] = useState<ViewMode>(() => getPersistedWorkspaceUI()?.viewMode ?? 'slides')
  const [lastSlideId, setLastSlideId] = useState<number | null>(() => getPersistedWorkspaceUI()?.lastSlideId ?? null)
  const [pendingAssignmentId, setPendingAssignmentId] = useState<number | null>(null)
  const [pendingSlideId, setPendingSlideId] = useState<number | null>(null)

  useEffect(() => {
    setPersistedWorkspaceUI({ viewMode, lastSlideId })
  }, [viewMode, lastSlideId])

  function navigateToAssignment(assignmentId: number) {
    setPendingAssignmentId(assignmentId)
    setViewMode('practice')
  }

  function navigateToSlide(slideId: number) {
    setPendingSlideId(slideId)
    setLastSlideId(slideId)
    setViewMode('slides')
  }

  function handleLeaveSession() {
    clearPersistedStudentSession()
    setAssignmentSet(null)
    setCode('')
    setTeacherFocusRaw(null)
    setTimerEndsAt(null)
    setRaisedHandStudentIds([])
    leaveSession().catch((err: unknown) => console.warn('[room] leaveSession failed:', err))
  }

  function connectToRoom(roomCode: string, displayName: string) {
    const studentId = getStudentId()
    joinSession(
        { code: roomCode, studentId, displayName },
        {
          onAssignmentFocused: setTeacherFocusRaw,
          onTimerStarted: (timer) => setTimerEndsAt(timer.endsAt),
          onHandsUpdated: setRaisedHandStudentIds,
          onSessionEnded: () => {
            handleLeaveSession()
            setToast({ message: 'This session has ended — ask your teacher for the new code.', tone: 'error' })
          },
        }
    ).catch(() => console.warn('[join] hub join failed'))
  }

  function handleToggleHand() {
    if (mode !== 'join' || !code) return
    const studentId = getStudentId()
    if (raisedHandStudentIds.includes(studentId)) {
      lowerHand(code, studentId).catch((err: unknown) => console.warn('[room] lowerHand failed:', err))
    } else {
      raiseHand(code, studentId).catch((err: unknown) => console.warn('[room] raiseHand failed:', err))
    }
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
      teacherFocus: mode === 'join' ? teacherFocus : null,
      timerEndsAt: mode === 'join' ? timerEndsAt : null,
      isHandRaised: mode === 'join' && raisedHandStudentIds.includes(getStudentId()),
      onToggleHand: mode === 'join' ? handleToggleHand : undefined,
    },
    view: {
      mode: viewMode,
      onModeChange: setViewMode,
      pendingAssignmentId,
      onConsumedPendingAssignment: () => setPendingAssignmentId(null),
      pendingSlideId,
      onConsumedPendingSlide: () => setPendingSlideId(null),
      navigateToAssignment,
      navigateToSlide,
      lastSlideId,
      onActiveSlideChange: setLastSlideId,
    },
    progress: {
      isLoading: isHistoryLoading,
      history: submissionHistory,
      onRefresh: refreshHistory,
    }
  }
}