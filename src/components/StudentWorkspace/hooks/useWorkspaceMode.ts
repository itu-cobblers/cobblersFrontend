import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react'
import type { Assignment, SourceFile } from '@types'
import type { ToolbarFile } from '@components'
import { projectUploadStarter, defaultStarter } from '@lib/defaultStarter'

interface ModeOptions {
    activeAssignment: Assignment
    drafts: ReturnType<typeof import('./useLocalDrafts').useLocalDrafts>
    solutions: ReturnType<typeof import('./useAssignmentSolutions').useAssignmentSolutions>
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

export function useWorkspaceMode({ activeAssignment, drafts, solutions }: ModeOptions) {
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

    // Leaving a problem must exit its solution view, otherwise bouncing the
    // problem list resurfaces reference code and looks like a draft overwrite.
    const prevAssignmentIdRef = useRef(assignmentId)
    useEffect(() => {
        const prev = prevAssignmentIdRef.current
        if (prev !== assignmentId) {
            hideSolutionRef.current(prev)
            prevAssignmentIdRef.current = assignmentId
        }
    }, [assignmentId])

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

    const tabFiles: ToolbarFile[] = useMemo(() => {
        if (isVisible && solutionFiles) {
            return solutionFiles.map(f => ({ name: f.name, variant: 'solution' as const }))
        }
        return studentFiles.length > 0 ? studentFiles.map(f => ({ name: f.name })) : [{ name: 'Main.java' }]
    }, [studentFiles, isVisible, solutionFiles])

    const activeTabIndex = isVisible ? safeSolutionIndex : safeStudentIndex

    // Predict keeps a read-only snippet in the editor; solution reveal lives in PredictPanel.
    const activeContent = activeAssignment.kind === 'predict'
        ? (activeAssignment.snippet ?? '')
        : isVisible
            ? (solutionFiles?.[safeSolutionIndex]?.content ?? '')
            : (studentFiles[safeStudentIndex]?.content ?? projectUploadStarter)

    const modeString = isVisible ? 'solution' : 'student'
    const currentFile = isVisible ? solutionFiles?.[safeSolutionIndex] : studentFiles[safeStudentIndex]
    const currentFileName = activeAssignment.kind === 'predict'
        ? 'Snippet.java'
        : (currentFile?.name ?? 'Main.java')
    const currentIndex = isVisible ? safeSolutionIndex : safeStudentIndex

    const editorPath = `assignment-${assignmentId}-${modeString}-${currentIndex}-${currentFileName}`

    let writeKind: WriteKind = 'none'
    if (!isVisible && activeAssignment.kind !== 'predict') {
        if (activeAssignment.kind === 'project') writeKind = 'project'
        else if (activeAssignment.kind === 'code' && activeAssignment.starterFiles) writeKind = 'multi'
        else if (activeAssignment.kind === 'code') writeKind = 'code'
    }

    // Must run in layout phase (not useEffect): Monaco applies model/value changes
    // in useEffect, which is after layout. Parent layout still runs before child
    // useEffect, so stale onChange callbacks already see the new write gate.
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

        // Reject cross-file ghosts: e.g. Main body arriving while FlightTicket is active.
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
    if (isVisible) {
        viewStatusLabel = 'Viewing reference solution'
    }

    return {
        tabFiles,
        activeTabIndex,
        handleSelectFile,
        editorValue: activeContent,
        editorPath,
        // Remount on every file/mode/assignment switch — no shared Monaco models.
        editorRemountKey: editorPath,
        isReadOnly:
            activeAssignment.kind === 'predict' ||
            isVisible ||
            (activeAssignment.kind === 'project' && studentFiles.length === 0),
        handleEditorChange,
        currentContent: activeContent,
        currentStudentFiles: studentFiles,
        viewStatusLabel,
        onExitView: () => solutions.hideSolution(assignmentId),
    }
}
