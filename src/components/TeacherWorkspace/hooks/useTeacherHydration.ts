import { useState, useEffect, useCallback } from 'react'
import type { AttendanceStudentDto, SessionSubmissionDto, StudentDto } from '@types'
import { fetchSessionAttendance, fetchSessionSubmissions } from "@/api/sessionApi.ts";

export function useTeacherHydration(sessionCode: string | null) {
    const [attendanceList, setAttendanceList] = useState<AttendanceStudentDto[]>([])
    const [allSubmissions, setAllSubmissions] = useState<SessionSubmissionDto[]>([])

    const [isFetching, setIsFetching] = useState<boolean>(!!sessionCode)
    const isHydrating = !!sessionCode && isFetching;

    useEffect(() => {
        if (!sessionCode) return;

        let isMounted = true;
        const performHydration = async () => {
            setIsFetching(true);
            try {
                const [attendance, submissions] = await Promise.all([
                    fetchSessionAttendance(sessionCode),
                    fetchSessionSubmissions(sessionCode)
                ])
                if (!isMounted) return

                setAttendanceList(attendance)
                setAllSubmissions(submissions)
            } finally {
                if (isMounted) setIsFetching(false);
            }
        };

        performHydration();
        return () => { isMounted = false; };
    }, [sessionCode]);

    const addSubmission = useCallback((newSub: SessionSubmissionDto) => {
        setAllSubmissions(prev => [newSub, ...prev])
    }, [])

    const mergeLiveStudents = useCallback((students: StudentDto[]) => {
        setAttendanceList(prev => {
            const seen = new Set(prev.map((s) => s.studentId))
            const additions = students.filter((s) => !seen.has(s.studentId))
            return additions.length > 0 ? [...prev, ...additions] : prev
        })
    }, [])

    return {
        attendanceList,
        allSubmissions,
        isHydrating,
        addSubmission,
        mergeLiveStudents
    }
}