import { useState, useMemo } from 'react'
import type { Assignment, SourceFile } from '@types'
import type { CodeFileTab } from '@components'
import { projectUploadStarter, defaultStarter } from '@lib/defaultStarter'

interface ModeOptions {
    activeAssignment: Assignment
    drafts: ReturnType<typeof import('./useLocalDrafts').useLocalDrafts>
    solutions: ReturnType<typeof import('./useAssignmentSolutions').useAssignmentSolutions>
    // TODO: update for history item
    // viewingHistoryItem?: SubmissionHistoryItem
}

export function useWorkspaceMode({ activeAssignment, drafts, solutions }: ModeOptions) {
    const assignmentId = activeAssignment.id

    const [activeStudentIndexByAssignment, setActiveStudentIndexByAssignment] = useState<Record<number, number>>({})
    const [activeSolutionIndexByAssignment, setActiveSolutionIndexByAssignment] = useState<Record<number, number>>({})

    const isVisible = solutions.isSolutionVisible[assignmentId] ?? false
    const solutionFiles = solutions.solutions[assignmentId]

    const studentFiles: SourceFile[] = useMemo(() => {
        if (activeAssignment.kind === 'project') return drafts.state.project[assignmentId] ?? []
        if (activeAssignment.kind === 'code') {
            if (activeAssignment.starterFiles) return drafts.state.multiFiles[assignmentId] ?? []
            return [{ name: 'Main.java', content: drafts.state.code[assignmentId] ?? defaultStarter }]
        }
        return []
    }, [activeAssignment, drafts.state, assignmentId])

    const rawStudentIndex = activeStudentIndexByAssignment[assignmentId] ?? 0
    const rawSolutionIndex = activeSolutionIndexByAssignment[assignmentId] ?? 0
    const safeStudentIndex = rawStudentIndex < studentFiles.length ? rawStudentIndex : 0
    const safeSolutionIndex = solutionFiles && rawSolutionIndex < solutionFiles.length ? rawSolutionIndex : 0

    const tabFiles: CodeFileTab[] = useMemo(() => {
        if (isVisible && solutionFiles) {
            return solutionFiles.map(f => ({ name: f.name, variant: 'solution' as const }))
        }
        return studentFiles.length > 0 ? studentFiles.map(f => ({ name: f.name })) : [{ name: 'Main.java' }]
    }, [studentFiles, isVisible, solutionFiles])

    const activeTabIndex = isVisible ? safeSolutionIndex : safeStudentIndex

    const handleSelectFile = (index: number) => {
        if (isVisible) {
            setActiveSolutionIndexByAssignment(prev => ({ ...prev, [assignmentId]: index }))
        } else {
            setActiveStudentIndexByAssignment(prev => ({ ...prev, [assignmentId]: index }))
        }
    }

    const handleEditorChange = (value: string) => {
        if (isVisible) return // 唯讀模式不准修改
        if (activeAssignment.kind === 'project') drafts.updateProjectFile(assignmentId, safeStudentIndex, value)
        else if (activeAssignment.kind === 'code' && activeAssignment.starterFiles) drafts.updateMultiFile(assignmentId, safeStudentIndex, value)
        else drafts.updateCode(assignmentId, value)
    }

    const activeContent = isVisible
        ? (solutionFiles?.[safeSolutionIndex]?.content ?? '')
        : (studentFiles[safeStudentIndex]?.content ?? projectUploadStarter)

    const modeString = isVisible ? 'solution' : 'student'
    const currentFile = isVisible ? solutionFiles?.[safeSolutionIndex] : studentFiles[safeStudentIndex]
    const currentFileName = currentFile?.name ?? 'Main.java'
    const currentIndex = isVisible ? safeSolutionIndex : safeStudentIndex

    let viewStatusLabel = undefined
    if (isVisible) {
        viewStatusLabel = "Viewing reference solution"
    }
    // else if (viewingHistoryItem) {
    //    const dateStr = new Date(viewingHistoryItem.submittedAt).toLocaleString()
    //    viewStatusLabel = `Viewing submission from ${dateStr}`
    // }

    return {
        tabFiles,
        activeTabIndex,
        handleSelectFile,
        editorValue: activeContent,
        editorPath: `assignment-${assignmentId}-${modeString}-${currentIndex}-${currentFileName}`,
        isReadOnly: isVisible || (activeAssignment.kind === 'project' && studentFiles.length === 0),
        handleEditorChange,
        currentContent: activeContent,
        currentStudentFiles: studentFiles,

        viewStatusLabel,
        onExitView: () => solutions.hideSolution(assignmentId)
    }
}