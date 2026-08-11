import { useState, useEffect, useCallback } from 'react'
import type { StudentDto, SessionSubmissionDto, TeacherFocus } from '@types'
import {focusAssignment, lowerHand, observeSession} from "@/api/sessionHub.ts";
import { encodeTeacherFocus } from '@lib/teacherFocus'

interface UseTeacherLiveSessionProps {
    sessionCode: string | null
    onSubmissionRecorded: (submission: SessionSubmissionDto) => void
    /** Fires with every student seen over the hub (roster snapshot or a single join) — folds names into the attendance list as they arrive. */
    onLiveStudents?: (students: StudentDto[]) => void
}

export function useTeacherLiveSession({ sessionCode, onSubmissionRecorded, onLiveStudents }: UseTeacherLiveSessionProps) {
    const [liveStudentIds, setLiveStudentIds] = useState<Set<string>>(new Set())
    const [teacherFocus, setTeacherFocus] = useState<TeacherFocus>(null)
    const [raisedHandOrder, setRaisedHandOrder] = useState<string[]>([])

    const handleRosterUpdate = useCallback((roster: StudentDto[]) => {
        setLiveStudentIds(new Set(roster.map(s => s.studentId)))
        onLiveStudents?.(roster)
    }, [onLiveStudents])

    const handleStudentJoined = useCallback((student: StudentDto) => {
        setLiveStudentIds(prev => {
            const next = new Set(prev)
            next.add(student.studentId)
            return next
        })
        onLiveStudents?.([student])
    }, [onLiveStudents])

    useEffect(() => {
        if (!sessionCode) return

        let cancelled = false

        observeSession(sessionCode, {
            onRoster: (roster) => !cancelled && handleRosterUpdate(roster),
            onStudentJoined: (student) => !cancelled && handleStudentJoined(student),
            onSubmissionRecorded: (sub) => !cancelled && onSubmissionRecorded(sub),
            onHandsUpdated: (studentIds) => !cancelled && setRaisedHandOrder(studentIds),
        }).catch((err) => console.warn('[room] observe failed:', err))

        return () => {
            cancelled = true
        }
    }, [sessionCode, handleRosterUpdate, handleStudentJoined, onSubmissionRecorded])

    // `focusAssignment` carries the encoded id — see `@lib/teacherFocus` for the
    // positive/negative/zero convention this stands in for until the backend
    // grows a real `FocusSlide`/clear-focus hub method.
    const broadcastFocus = useCallback((focus: TeacherFocus) => {
        if (!sessionCode) return
        setTeacherFocus(focus)
        focusAssignment(sessionCode, encodeTeacherFocus(focus)).catch((err) => console.warn('[room] focusAssignment failed:', err))
    }, [sessionCode])

    // Toggle helpers so callers don't need to know `teacherFocus`'s internal
    // `kind`/`id` shape just to answer "is this the thing that's already focused?".
    const handleToggleFocusAssignment = useCallback((id: number) => {
        if (teacherFocus?.kind === 'assignment' && teacherFocus.id === id) {
            broadcastFocus(null)
        } else {
            broadcastFocus({ kind: 'assignment', id })
        }
    }, [teacherFocus, broadcastFocus])

    const handleToggleFocusSlide = useCallback((id: number) => {
        if (teacherFocus?.kind === 'slide' && teacherFocus.id === id) {
            broadcastFocus(null)
        } else {
            broadcastFocus({ kind: 'slide', id })
        }
    }, [teacherFocus, broadcastFocus])

    const handleLowerHand = useCallback((studentId: string) => {
        if (!sessionCode) return
        lowerHand(sessionCode, studentId).catch((err) => console.warn('[room] lowerHand failed:', err))
    }, [sessionCode])

    return {
        liveStudentIds,
        teacherFocus,
        raisedHandOrder,
        handleToggleFocusAssignment,
        handleToggleFocusSlide,
        handleLowerHand
    }
}