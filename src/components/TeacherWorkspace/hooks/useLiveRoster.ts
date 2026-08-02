import { useState, useEffect, useCallback } from 'react'
import { observeSession, focusAssignment } from '@/api/sessionHub.ts'
import type { RosterEntry } from '@components'
import type {Student} from "@types";

export function useLiveRoster(sessionCode: string | null, previewCount: number) {
    const [students, setStudents] = useState<RosterEntry[]>([])
    const [focusedAssignmentId, setFocusedAssignmentId] = useState<number | null>(null)

    const mergeLiveRoster = useCallback((roster: Student[]) => {
        setStudents((prev) => {
            const next = [...prev]
            for (const student of roster) {
                if (next.some((s) => s.studentId === student.studentId)) continue
                next.push({
                    studentId: student.studentId,
                    displayName: student.displayName,
                    completed: 0,
                    total: previewCount,
                    currentTitle: 'Just joined',
                    status: 'working',
                })
            }
            return next
        })
    }, [previewCount])

    useEffect(() => {
        if (!sessionCode) return

        let cancelled = false

        observeSession(sessionCode, {
            onRoster: (roster) => !cancelled && mergeLiveRoster(roster),
            onStudentJoined: (student) => !cancelled && mergeLiveRoster([student]),
        }).catch((err) => console.warn('[room] observe failed:', err))

        return () => {
            cancelled = true
        }
    }, [sessionCode, mergeLiveRoster])

    function handleFocusAssignment(id: number) {
        if (!sessionCode) return
        setFocusedAssignmentId(id)
        focusAssignment(sessionCode, id).catch((err) => console.warn('[room] focusAssignment failed:', err))
    }

    const clearRoster = useCallback(() => {
        setStudents([])
        setFocusedAssignmentId(null)
    }, [])

    return { students, focusedAssignmentId, handleFocusAssignment, clearRoster }
}