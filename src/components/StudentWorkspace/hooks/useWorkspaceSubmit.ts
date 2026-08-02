import {useState, useRef, useEffect} from 'react'
import type { Assignment, SourceFile } from '@types'
import { useExecutor } from '@hooks/useExecutor'
import { useSubmission } from '@hooks/useSubmission'
import { useAssignments } from '@hooks/useAssignments'
import { submitAssignment } from '@/api/submissionApi.ts'
import type { PredictStatus } from '@components'

interface SubmitOptions {
    activeAssignment: Assignment
    sessionCode?: string
    currentContent: string | SourceFile[]
    assignmentProgress: ReturnType<typeof useAssignments>
    onSubmissionMade: () => void
    solutions: ReturnType<typeof import('./useAssignmentData.ts').useAssignmentData>
    viewingSubmissionId?: number | string | null
}

export function useWorkspaceSubmit({
                                       activeAssignment,
                                       sessionCode,
                                       currentContent,
                                       assignmentProgress,
                                       onSubmissionMade,
                                       solutions,
                                       viewingSubmissionId
                                   }: SubmitOptions) {
    const assignmentId = activeAssignment.id

    const executor = useExecutor()
    const [submitFlash, setSubmitFlash] = useState<{ id: number, passed: boolean } | null>(null)
    const [isSubmittingPredict, setIsSubmittingPredict] = useState(false)
    const [predictStatus, setPredictStatus] = useState<Record<number, PredictStatus>>({})

    const submitGenerationRef = useRef(0)

    useEffect(() => {
        executor.reset()
    }, [assignmentId, viewingSubmissionId])

    const submission = useSubmission({
        onResult: (result) => {
            if (!result.result) return
            executor.showResult(result.result)
            onSubmissionMade()
        },
    })

    const handleRunCode = async () => {
        if (activeAssignment.kind !== 'code') return

        executor.reset()

        const request = Array.isArray(currentContent)
            ? { files: currentContent, entryClass: activeAssignment.entryClass, stdin: activeAssignment.stdin }
            : { code: currentContent, stdin: activeAssignment.stdin }

        await executor.run(request)
    }

    const handleSubmitCode = async () => {
        const generation = ++submitGenerationRef.current
        const result = await submission.confirm(currentContent, assignmentId, sessionCode)

        if (submitGenerationRef.current === generation) setSubmitFlash({ id: assignmentId, passed: result?.passed === true })
        if (result?.passed === true) solutions.hideSolution(assignmentId)
        return result;
    }

    const handleProjectSubmit = async () => {
        const generation = ++submitGenerationRef.current
        const result = await submission.confirm(currentContent, assignmentId, sessionCode)

        if (submitGenerationRef.current === generation) setSubmitFlash({ id: assignmentId, passed: result?.passed === true })
        if (result?.passed === true) solutions.hideSolution(assignmentId)
        return result;
    }

    const handlePredictSubmit = async () => {
        const generation = ++submitGenerationRef.current
        setIsSubmittingPredict(true)
        try {
            const result = await submitAssignment({ assignmentId, content: currentContent, sessionCode })
            const correct = result.passed === true

            setPredictStatus(prev => ({ ...prev, [assignmentId]: correct ? 'correct' : 'tried' }))

            if (correct) {
                assignmentProgress.complete(assignmentId)
                solutions.hideSolution(assignmentId)
            }
            if (submitGenerationRef.current === generation) setSubmitFlash({ id: assignmentId, passed: correct })
            return result;
        } catch (err) {
            console.error(`Could not submit your answer. err: ` + err)
            return null
        } finally {
            setIsSubmittingPredict(false)
        }
    }

    return {
        isRunning: executor.isRunning,
        isSubmitting: submission.isSubmitting,
        submitFlash: submitFlash?.id === assignmentId ? submitFlash : null,
        predictStatus: predictStatus[assignmentId] ?? 'idle',
        handleRunCode,
        handleSubmitCode,
        handlePredictSubmit,
        handleProjectSubmit,
        outputState: { output: executor.output, status: executor.status },
        handleClearOutput: executor.reset,
        isSubmittingPredict
    }
}