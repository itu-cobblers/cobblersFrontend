import { useState, useCallback } from 'react'
import { fetchAssignmentSolution } from '@/api/submissionApi'
import type { SolutionResponseDto } from '@types'

export function useTeacherSolution(activeAssignmentId: number | null) {
    const [solutionCache, setSolutionCache] = useState<Record<number, SolutionResponseDto['solution']>>({})
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const [isSolutionVisibleMap, setIsSolutionVisibleMap] = useState<Record<number, boolean>>({})
    const [isAnswerVisibleMap, setIsAnswerVisibleMap] = useState<Record<number, boolean>>({})

    const handleToggleSolution = useCallback(async () => {
        if (activeAssignmentId === null) return

        if (isSolutionVisibleMap[activeAssignmentId]) {
            setIsSolutionVisibleMap(prev => ({ ...prev, [activeAssignmentId]: false }))
            return
        }

        if (solutionCache[activeAssignmentId] === undefined) {
            setLoadingId(activeAssignmentId)
            try {
                const result = await fetchAssignmentSolution(activeAssignmentId)
                setSolutionCache(prev => ({ ...prev, [activeAssignmentId]: result.solution }))
            } catch (error) {
                console.error("[Teacher] Failed to fetch solution:", error)
            } finally {
                setLoadingId(null)
            }
        }

        setIsSolutionVisibleMap(prev => ({ ...prev, [activeAssignmentId]: true }))
    }, [activeAssignmentId, isSolutionVisibleMap, solutionCache])

    const handleToggleAnswer = useCallback(() => {
        if (activeAssignmentId === null) return
        setIsAnswerVisibleMap(prev => ({ ...prev, [activeAssignmentId]: !prev[activeAssignmentId] }))
    }, [activeAssignmentId])

    return {
        solutionData: activeAssignmentId ? solutionCache[activeAssignmentId] ?? null : null,
        isLoadingSolution: loadingId === activeAssignmentId,
        isSolutionVisible: activeAssignmentId ? !!isSolutionVisibleMap[activeAssignmentId] : false,
        isAnswerVisible: activeAssignmentId ? !!isAnswerVisibleMap[activeAssignmentId] : false,
        handleToggleSolution,
        handleToggleAnswer
    }
}