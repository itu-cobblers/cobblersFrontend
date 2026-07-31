import { useState, useMemo } from 'react'
import type { Assignment, SourceFile } from '@types'
import type { CodeFileTab } from '@components'
import { projectUploadStarter, defaultStarter } from '@lib/defaultStarter'

interface ModeOptions {
    activeAssignment: Assignment
    drafts: ReturnType<typeof import('./useLocalDrafts').useLocalDrafts>
    solutions: ReturnType<typeof import('./useAssignmentSolutions').useAssignmentSolutions>
}

export function useWorkspaceMode({ activeAssignment, drafts, solutions }: ModeOptions) {
    const assignmentId = activeAssignment.id

    const [activeFileByName, setActiveFileByName] = useState<Record<number, string>>({})
    const [viewingSolution, setViewingSolution] = useState<Record<number, boolean>>({})
    const [activeSolutionFileByName, setActiveSolutionFileByName] = useState<Record<number, string>>({})

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

    const isViewingSolution = viewingSolution[assignmentId] ?? false
    const activeFileName = activeFileByName[assignmentId] ?? studentFiles[0]?.name ?? 'Main.java'
    const activeSolutionName = activeSolutionFileByName[assignmentId] ?? solutionFiles?.[0]?.name ?? 'Main.java'

    const tabFiles: CodeFileTab[] = useMemo(() => {
        const base = studentFiles.length > 0 ? studentFiles.map(f => ({ name: f.name })) : [{ name: 'Main.java' }]
        if (isVisible && solutionFiles) {
            return [...base, ...solutionFiles.map(f => ({ name: f.name, variant: 'solution' as const }))]
        }
        return base
    }, [studentFiles, isVisible, solutionFiles])

    const activeTabIndex = useMemo(() => {
        if (isViewingSolution && solutionFiles) {
            const idx = solutionFiles.findIndex(f => f.name === activeSolutionName)
            return (studentFiles.length > 0 ? studentFiles.length : 1) + (idx >= 0 ? idx : 0)
        }
        const idx = studentFiles.findIndex(f => f.name === activeFileName)
        return idx >= 0 ? idx : 0
    }, [isViewingSolution, solutionFiles, activeSolutionName, studentFiles, activeFileName])

    const handleSelectFile = (index: number) => {
        const studentCount = studentFiles.length > 0 ? studentFiles.length : 1
        if (isVisible && solutionFiles && index >= studentCount) {
            setViewingSolution(prev => ({ ...prev, [assignmentId]: true }))
            setActiveSolutionFileByName(prev => ({ ...prev, [assignmentId]: solutionFiles[index - studentCount].name }))
        } else {
            setViewingSolution(prev => ({ ...prev, [assignmentId]: false }))
            const name = studentFiles[index]?.name ?? 'Main.java'
            setActiveFileByName(prev => ({ ...prev, [assignmentId]: name }))
        }
    }

    const handleEditorChange = (value: string) => {
        if (isViewingSolution) return
        if (activeAssignment.kind === 'project') drafts.updateProjectFile(assignmentId, activeFileName, value)
        else if (activeAssignment.kind === 'code' && activeAssignment.starterFiles) drafts.updateMultiFile(assignmentId, activeFileName, value)
        else drafts.updateCode(assignmentId, value)
    }

    const activeContent = isViewingSolution
        ? (solutionFiles?.find(f => f.name === activeSolutionName)?.content ?? '')
        : (studentFiles.find(f => f.name === activeFileName)?.content ?? projectUploadStarter)

    const modeString = isViewingSolution ? 'solution' : 'student'
    const currentFileName = isViewingSolution ? activeSolutionName : activeFileName

    return {
        tabFiles,
        activeTabIndex,
        handleSelectFile,
        editorValue: activeContent,
        editorPath: `assignment-${assignmentId}-${modeString}-${currentFileName}`,
        isReadOnly: isViewingSolution || (activeAssignment.kind === 'project' && studentFiles.length === 0),
        handleEditorChange,
        currentContent: activeContent,
        currentStudentFiles: studentFiles
    }
}