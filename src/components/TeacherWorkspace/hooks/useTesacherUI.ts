import { useState } from 'react'
import { fetchAssignmentSolution } from '@lib/submissionApi'
import type { SourceFile } from '@types'

export function useTeacherUI(previewAssignmentIds: number[]) {
    const [selectedAssignmentIdRaw, setSelectedAssignmentIdRaw] = useState<number | null>(null)
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

    const selectedAssignmentId =
        selectedAssignmentIdRaw !== null && previewAssignmentIds.includes(selectedAssignmentIdRaw)
            ? selectedAssignmentIdRaw
            : previewAssignmentIds[0] ?? null

    const [solutionByAssignment, setSolutionByAssignment] = useState<Record<number, SourceFile[]>>({})
    const [loadingSolutionAssignmentId, setLoadingSolutionAssignmentId] = useState<number | null>(null)
    const [isSolutionVisibleByAssignment, setIsSolutionVisibleByAssignment] = useState<Record<number, boolean>>({})
    const [isAnswerVisibleByAssignment, setIsAnswerVisibleByAssignment] = useState<Record<number, boolean>>({})

    async function handleToggleSolution(assignmentId: number) {
        if (isSolutionVisibleByAssignment[assignmentId]) {
            setIsSolutionVisibleByAssignment((prev) => ({ ...prev, [assignmentId]: false }))
            return
        }
        if (!solutionByAssignment[assignmentId]) {
            setLoadingSolutionAssignmentId(assignmentId)
            try {
                const result = await fetchAssignmentSolution(assignmentId)
                if (Array.isArray(result.solution)) {
                    setSolutionByAssignment((prev) => ({ ...prev, [assignmentId]: result.solution as SourceFile[] }))
                }
            } finally {
                setLoadingSolutionAssignmentId((current) => (current === assignmentId ? null : current))
            }
        }
        setIsSolutionVisibleByAssignment((prev) => ({ ...prev, [assignmentId]: true }))
    }

    return {
        selectedAssignmentId,
        selectedStudentId,
        handleSelectAssignment: setSelectedAssignmentIdRaw,
        handleSelectStudent: (id: string | null) => setSelectedStudentId((prev) => (prev === id ? null : id)),
        handleClearStudentFilter: () => setSelectedStudentId(null),
        solutionByAssignment,
        loadingSolutionAssignmentId,
        isSolutionVisibleByAssignment,
        isAnswerVisibleByAssignment,
        handleToggleSolution,
        handleToggleAnswer: (id: number) => setIsAnswerVisibleByAssignment((p) => ({ ...p, [id]: !p[id] })),
    }
}