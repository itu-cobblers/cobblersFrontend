import { useState, useEffect, useMemo } from 'react'
import { fetchAssignmentSets, fetchAssignmentSet, type AssignmentSetSummary } from '@lib/assignmentSetApi.ts'
import { groupAssignments } from '@lib/assignmentSet.ts'
import type { Assignment } from '@types'
import type { AssignmentSetPreviewGroup } from '@components'

export function useAssignmentData() {
    const [assignmentSets, setAssignmentSets] = useState<AssignmentSetSummary[]>([])
    const [selectedAssignmentSetId, setSelectedAssignmentSetId] = useState('')
    const [previewGroups, setPreviewGroups] = useState<AssignmentSetPreviewGroup[]>([])
    const [previewTitle, setPreviewTitle] = useState('')
    const [assignments, setAssignments] = useState<Assignment[]>([])

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
                setPreviewGroups(
                    groupAssignments(assignmentSet.assignments, 'Assignments').map((group) => ({
                        label: group.label,
                        items: group.items.map((a) => ({
                            id: a.id, title: a.title, kind: a.kind, description: a.description, hint: a.hint,
                        })),
                    }))
                )
            })
            .catch((err) => console.warn('[teacher] fetchAssignmentSet failed:', err))
        return () => { cancelled = true }
    }, [selectedAssignmentSetId])

    const previewCount = useMemo(() =>
            previewGroups.reduce((sum, group) => sum + group.items.length, 0) || 1
        , [previewGroups])

    const previewAssignmentIds = useMemo(() =>
            previewGroups.flatMap((group) => group.items.map((item) => item.id))
        , [previewGroups])

    return {
        assignmentSets,
        selectedAssignmentSetId,
        setSelectedAssignmentSetId,
        previewGroups,
        previewTitle,
        assignments,
        previewCount,
        previewAssignmentIds
    }
}