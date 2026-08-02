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
                                        liveStudentIds
                                    }: UseTeacherSelectionProps) {
    const [selectedAssignmentIdRaw, setSelectedAssignmentIdRaw] = useState<number | null>(null)
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
            const subsForAssignment = allSubmissions.filter(s => s.assignmentId === assignment.id);

            const passedStudentIds = new Set(
                subsForAssignment.filter(s => s.passed === true).map(s => s.studentId)
            );

            let studentStatus: ProblemStatus | undefined = undefined;
            if (selectedStudentId) {
                const studentSubs = subsForAssignment.filter(s => s.studentId === selectedStudentId);
                studentStatus = getStudentAssignmentStatus(studentSubs);
            }

            return {
                id: assignment.id,
                title: assignment.title,
                kind: assignment.kind,
                totalNum: attendanceList.length,
                passedNum: passedStudentIds.size,
                studentStatus
            }
        })
    }, [assignments, allSubmissions, attendanceList.length, selectedStudentId]);

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

        handleSelectAssignment: handleSelectAssignmentAndReset,
        handleSelectStudent,
        handleClearStudentFilter
    }
}