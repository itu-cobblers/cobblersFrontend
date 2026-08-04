import { useState, useEffect } from 'react'
import type { Assignment, SourceFile } from '@types'
import { defaultStarter } from '@lib/defaultStarter'

const DRAFTS_STORAGE_KEY = 'bootit_student_drafts'

type DraftState = {
    code: Record<number, string>
    multiFiles: Record<number, SourceFile[]>
    predict: Record<number, string>
    project: Record<number, SourceFile[]>
}

function initialCode(assignments: Assignment[]): Record<number, string> {
    const map: Record<number, string> = {}
    for (const a of assignments) {
        if (a.kind === 'code' && !a.starterFiles) map[a.id] = a.starter ?? defaultStarter
    }
    return map
}

function initialMultiFiles(assignments: Assignment[]): Record<number, SourceFile[]> {
    const map: Record<number, SourceFile[]> = {}
    for (const a of assignments) {
        if (a.kind === 'code' && a.starterFiles) map[a.id] = a.starterFiles
    }
    return map
}

export function useLocalDrafts(allAssignments: Assignment[]) {
    const [drafts, setDrafts] = useState<DraftState>(() => {
        try {
            const saved = localStorage.getItem(DRAFTS_STORAGE_KEY)
            if (saved) return JSON.parse(saved)
        } catch { /* fallback */ }

        return {
            code: initialCode(allAssignments),
            multiFiles: initialMultiFiles(allAssignments),
            predict: {},
            project: {}
        }
    })

    useEffect(() => {
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts))
    }, [drafts])

    // Backfill drafts for assignments missing from a previously-saved blob
    // (e.g. a new assignment set, or one added after this hook's first mount).
    // Adjusted during render, not in an effect: setDrafts here is a bail-out
    // that makes React re-render immediately with the missing ids filled in,
    // so this condition is false on the very next pass — no cascading renders.
    const missingCode = allAssignments.filter(a => a.kind === 'code' && !a.starterFiles && !(a.id in drafts.code))
    const missingMultiFiles = allAssignments.filter(a => a.kind === 'code' && a.starterFiles && !(a.id in drafts.multiFiles))
    if (missingCode.length > 0 || missingMultiFiles.length > 0) {
        setDrafts(prev => ({
            ...prev,
            code: { ...prev.code, ...initialCode(missingCode) },
            multiFiles: { ...prev.multiFiles, ...initialMultiFiles(missingMultiFiles) }
        }))
    }

    const updateCode = (id: number, value: string) => {
        setDrafts((prev) => ({ ...prev, code: { ...prev.code, [id]: value } }))
    }

    const updateMultiFile = (id: number, fileIndex: number, value: string) => {
        setDrafts((prev) => {
            const currentFiles = prev.multiFiles[id] || []
            return {
                ...prev,
                multiFiles: {
                    ...prev.multiFiles,
                    [id]: currentFiles.map((f, i) => i === fileIndex ? { ...f, content: value } : f)
                }
            }
        })
    }

    const updatePredict = (id: number, value: string) => {
        setDrafts((prev) => ({ ...prev, predict: { ...prev.predict, [id]: value } }))
    }

    const updateProject = (id: number, files: SourceFile[]) => {
        setDrafts((prev) => ({ ...prev, project: { ...prev.project, [id]: files } }))
    }

    const updateProjectFile = (id: number, fileIndex: number, value: string) => {
        setDrafts((prev) => {
            const currentFiles = prev.project[id] || []
            return {
                ...prev,
                project: {
                    ...prev.project,
                    [id]: currentFiles.map((f, i) => i === fileIndex ? { ...f, content: value } : f)
                }
            }
        })
    }

    return {
        state: drafts,
        updateCode,
        updateMultiFile,
        updatePredict,
        updateProject,
        updateProjectFile
    }
}