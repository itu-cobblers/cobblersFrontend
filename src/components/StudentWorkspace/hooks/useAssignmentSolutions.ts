import { useState } from 'react'
import type { SourceFile } from '@types'
import { fetchAssignmentSolution } from '@lib/submissionApi'

function normalizeSolution(solution: string | SourceFile[] | null | undefined): SourceFile[] | null {
    if (solution == null) return null
    if (typeof solution === 'string') return [{ name: 'Main.java', content: solution }]
    return solution
}

export function useAssignmentSolutions() {
    const [solutions, setSolutions] = useState<Record<number, SourceFile[]>>({})
    const [isSolutionVisible, setIsSolutionVisible] = useState<Record<number, boolean>>({})
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const toggleSolution = async (assignmentId: number, kind: string) => {
        if (isSolutionVisible[assignmentId]) {
            setIsSolutionVisible((prev) => ({ ...prev, [assignmentId]: false }))
            return
        }

        if (kind === 'predict') {
            setIsSolutionVisible((prev) => ({ ...prev, [assignmentId]: true }))
            return
        }

        if (!solutions[assignmentId]) {
            setLoadingId(assignmentId)
            try {
                const result = await fetchAssignmentSolution(assignmentId)
                const normalized = normalizeSolution(result.solution)
                if (normalized) {
                    setSolutions((prev) => ({ ...prev, [assignmentId]: normalized }))
                }
            } finally {
                setLoadingId((current) => (current === assignmentId ? null : current))
            }
        }

        setIsSolutionVisible((prev) => ({ ...prev, [assignmentId]: true }))
    }

    const hideSolution = (assignmentId: number) => {
        setIsSolutionVisible((prev) => ({ ...prev, [assignmentId]: false }))
    }

    return {
        solutions,
        isSolutionVisible,
        loadingId,
        toggleSolution,
        hideSolution
    }
}