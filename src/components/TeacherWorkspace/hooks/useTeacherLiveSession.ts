import { useState, useEffect, useCallback } from 'react'
import type { StudentDto, SessionSubmissionDto } from '@types'
import {focusAssignment, observeSession} from "@/api/sessionHub.ts";

interface UseTeacherLiveSessionProps {
    sessionCode: string | null
    onSubmissionRecorded: (submission: SessionSubmissionDto) => void
}

export function useTeacherLiveSession({ sessionCode, onSubmissionRecorded }: UseTeacherLiveSessionProps) {
    const [liveStudentIds, setLiveStudentIds] = useState<Set<string>>(new Set())
    const [focusedAssignmentId, setFocusedAssignmentId] = useState<number | null>(null)

    const handleRosterUpdate = useCallback((roster: StudentDto[]) => {
        setLiveStudentIds(new Set(roster.map(s => s.studentId)))
    }, [])

    const handleStudentJoined = useCallback((student: StudentDto) => {
        setLiveStudentIds(prev => {
            const next = new Set(prev)
            next.add(student.studentId)
            return next
        })
    }, [])

    useEffect(() => {
        if (!sessionCode) return

        let cancelled = false

        observeSession(sessionCode, {
            onRoster: (roster) => !cancelled && handleRosterUpdate(roster),
            onStudentJoined: (student) => !cancelled && handleStudentJoined(student),
            onSubmissionRecorded: (sub) => !cancelled && onSubmissionRecorded(sub),
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

    return {
        liveStudentIds,
        focusedAssignmentId,
        handleFocusAssignment
    }
}