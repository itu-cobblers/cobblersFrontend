import { useState, useEffect, useMemo } from 'react'
import { fetchAssignmentSets, fetchAssignmentSet, type AssignmentSetSummary } from '@/api/assignmentSetApi.ts'
import type { Assignment } from '@types'

export function useAssignmentData() {
    const [assignmentSets, setAssignmentSets] = useState<AssignmentSetSummary[]>([])
    const [selectedAssignmentSetId, setSelectedAssignmentSetId] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [previewAssignments, setPreviewAssignments] = useState<
        Pick<Assignment, 'id' | 'title' | 'kind' | 'description' | 'hint'>[]
    >([])

    useEffect(() => {
        fetchAssignmentSets()
            .then((sets) => {
                setAssignmentSets(sets)
                setSelectedAssignmentSetId((current) => current || (sets[0]?.assignmentSetId ?? ''))
            })
            .catch((err) => console.warn('[teacher] fetchAssignmentSets failed:', err))
    }, [])

    useEffect(() => {
        if (!selectedAssignmentSetId) return
        let cancelled = false
        fetchAssignmentSet(selectedAssignmentSetId)
            .then((assignmentSet) => {
                if (cancelled) return
                setPreviewTitle(assignmentSet.displayTitle)
                setAssignments(assignmentSet.assignments)
                setPreviewAssignments(
                    assignmentSet.assignments.map((assignment) => ({
                        id: assignment.id,
                        title: assignment.title,
                        kind: assignment.kind,
                        description: assignment.description,
                        hint: assignment.hint,
                    }))
                )
            })
            .catch((err) => console.warn('[teacher] fetchAssignmentSet failed:', err))
        return () => { cancelled = true }
    }, [selectedAssignmentSetId])

    const previewCount = useMemo(() =>
            previewAssignments.length || 1
        , [previewAssignments])

    const previewAssignmentIds = useMemo(() =>
            previewAssignments.flatMap((item) => item.id)
        , [previewAssignments])

    return {
        assignmentSets,
        selectedAssignmentSetId,
        setSelectedAssignmentSetId,
        previewAssignments,
        previewTitle,
        assignments,
        previewCount,
        previewAssignmentIds
    }
}