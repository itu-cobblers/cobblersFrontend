import { useState, useMemo, useEffect } from 'react'
import type { Assignment, AssignmentSet, SubmissionHistoryItem, AssignmentKind } from '@types'
import type { ProblemsListTab, AssignmentPanelTab, ProblemStatus } from '@components'
import { useAssignments } from '@hooks/useAssignments'
import { getProjectIdentity } from '@lib/projectIdentity'
import { getPersistedWorkspaceUI, setPersistedWorkspaceUI } from '@lib/studentWorkspaceUI'

interface ProgressOptions {
    assignmentSet: AssignmentSet
    submissionHistory: SubmissionHistoryItem[]
    teacherFocusedAssignmentId: number | null
    getAssignment: (id: number) => Assignment | undefined
    /** Current room's code, if any — scopes the "Session" tab's statuses to this room only. */
    sessionCode?: string
}

function collectStatusSets(items: SubmissionHistoryItem[], getAssignment: (id: number) => Assignment | undefined) {
    const attempted = new Set<number>()
    const passed = new Set<number>()

    items.forEach(item => {
        attempted.add(item.assignmentId)
        const assignment = getAssignment(item.assignmentId)
        if (assignment?.kind === 'project' || item.passed === true) {
            passed.add(item.assignmentId)
        }
    })
    return { attempted, passed }
}

export function useWorkspaceProgress({
    assignmentSet,
    submissionHistory,
    teacherFocusedAssignmentId,
    getAssignment,
    sessionCode
}: ProgressOptions) {
    // Read once — only the value on first render matters, since every state
    // below seeds itself from this via a lazy initializer.
    const persistedUI = getPersistedWorkspaceUI()

    const [isRailOpen, setIsRailOpen] = useState(persistedUI?.isRailOpen ?? true)
    const [railTab, setRailTab] = useState<ProblemsListTab>(persistedUI?.railTab ?? 'session')
    const [panelTab, setPanelTab] = useState<AssignmentPanelTab>('description')
    const [selectionSource, setSelectionSource] = useState<ProblemsListTab>(persistedUI?.railTab ?? 'session')

    const [historySelectedId, setHistorySelectedId] = useState<number | null>(
        persistedUI?.railTab === 'history' ? persistedUI.selectedAssignmentId : null
    )

    const latestHistoryAssignmentId = submissionHistory[0]?.assignmentId

    // Global — every room the student has ever submitted in. Feeds the History tab only.
    const { attemptedIds, passedIds } = useMemo(
        () => {
            const { attempted, passed } = collectStatusSets(submissionHistory, getAssignment)
            return { attemptedIds: attempted, passedIds: passed }
        },
        [submissionHistory, getAssignment]
    )

    // Scoped to the current room — feeds the Session tab, so a pass in another room/day
    // doesn't leak into today's status. Solo (no `sessionCode`) matches un-roomed submissions.
    const { attemptedIds: sessionAttemptedIds, passedIds: sessionPassedIds } = useMemo(
        () => {
            const sessionOnly = submissionHistory.filter((item) =>
                sessionCode ? item.sessionId === sessionCode : !item.sessionId
            )
            const { attempted, passed } = collectStatusSets(sessionOnly, getAssignment)
            return { attemptedIds: attempted, passedIds: passed }
        },
        [submissionHistory, getAssignment, sessionCode]
    )

    const initialSessionIndex = persistedUI?.railTab === 'session' && persistedUI.selectedAssignmentId != null
        ? assignmentSet.assignments.findIndex((a) => a.id === persistedUI.selectedAssignmentId)
        : -1
    const assignmentProgress = useAssignments(
        assignmentSet.assignments,
        Array.from(sessionPassedIds),
        initialSessionIndex >= 0 ? initialSessionIndex : 0
    )
    const defaultSessionAssignment = assignmentSet.assignments[0]

    const activeAssignment = useMemo(() => {
        if (selectionSource === 'history') {
            const targetId = historySelectedId ?? latestHistoryAssignmentId
            if (targetId != null) {
                const historyItem = getAssignment(targetId)
                if (historyItem) return historyItem
            }
            return defaultSessionAssignment
        }

        return assignmentSet.assignments[assignmentProgress.activeAssignment] ?? defaultSessionAssignment
    }, [
        selectionSource,
        historySelectedId,
        latestHistoryAssignmentId,
        getAssignment,
        assignmentSet.assignments,
        assignmentProgress.activeAssignment,
        defaultSessionAssignment
    ])

    useEffect(() => {
        setPersistedWorkspaceUI({
            isRailOpen,
            railTab,
            selectedAssignmentId: activeAssignment?.id ?? null,
        })
    }, [isRailOpen, railTab, activeAssignment?.id])

    const handleRailTabChange = (newTab: ProblemsListTab) => {
        setRailTab(newTab)
        setSelectionSource(newTab)
        setPanelTab('description')

        if (newTab === 'history') {
            setHistorySelectedId(prev => prev ?? latestHistoryAssignmentId ?? null)
        }
    }

    const handleSelectAssignment = (id: number, source: ProblemsListTab = 'session') => {
        setPanelTab('description')
        setSelectionSource(source)
        if (source === 'session') {
            const index = assignmentSet.assignments.findIndex((a) => a.id === id)
            if (index !== -1) {
                assignmentProgress.setActiveAssignment(index)
            }
        } else {
            setHistorySelectedId(id)
        }
    }

    const getStatus = (id: number, attempted: Set<number>, passed: Set<number>): ProblemStatus => {
        if (passed.has(id) || assignmentProgress.completedAssignments.has(id)) {
            return 'passed'
        }
        if (attempted.has(id)) {
            return 'tried'
        }
        return 'untried'
    }

    const sessionProblems = assignmentSet.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        kind: a.kind,
        status: getStatus(a.id, sessionAttemptedIds, sessionPassedIds),
    }))

    const historyProblems = useMemo(() => {
        return Array.from(attemptedIds).map(id => {
            const assignment = getAssignment(id)
            if (!assignment) return null
            return {
                id: assignment.id,
                title: assignment.title,
                kind: assignment.kind,
                status: getStatus(id, attemptedIds, passedIds)
            }
        }).filter(Boolean) as { id: number, title: string, kind: AssignmentKind, status: ProblemStatus }[]
    }, [attemptedIds, getAssignment, passedIds, assignmentProgress.completedAssignments])

    const teacherFocused = teacherFocusedAssignmentId != null
        ? assignmentSet.assignments.find((a) => a.id === teacherFocusedAssignmentId)
        : undefined

    return {
        activeAssignment: activeAssignment!,
        assignmentProgress,
        effectiveSessionCode: selectionSource === 'history' ? undefined : 'use_parent_session_code',

        problemsListProps: {
            activeTab: railTab,
            onTabChange: handleRailTabChange,
            sessionItems: sessionProblems,
            historyItems: historyProblems,
            activeId: activeAssignment?.id,
            onSelect: (id: number) => handleSelectAssignment(id, railTab),
            teacherFocusId: teacherFocusedAssignmentId,
            isOpen: isRailOpen,
            onToggleOpen: () => setIsRailOpen((prev) => !prev),
        },

        assignmentPanelProps: {
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