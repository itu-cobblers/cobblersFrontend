import { useState, useRef } from 'react'
import type { Assignment, SourceFile } from '@types'
import { useExecutor } from '@hooks/useExecutor'
import { useSubmission } from '@hooks/useSubmission'
import { useAssignments } from '@hooks/useAssignments'
import { submitAssignment } from '@lib/submissionApi'
import type { FeedbackBannerProps, PredictStatus } from '@components'

interface SubmitOptions {
    activeAssignment: Assignment
    sessionCode?: string
    currentContent: string | SourceFile[]
    assignmentProgress: ReturnType<typeof useAssignments>
    onSubmissionMade: () => void
    solutions: ReturnType<typeof import('./useAssignmentSolutions').useAssignmentSolutions>
}

export function useWorkspaceSubmit({
                                       activeAssignment,
                                       sessionCode,
                                       currentContent,
                                       assignmentProgress,
                                       onSubmissionMade,
                                       solutions
                                   }: SubmitOptions) {
    const assignmentId = activeAssignment.id

    const executor = useExecutor()
    const [feedback, setFeedback] = useState<FeedbackBannerProps | null>(null)
    const [submitFlash, setSubmitFlash] = useState<{ id: number, passed: boolean } | null>(null)
    const [isSubmittingPredict, setIsSubmittingPredict] = useState(false)
    const [isMarkingDone, setIsMarkingDone] = useState(false)
    const [predictStatus, setPredictStatus] = useState<Record<number, PredictStatus>>({})

    const submitGenerationRef = useRef(0)

    const submission = useSubmission({
        onResult: (content, result) => {
            if (!result.result) return
            executor.showResult(result.result)
            if (result.passed === true && typeof content === 'string') {
                assignmentProgress.grade(content, result.result, { forceComplete: true })
            }
            onSubmissionMade()
        },
    })

    const handleRunCode = async () => {
        if (activeAssignment.kind !== 'code') return

        executor.reset()
        setFeedback(null)

        const request = Array.isArray(currentContent)
            ? { files: currentContent, entryClass: activeAssignment.entryClass, stdin: activeAssignment.stdin }
            : { code: currentContent, stdin: activeAssignment.stdin }

        const data = await executor.run(request)
        if (data) {
            const codeStr = Array.isArray(currentContent) ? '' : currentContent
            const verdict = assignmentProgress.grade(codeStr, data)
            if (verdict) setFeedback({ tone: verdict.passed ? 'success' : 'hint', message: verdict.message })
        }
    }

    const handleSubmitCode = async () => {
        const generation = ++submitGenerationRef.current
        const result = await submission.confirm(currentContent, assignmentId, sessionCode)
        if (submitGenerationRef.current === generation) setSubmitFlash({ id: assignmentId, passed: result?.passed === true })
        if (result?.passed === true) solutions.hideSolution(assignmentId)
    }

    const handlePredictSubmit = async () => {
        const generation = ++submitGenerationRef.current
        setIsSubmittingPredict(true)
        try {
            const answer = typeof currentContent === 'string' ? currentContent : ''
            const result = await submitAssignment({ assignmentId, content: answer, sessionCode })
            const correct = result.passed === true

            setPredictStatus(prev => ({ ...prev, [assignmentId]: correct ? 'correct' : 'tried' }))

            if (correct) {
                assignmentProgress.complete(assignmentId)
                solutions.hideSolution(assignmentId)
            }
            if (submitGenerationRef.current === generation) setSubmitFlash({ id: assignmentId, passed: correct })
            onSubmissionMade()
        } catch (err) {
            setFeedback({ tone: 'hint', message: `Could not submit your answer. err: ` + err })
        } finally {
            setIsSubmittingPredict(false)
        }
    }

    const handleMarkAsDone = async () => {
        setIsMarkingDone(true)
        try {
            await submitAssignment({ assignmentId, content: currentContent, sessionCode })
            assignmentProgress.complete(assignmentId)
            solutions.hideSolution(assignmentId)
            setSubmitFlash({ id: assignmentId, passed: true })
            onSubmissionMade()
        } catch (err) {
            setFeedback({ tone: 'hint', message: `Could not save your progress. err: ` + err })
        } finally {
            setIsMarkingDone(false)
        }
    }

    return {
        isRunning: executor.isRunning,
        isSubmitting: submission.isSubmitting,
        submitFlash: submitFlash?.id === assignmentId ? submitFlash : null,
        feedback,
        predictStatus: predictStatus[assignmentId] ?? 'idle',

        handleRunCode,
        handleSubmitCode,
        handlePredictSubmit,
        handleProjectSubmit: handleSubmitCode,
        isMarkingDone,
        handleMarkAsDone,

        outputState: { output: executor.output, status: executor.status },
        isSubmittingPredict
    }
}