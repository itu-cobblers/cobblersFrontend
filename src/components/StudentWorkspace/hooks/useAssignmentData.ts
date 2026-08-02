import {useCallback, useEffect, useState} from 'react'
import type {Assignment, AssignmentSet, SourceFile, SubmissionHistoryItem} from '@types'
import { fetchAssignmentSolution } from '@lib/submissionApi'
import {fetchAssignmentsByIds} from "@lib/assignmentSetApi.ts";

function normalizeSolution(solution: string | SourceFile[] | null): SourceFile[] | null {
    if (solution == null) return null
    if (typeof solution === 'string') return [{ name: 'Main.java', content: solution }]
    return solution
}

export function useAssignmentData(
    assignmentSet: AssignmentSet,
    history: SubmissionHistoryItem[]
) {
    const [cache, setCache] = useState<Record<number, Assignment>>({})

    const [solutions, setSolutions] = useState<Record<number, SourceFile[]>>({})
    const [isSolutionVisible, setIsSolutionVisible] = useState<Record<number, boolean>>({})
    const [loadingId, setLoadingId] = useState<number | null>(null)

    useEffect(() => {
        if (history.length === 0) return

        const historyIds = Array.from(new Set(history.map(h => h.assignmentId)))
        const currentSetIds = new Set(assignmentSet.assignments.map(a => a.id))
        const missingIds = historyIds.filter(id => !currentSetIds.has(id) && !cache[id])

        if (missingIds.length > 0) {
            fetchAssignmentsByIds(missingIds, true)
                .then(fetchedAssignments => {
                    setCache(prev => {
                        const next = { ...prev }
                        fetchedAssignments.forEach(a => {
                            next[a.id] = a
                        })
                        return next
                    })
                })
                .catch(err => console.error('Failed to bulk fetch history assignments', err))
        }
    }, [history, assignmentSet, cache])

    const getAssignment = useCallback((id: number): Assignment | undefined => {
        const inCurrentSet = assignmentSet.assignments.find(a => a.id === id)
        return inCurrentSet || cache[id]
    }, [assignmentSet, cache])

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
                const cachedAssignment = cache[assignmentId]
                if (cachedAssignment && cachedAssignment.solution) {
                    const normalized = normalizeSolution(cachedAssignment.solution)
                    if (normalized) {
                        setSolutions((prev) => ({ ...prev, [assignmentId]: normalized }))
                    }
                } else {
                    const result = await fetchAssignmentSolution(assignmentId)
                    const normalized = normalizeSolution(result.solution)
                    if (normalized) {
                        setSolutions((prev) => ({ ...prev, [assignmentId]: normalized }))
                    }
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
        getAssignment,
        solutions,
        isSolutionVisible,
        loadingId,
        toggleSolution,
        hideSolution
    }
}