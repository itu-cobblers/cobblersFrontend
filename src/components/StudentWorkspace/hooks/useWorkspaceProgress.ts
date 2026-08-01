import { useState, useMemo } from 'react'
import type { Assignment, AssignmentSet, SubmissionHistoryItem } from '@types'
import type { ProblemsListTab, AssignmentPanelTab, ProblemStatus } from '@components'
import { useAssignments } from '@hooks/useAssignments'
import { getProjectIdentity } from '@lib/projectIdentity'

interface ProgressOptions {
    assignmentSet: AssignmentSet
    submissionHistory: SubmissionHistoryItem[]
    teacherFocusedAssignmentId: number | null
}

export function useWorkspaceProgress({ assignmentSet, submissionHistory, teacherFocusedAssignmentId }: ProgressOptions) {
    const [isRailOpen, setIsRailOpen] = useState(true)
    const [railTab, setRailTab] = useState<ProblemsListTab>('session')
    const [panelTab, setPanelTab] = useState<AssignmentPanelTab>('description')
    const [selectionSource, setSelectionSource] = useState<ProblemsListTab>('session')

    const { attemptedIds, passedIds } = useMemo(() => {
        const attempted = new Set<number>()
        const passed = new Set<number>()

        const assignmentMap = new Map(assignmentSet.assignments.map(a => [a.id, a]))

        submissionHistory.forEach(item => {
            attempted.add(item.assignmentId)
            const assignment = assignmentMap.get(item.assignmentId)
            if (assignment?.kind === 'project' || item.passed === true) {
                passed.add(item.assignmentId)
            }
        })
        return { attemptedIds: attempted, passedIds: passed }
    }, [submissionHistory, assignmentSet.assignments])

    const assignmentProgress = useAssignments(assignmentSet.assignments, Array.from(passedIds))
    const activeAssignment = assignmentSet.assignments[assignmentProgress.activeAssignment]

    const handleSelectAssignment = (id: number, source: ProblemsListTab = 'session') => {
        const index = assignmentSet.assignments.findIndex((a) => a.id === id)
        if (index === -1) return
        assignmentProgress.setActiveAssignment(index)
        setPanelTab('description')
        setSelectionSource(source)
    }

    const getStatus = (assignment: Assignment): ProblemStatus => {
        if (passedIds.has(assignment.id) || assignmentProgress.completedAssignments.has(assignment.id)) {
            return 'passed'
        }
        if (attemptedIds.has(assignment.id)) {
            return 'failed'
        }
        return 'untried'
    }

    const sessionProblems = assignmentSet.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        kind: a.kind,
        status: getStatus(a),
    }))

    const historyProblems = sessionProblems.filter(p => attemptedIds.has(p.id))

    const teacherFocused = teacherFocusedAssignmentId != null
        ? assignmentSet.assignments.find((a) => a.id === teacherFocusedAssignmentId)
        : undefined

    return {
        activeAssignment,
        assignmentProgress,
        effectiveSessionCode: selectionSource === 'history' ? undefined : 'use_parent_session_code',

        problemsListProps: {
            activeTab: railTab,
            onTabChange: setRailTab,
            sessionItems: sessionProblems,
            historyItems: historyProblems,
            activeId: activeAssignment?.id,
            onSelect: (id: number) => handleSelectAssignment(id, railTab),
            teacherFocusId: teacherFocusedAssignmentId,
            isOpen: isRailOpen,
            onToggleOpen: () => setIsRailOpen((prev) => !prev),
        },

        assignmentPanelProps: {
            steps: assignmentSet.assignments.map((a) => ({
                id: a.id,
                title: a.title,
                isActive: a.id === activeAssignment?.id,
                isDone: passedIds.has(a.id) || assignmentProgress.completedAssignments.has(a.id),
            })),
            onSelectStep: handleSelectAssignment,
            isStepperVisible: false,
            activeTab: panelTab,
            onTabChange: setPanelTab,
            submissions: submissionHistory
                .filter((item) => item.assignmentId === activeAssignment?.id)
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
            title: activeAssignment?.title,
            lesson: activeAssignment?.lesson,
            description: activeAssignment?.description,
            body: activeAssignment?.kind === 'project' ? activeAssignment.brief : undefined,
            projectIdentity: activeAssignment?.kind === 'project' ? getProjectIdentity(activeAssignment.title) : undefined,
            hint: activeAssignment?.hint,
        },

        followBannerProps: teacherFocused && teacherFocused.id !== activeAssignment?.id ? {
            assignmentId: teacherFocused.id,
            assignmentTitle: teacherFocused.title,
            onFollow: () => handleSelectAssignment(teacherFocused.id, 'session'),
        } : undefined
    }
}