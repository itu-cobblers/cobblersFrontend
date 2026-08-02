import type { Assignment, SourceFileDto, SubmissionDetailDto } from "@types"
import { defaultStarter } from "@lib/defaultStarter.ts"

export function getTabFiles(
    activeAssignment: Assignment | undefined,
    submissionDetail: SubmissionDetailDto | null,
    activeSubId: string | null,
    solutionData: string | SourceFileDto[] | null,
    isSolutionVisible: boolean
): SourceFileDto[] {
    if (isSolutionVisible && solutionData) {
        if (Array.isArray(solutionData)) {
            return solutionData
        }
        if (typeof solutionData === 'string') {
            return [{ name: 'Main.java', content: solutionData }]
        }
    }

    const isCode = activeAssignment?.kind === 'code'
    const isProject = activeAssignment?.kind === 'project'

    if (activeSubId && submissionDetail) {
        if (isProject || (isCode && activeAssignment?.starterFiles)) {
            try {
                const parsed = JSON.parse(submissionDetail.content)
                return Array.isArray(parsed) ? (parsed as SourceFileDto[]) : []
            } catch {
                return []
            }
        }
        if (isCode) {
            return [{ name: 'Main.java', content: submissionDetail.content }]
        }
    }
    else if (activeAssignment && isCode) {
        if (activeAssignment.starterFiles) {
            return activeAssignment.starterFiles
        }
        return [{ name: 'Main.java', content: activeAssignment.starter ?? defaultStarter }]
    }

    return []
}

export function getEditorContent(
    activeAssignment: Assignment | undefined,
    submissionDetail: SubmissionDetailDto | null,
    tabFiles: SourceFileDto[],
    activeFileIndex: number,
    solutionData: string | SourceFileDto[] | null,
    isSolutionVisible: boolean
): string {
    if (isSolutionVisible && solutionData) {
        if (tabFiles.length > 0) {
            return tabFiles[activeFileIndex]?.content ?? ''
        }
        if (typeof solutionData === 'string') {
            return solutionData
        }
    }

    if (submissionDetail) {
        if (activeAssignment?.kind === 'predict') {
            return submissionDetail.content
        }
        if (tabFiles.length > 0) {
            return tabFiles[activeFileIndex]?.content ?? ''
        }
        return submissionDetail.content
    }

    if (activeAssignment) {
        if (activeAssignment.kind === 'predict') {
            return activeAssignment.snippet
        }
        if (activeAssignment.kind === 'code') {
            return tabFiles[activeFileIndex]?.content ?? activeAssignment.starter ?? defaultStarter
        }
    }
    return ''
}