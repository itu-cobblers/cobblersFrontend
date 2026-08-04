import { Icon } from '@components/Icon'
import { RunMenu } from '@components/RunMenu'
import { SubmitButton } from '@components/SubmitButton'
import type { AssignmentFooterProps } from '@/components'
import {
    ASSIGNMENT_FOOTER_CLASS,
} from './AssignmentFooter.constants'
import {Button, ShowAnswerButton} from "@/components";

export default function AssignmentFooter({
    submitStatus,
    onRun,
    isRunning = false,
    onSubmit,
    isSubmitDisabled = false,
    canRevealAnswer = false,
    isSolutionVisible = false,
    isLoadingSolution = false,
    onToggleSolution,
    historyStatus = null,
    onExitView,
}: AssignmentFooterProps) {

    const isHistoryView = historyStatus !== null;
    const isEditable = !isHistoryView && !isSolutionVisible;

    return (
        <div className={ASSIGNMENT_FOOTER_CLASS}>
            {canRevealAnswer && onToggleSolution && !isSolutionVisible && (
                <ShowAnswerButton
                    onClick={onToggleSolution}
                    isDisabled={isLoadingSolution}
                    label="Show Answer"
                />
            )}
            {!isEditable && onExitView ? (
                <Button
                    variant="zinc"
                    onClick={onExitView}
                >
                    <Icon name="arrowBack" />
                    <span>Back to Editor</span>
                </Button>
            ) : onRun ? (
                <RunMenu
                    onRun={onRun}
                    onSubmit={onSubmit}
                    isRunning={isRunning}
                    isSubmitting={submitStatus === 'waiting'}
                    isSubmitDisabled={isSubmitDisabled}
                />
            ) : (
                <SubmitButton status={submitStatus} onClick={onSubmit} isDisabled={isSubmitDisabled} />
            )}
        </div>
    )
}