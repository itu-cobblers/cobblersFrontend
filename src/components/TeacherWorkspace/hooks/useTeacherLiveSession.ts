import { useState, useEffect, useCallback } from 'react'
import type { StudentDto, SessionSubmissionDto } from '@types'
import {focusAssignment, lowerHand, observeSession} from "@/api/sessionHub.ts";

interface UseTeacherLiveSessionProps {
    sessionCode: string | null
    onSubmissionRecorded: (submission: SessionSubmissionDto) => void
    /** Fires with every student seen over the hub (roster snapshot or a single join) — folds names into the attendance list as they arrive. */
    onLiveStudents?: (students: StudentDto[]) => void
}

export function useTeacherLiveSession({ sessionCode, onSubmissionRecorded, onLiveStudents }: UseTeacherLiveSessionProps) {
    const [liveStudentIds, setLiveStudentIds] = useState<Set<string>>(new Set())
    const [focusedAssignmentId, setFocusedAssignmentId] = useState<number | null>(null)
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

    const handleFocusAssignment = useCallback((id: number) => {
        if (!sessionCode) return
        setFocusedAssignmentId(id)
        focusAssignment(sessionCode, id).catch((err) => console.warn('[room] focusAssignment failed:', err))
    }, [sessionCode])

    const handleLowerHand = useCallback((studentId: string) => {
        if (!sessionCode) return
        lowerHand(sessionCode, studentId).catch((err) => console.warn('[room] lowerHand failed:', err))
    }, [sessionCode])

    return {
        liveStudentIds,
        focusedAssignmentId,
        raisedHandOrder,
        handleFocusAssignment,
        handleLowerHand
    }
}