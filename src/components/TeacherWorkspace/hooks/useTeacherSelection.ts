import { useState, useCallback, useMemo } from 'react'
import type { Assignment, AttendanceStudentDto, SessionSubmissionDto } from '@types'
import type {
    AssignmentPanelTab,
    AttendanceStudent,
    ProblemStatus,
    TeacherProblemItem,
    TeacherSubmissionItem
} from '@components'

interface UseTeacherSelectionProps {
    assignments: Assignment[]
    attendanceList: AttendanceStudentDto[]
    allSubmissions: SessionSubmissionDto[]
    liveStudentIds: Set<string>
    /** Seeds the selected assignment (e.g. restoring a persisted selection after a refresh). */
    initialAssignmentId?: number | null
}

function getStudentAssignmentStatus(studentSubs: SessionSubmissionDto[]): ProblemStatus {
    if (studentSubs.length === 0) return 'untried';
    if (studentSubs.some(s => s.passed === true)) return 'passed';
    return 'tried';
}

export function useTeacherSelection({
                                        assignments,
                                        attendanceList,
                                        allSubmissions,
                                        liveStudentIds,
                                        initialAssignmentId = null
                                    }: UseTeacherSelectionProps) {
    const [selectedAssignmentIdRaw, setSelectedAssignmentIdRaw] = useState<number | null>(initialAssignmentId)
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

    const [activeTab, setActiveTab] = useState<AssignmentPanelTab>('description')
    const [activeSubId, setActiveSubId] = useState<string | null>(null)
    const [activeFileIndex, setActiveFileIndex] = useState(0)

    const selectedAssignmentId = useMemo(() => {
        const isValid = selectedAssignmentIdRaw !== null && assignments.some(a => a.id === selectedAssignmentIdRaw);
        return isValid ? selectedAssignmentIdRaw : (assignments[0]?.id ?? null);
    }, [selectedAssignmentIdRaw, assignments]);

    const activeAssignment = assignments.find(a => a.id === selectedAssignmentId)

    const problemItems: TeacherProblemItem[] = useMemo(() => {
        return assignments.map(assignment => {
            let status: ProblemStatus = 'untried';
            if (selectedStudentId) {
                const studentSubs = allSubmissions.filter(s => s.assignmentId === assignment.id && s.studentId === selectedStudentId);
                status = getStudentAssignmentStatus(studentSubs);
            }

            return {
                id: assignment.id,
                title: assignment.title,
                kind: assignment.kind,
                status
            }
        })
    }, [assignments, allSubmissions, selectedStudentId]);

    // Passed/tried/untried across every student who's ever joined, for the
    // currently-selected assignment only — shown in the panel once you click
    // into an assignment, not on every row in the rail.
    const assignmentBreakdown = useMemo(() => {
        if (selectedAssignmentId == null) return { passed: 0, tried: 0, untried: 0 }

        let passed = 0
        let tried = 0
        attendanceList.forEach(student => {
            const studentSubs = allSubmissions.filter(
                s => s.assignmentId === selectedAssignmentId && s.studentId === student.studentId
            )
            const status = getStudentAssignmentStatus(studentSubs)
            if (status === 'passed') passed++
            else if (status === 'tried') tried++
        })

        return { passed, tried, untried: attendanceList.length - passed - tried }
    }, [attendanceList, allSubmissions, selectedAssignmentId]);

    const attendanceStudents: AttendanceStudent[] = useMemo(() => {
        return attendanceList.map(student => {
            let assignmentStatus: ProblemStatus | undefined = undefined;

            if (selectedAssignmentId !== null) {
                const studentSubs = allSubmissions.filter(
                    s => s.studentId === student.studentId && s.assignmentId === selectedAssignmentId
                );
                assignmentStatus = getStudentAssignmentStatus(studentSubs);
            }

            return {
                studentId: student.studentId,
                displayName: student.displayName,
                isActive: liveStudentIds.has(student.studentId),
                assignmentStatus
            }
        })
    }, [attendanceList, allSubmissions, selectedAssignmentId, liveStudentIds]);

    const filteredSubmissions: TeacherSubmissionItem[] = useMemo(() => {
        if (!selectedAssignmentId) return [];

        return allSubmissions
            .filter(sub => sub.assignmentId === selectedAssignmentId)
            .filter(sub => selectedStudentId ? sub.studentId === selectedStudentId : true)
            .map(sub => {
                const studentName = attendanceList.find(s => s.studentId === sub.studentId)?.displayName ?? 'Unknown';
                const assignmentTitle = assignments.find(a => a.id === sub.assignmentId)?.title ?? '';

                return {
                    subId: sub.subId,
                    studentId: sub.studentId,
                    studentName,
                    assignmentId: sub.assignmentId,
                    assignmentTitle,
                    passed: sub.passed,
                    submittedAt: sub.submittedAt,
                }
            });
    }, [allSubmissions, selectedAssignmentId, selectedStudentId, attendanceList, assignments]);

    const handleSelectAssignmentAndReset = useCallback((id: number) => {
        setSelectedAssignmentIdRaw(id);
        setActiveFileIndex(0);
        setActiveSubId(null);
    }, []);

    const handleSelectStudent = useCallback((id: string | null) => {
        setSelectedStudentId(prev => (prev === id ? null : id));
        setActiveSubId(null);
    }, []);

    const handleClearStudentFilter = useCallback(() => {
        setSelectedStudentId(null);
        setActiveSubId(null);
    }, []);

    return {
        selectedAssignmentId,
        activeAssignment,
        selectedStudentId,
        activeTab,
        setActiveTab,
        activeSubId,
        setActiveSubId,
        activeFileIndex,
        setActiveFileIndex,

        problemItems,
        attendanceStudents,
        filteredSubmissions,
        assignmentBreakdown,

        handleSelectAssignment: handleSelectAssignmentAndReset,
        handleSelectStudent,
        handleClearStudentFilter
    }
}