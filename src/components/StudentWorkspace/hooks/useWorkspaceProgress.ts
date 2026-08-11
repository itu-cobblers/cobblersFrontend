import { useState, useMemo, useEffect } from 'react'
import type { Assignment, AssignmentSet, SubmissionHistoryItem, AssignmentKind, TeacherFocus } from '@types'
import type { ProblemsListTab, AssignmentPanelTab, ProblemStatus } from '@components'
import { useAssignments } from '@hooks/useAssignments'
import { getProjectIdentity } from '@lib/projectIdentity'
import { getPersistedWorkspaceUI, setPersistedWorkspaceUI } from '@lib/studentWorkspaceUI'

interface ProgressOptions {
    assignmentSet: AssignmentSet
    submissionHistory: SubmissionHistoryItem[]
    teacherFocus: TeacherFocus
    getAssignment: (id: number) => Assignment | undefined
    /** Current room's code, if any — scopes the "Session" tab's statuses to this room only. */
    sessionCode?: string
    /** Switches to Slides and opens this page — powers the slide-focus follow banner. */
    onNavigateToSlide: (slideId: number) => void
    /** Set by a slide's "Try this now" link — takes priority over the persisted selection at mount, so a fresh `StudentWorkspace` opens on this assignment instead of flashing whatever was last cached. */
    pendingAssignmentId?: number | null
}

/**
 * `items` arrives newest-first (per CONTRACT.md), so the first time an
 * assignmentId is seen here is its most recent attempt — `erroredLatest`
 * tracks that without a second sort pass.
 */
function collectStatusSets(items: SubmissionHistoryItem[], getAssignment: (id: number) => Assignment | undefined) {
    const attempted = new Set<number>()
    const passed = new Set<number>()
    const erroredLatest = new Set<number>()
    const seenLatest = new Set<number>()

    items.forEach(item => {
        attempted.add(item.assignmentId)
        const assignment = getAssignment(item.assignmentId)
        if (assignment?.kind === 'project' || item.status === 'passed') {
            passed.add(item.assignmentId)
        }
        if (!seenLatest.has(item.assignmentId)) {
            seenLatest.add(item.assignmentId)
            if (item.status === 'error') erroredLatest.add(item.assignmentId)
        }
    })
    return { attempted, passed, erroredLatest }
}

export function useWorkspaceProgress({
    assignmentSet,
    submissionHistory,
    teacherFocus,
    getAssignment,
    sessionCode,
    onNavigateToSlide,
    pendingAssignmentId
}: ProgressOptions) {
    // Read once — only the value on first render matters, since every state
    // below seeds itself from this via a lazy initializer.
    const persistedUI = getPersistedWorkspaceUI()

    // A pending "Try this now" target always wins over the persisted tab/selection —
    // this component mounts fresh on that navigation, so without this override the
    // first render (and the `session` rail) would show the last-cached assignment
    // until the pending-id effect below caught up a tick later.
    const initialRailTab: ProblemsListTab = pendingAssignmentId != null ? 'session' : (persistedUI?.railTab ?? 'session')

    const [isRailOpen, setIsRailOpen] = useState(persistedUI?.isRailOpen ?? true)
    const [railTab, setRailTab] = useState<ProblemsListTab>(initialRailTab)
    const [panelTab, setPanelTab] = useState<AssignmentPanelTab>('description')
    const [selectionSource, setSelectionSource] = useState<ProblemsListTab>(initialRailTab)

    const [historySelectedId, setHistorySelectedId] = useState<number | null>(
        persistedUI?.railTab === 'history' ? (persistedUI.selectedAssignmentId ?? null) : null
    )

    const latestHistoryAssignmentId = submissionHistory[0]?.assignmentId

    // Global — every room the student has ever submitted in. Feeds the History tab only.
    const { attemptedIds, passedIds, erroredIds } = useMemo(
        () => {
            const { attempted, passed, erroredLatest } = collectStatusSets(submissionHistory, getAssignment)
            return { attemptedIds: attempted, passedIds: passed, erroredIds: erroredLatest }
        },
        [submissionHistory, getAssignment]
    )

    // Scoped to the current room — feeds the Session tab, so a pass in another room/day
    // doesn't leak into today's status. Solo (no `sessionCode`) matches un-roomed submissions.
    const { attemptedIds: sessionAttemptedIds, passedIds: sessionPassedIds, erroredIds: sessionErroredIds } = useMemo(
        () => {
            const sessionOnly = submissionHistory.filter((item) =>
                sessionCode ? item.sessionId === sessionCode : !item.sessionId
            )
            const { attempted, passed, erroredLatest } = collectStatusSets(sessionOnly, getAssignment)
            return { attemptedIds: attempted, passedIds: passed, erroredIds: erroredLatest }
        },
        [submissionHistory, getAssignment, sessionCode]
    )

    const initialSessionIndex = pendingAssignmentId != null
        ? assignmentSet.assignments.findIndex((a) => a.id === pendingAssignmentId)
        : persistedUI?.railTab === 'session' && persistedUI.selectedAssignmentId != null
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

    const getStatus = (id: number, attempted: Set<number>, passed: Set<number>, errored: Set<number>): ProblemStatus => {
        if (passed.has(id) || assignmentProgress.completedAssignments.has(id)) {
            return 'passed'
        }
        if (errored.has(id)) {
            return 'error'
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
        status: getStatus(a.id, sessionAttemptedIds, sessionPassedIds, sessionErroredIds),
    }))

    const historyProblems = useMemo(() => {
        return Array.from(attemptedIds).map(id => {
            const assignment = getAssignment(id)
            if (!assignment) return null
            return {
                id: assignment.id,
                title: assignment.title,
                kind: assignment.kind,
                status: getStatus(id, attemptedIds, passedIds, erroredIds)
            }
        }).filter(Boolean) as { id: number, title: string, kind: AssignmentKind, status: ProblemStatus }[]
    }, [attemptedIds, getAssignment, passedIds, erroredIds, assignmentProgress.completedAssignments])

    const focusedAssignmentId = teacherFocus?.kind === 'assignment' ? teacherFocus.id : null
    const teacherFocusedAssignment = focusedAssignmentId != null
        ? assignmentSet.assignments.find((a) => a.id === focusedAssignmentId)
        : undefined

    // Practice tab always surfaces the teacher's focus, whichever kind it is —
    // an assignment (unless it's the one already open) or a Slides page.
    const followBannerProps = teacherFocusedAssignment && teacherFocusedAssignment.id !== activeAssignment?.id
        ? {
            label: `#${teacherFocusedAssignment.id} · ${teacherFocusedAssignment.title}`,
            onFollow: () => handleSelectAssignment(teacherFocusedAssignment.id, 'session'),
        }
        : teacherFocus?.kind === 'slide'
            ? {
                label: `Slide · Page ${teacherFocus.id}`,
                onFollow: () => onNavigateToSlide(teacherFocus.id),
            }
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
            teacherFocusId: focusedAssignmentId,
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

        followBannerProps
    }
}