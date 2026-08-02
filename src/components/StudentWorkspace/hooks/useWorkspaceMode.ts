import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react'
import type { Assignment, SourceFile, SubmissionDetails } from '@types'
import type { CodeFileTab } from '@components'
import { projectUploadStarter, defaultStarter } from '@lib/defaultStarter'

interface ModeOptions {
    activeAssignment: Assignment
    drafts: ReturnType<typeof import('./useLocalDrafts').useLocalDrafts>
    solutions: ReturnType<typeof import('./useAssignmentData.ts').useAssignmentData>
    viewingSubmission?: SubmissionDetails | null
    onExitHistoryView?: () => void
}

type WriteKind = 'none' | 'code' | 'multi' | 'project'

interface WriteGate {
    canWrite: boolean
    writeKind: WriteKind
    studentIndex: number
    assignmentId: number
    expectedFileName: string
}

function classNameFromJava(source: string): string | null {
    const match = /(?:public\s+)?class\s+(\w+)/.exec(source)
    return match?.[1] ?? null
}

export function useWorkspaceMode({ activeAssignment, drafts, solutions, viewingSubmission, onExitHistoryView }: ModeOptions) {
    const assignmentId = activeAssignment.id
    const hideSolutionRef = useRef(solutions.hideSolution)

    const writeGateRef = useRef<WriteGate>({
        canWrite: false,
        writeKind: 'none',
        studentIndex: 0,
        assignmentId,
        expectedFileName: 'Main.java',
    })

    const [activeStudentIndexByAssignment, setActiveStudentIndexByAssignment] = useState<Record<number, number>>({})
    const [activeSolutionIndexByAssignment, setActiveSolutionIndexByAssignment] = useState<Record<number, number>>({})

    const prevAssignmentIdRef = useRef(assignmentId)

    // Clear solution or history view when changing assignments
    useEffect(() => {
        const prev = prevAssignmentIdRef.current
        if (prev !== assignmentId) {
            hideSolutionRef.current(prev)
            if (onExitHistoryView) onExitHistoryView()
            prevAssignmentIdRef.current = assignmentId
        }
    }, [assignmentId, onExitHistoryView])

    const isVisible = solutions.isSolutionVisible[assignmentId] ?? false
    const isHistoryView = !!viewingSubmission
    const solutionFiles = solutions.solutions[assignmentId]

    const studentFiles: SourceFile[] = useMemo(() => {
        // Return files from historical submission if viewing history
        if (isHistoryView && viewingSubmission) {
            if (activeAssignment.kind === 'project' || (activeAssignment.kind === 'code' && activeAssignment.starterFiles)) {
                try {
                    // Multi-file and project submissions store files as a JSON string
                    return JSON.parse(viewingSubmission.content) as SourceFile[]
                } catch {
                    return []
                }
            }
            if (activeAssignment.kind === 'code') {
                // Single-file code submissions store code directly as a string
                return [{ name: 'Main.java', content: viewingSubmission.content }]
            }
            return []
        }

        // Default draft files
        if (activeAssignment.kind === 'project') return drafts.state.project[assignmentId] ?? []
        if (activeAssignment.kind === 'code') {
            if (activeAssignment.starterFiles) return drafts.state.multiFiles[assignmentId] ?? []
            return [{ name: 'Main.java', content: drafts.state.code[assignmentId] ?? defaultStarter }]
        }
        return []
    }, [activeAssignment, drafts.state, assignmentId, isHistoryView, viewingSubmission])

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

    const activeContent = activeAssignment.kind === 'predict'
        ? (activeAssignment.snippet ?? '')
        : isVisible
            ? (solutionFiles?.[safeSolutionIndex]?.content ?? '')
            : (studentFiles[safeStudentIndex]?.content ?? projectUploadStarter)

    const modeString = isVisible ? 'solution' : isHistoryView ? 'history' : 'student'
    const currentFile = isVisible ? solutionFiles?.[safeSolutionIndex] : studentFiles[safeStudentIndex]
    const currentFileName = activeAssignment.kind === 'predict'
        ? 'Snippet.java'
        : (currentFile?.name ?? 'Main.java')
    const currentIndex = isVisible ? safeSolutionIndex : safeStudentIndex

    const editorPath = `assignment-${assignmentId}-${modeString}-${currentIndex}-${currentFileName}`

    let writeKind: WriteKind = 'none'
    if (!isVisible && !isHistoryView && activeAssignment.kind !== 'predict') {
        if (activeAssignment.kind === 'project') writeKind = 'project'
        else if (activeAssignment.kind === 'code' && activeAssignment.starterFiles) writeKind = 'multi'
        else if (activeAssignment.kind === 'code') writeKind = 'code'
    }

    useLayoutEffect(() => {
        hideSolutionRef.current = solutions.hideSolution
        writeGateRef.current = {
            canWrite: writeKind !== 'none',
            writeKind,
            studentIndex: safeStudentIndex,
            assignmentId,
            expectedFileName: currentFileName,
        }
    }, [solutions.hideSolution, writeKind, safeStudentIndex, assignmentId, currentFileName])

    const handleSelectFile = (index: number) => {
        if (isVisible) {
            setActiveSolutionIndexByAssignment(prev => ({ ...prev, [assignmentId]: index }))
        } else {
            setActiveStudentIndexByAssignment(prev => ({ ...prev, [assignmentId]: index }))
        }
    }

    const handleEditorChange = (value: string) => {
        const gate = writeGateRef.current
        if (!gate.canWrite) return

        const declared = classNameFromJava(value)
        const expectedClass = gate.expectedFileName.replace(/\.java$/i, '')
        if (declared != null && declared !== expectedClass) return

        if (gate.writeKind === 'project') {
            drafts.updateProjectFile(gate.assignmentId, gate.studentIndex, value)
        } else if (gate.writeKind === 'multi') {
            drafts.updateMultiFile(gate.assignmentId, gate.studentIndex, value)
        } else if (gate.writeKind === 'code') {
            drafts.updateCode(gate.assignmentId, value)
        }
    }

    let viewStatusLabel = undefined
    let onExitView = undefined

    if (isVisible) {
        viewStatusLabel = 'Viewing reference solution'
        onExitView = () => solutions.hideSolution(assignmentId)
    } else if (isHistoryView && viewingSubmission) {
        const formattedDate = new Date(viewingSubmission.submittedAt).toLocaleString()
        viewStatusLabel = `Viewing historical submission from ${formattedDate}`
        onExitView = onExitHistoryView
    }

    return {
        tabFiles,
        activeTabIndex,
        handleSelectFile,
        editorValue: activeContent,
        editorPath,
        editorRemountKey: editorPath,
        isReadOnly:
            activeAssignment.kind === 'predict' ||
            isVisible ||
            isHistoryView || // Lock editor in history view
            (activeAssignment.kind === 'project' && studentFiles.length === 0),
        handleEditorChange,
        currentContent: activeContent,
        currentStudentFiles: studentFiles,
        viewStatusLabel,
        onExitView,
    }
}