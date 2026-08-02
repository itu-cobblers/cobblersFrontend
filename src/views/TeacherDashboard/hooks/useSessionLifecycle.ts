import { useState, useEffect } from 'react'
import { createSession, getSession, startTimer, endSession } from '@lib/sessionApi.ts'
import { getPersistedTeacherSession, setPersistedTeacherSession, clearPersistedTeacherSession } from '@lib/teacherSession.ts'

export function useSessionLifecycle(onRestoreSetId: (id: string) => void) {
    const [sessionCode, setSessionCode] = useState<string | null>(null)
    const [isCreatingSession, setIsCreatingSession] = useState(false)
    const [isEndingSession, setIsEndingSession] = useState(false)
    const [sessionError, setSessionError] = useState<string | null>(null)

    const [minutes, setMinutes] = useState(10)
    const [isStartingTimer, setIsStartingTimer] = useState(false)
    const [timerEndsAt, setTimerEndsAt] = useState<string | null>(null)
    const [timerError, setTimerError] = useState<string | null>(null)

    const [persistedSession] = useState(getPersistedTeacherSession)
    const [isRestoringSession, setIsRestoringSession] = useState(persistedSession !== null)

    useEffect(() => {
        if (!persistedSession) return
        getSession(persistedSession.code)
            .then((info) => {
                setSessionCode(persistedSession.code)
                onRestoreSetId(info.assignmentSetId ?? '')
                if (persistedSession.timerEndsAt && new Date(persistedSession.timerEndsAt) > new Date()) {
                    setTimerEndsAt(persistedSession.timerEndsAt)
                }
            })
            .catch(() => {
                clearPersistedTeacherSession()
                setSessionError('Your previous session is no longer available.')
            })
            .finally(() => setIsRestoringSession(false))
    }, [persistedSession, onRestoreSetId])

    async function handleCreateSession(selectedAssignmentSetId: string) {
        if (!selectedAssignmentSetId) return
        setIsCreatingSession(true)
        setSessionError(null)
        try {
            const { code } = await createSession(selectedAssignmentSetId)
            setSessionCode(code)
            setPersistedTeacherSession({ code, timerEndsAt: null })
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

    async function handleEndSession() {
        if (sessionCode) {
            setIsEndingSession(true)
            try {
                await endSession(sessionCode)
            } catch (err) {
                console.warn('[teacher] endSession failed:', err)
            } finally {
                setIsEndingSession(false)
            }
        }
        clearPersistedTeacherSession()
        setSessionCode(null)
        setTimerEndsAt(null)
        setSessionError(null)
        setTimerError(null)
    }

    return {
        sessionCode, isCreatingSession, isEndingSession, sessionError, isRestoringSession,
        minutes, setMinutes, isStartingTimer, timerEndsAt, timerError,
        handleCreateSession, handleStartTimer, handleEndSession
    }
}