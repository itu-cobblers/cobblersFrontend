import { Icon } from '@components/Icon'
import { SubmitButton } from '@components/SubmitButton'
import type { AssignmentFooterProps } from './AssignmentFooter.types'
import {
    ASSIGNMENT_FOOTER_CLASS,
    ASSIGNMENT_FOOTER_RIGHT_CLASS,
} from './AssignmentFooter.constants'
import {Button, ShowAnswerButton} from "@/components";

export default function AssignmentFooter({
    submitStatus,
    onSubmit,
    isSubmitDisabled = false,
    canRevealAnswer = false,
    isSolutionVisible = false,
    isLoadingSolution = false,
    onToggleSolution,
    historyStatus = null,
    onExitView,
}: AssignmentFooterProps) {


    // Still derived from historyStatus — it decides Back-to-Editor vs Submit.
    const isHistoryView = historyStatus !== null;
    const isEditable = !isHistoryView && !isSolutionVisible;

    return (
        <div className={ASSIGNMENT_FOOTER_CLASS}>
            <div className={ASSIGNMENT_FOOTER_RIGHT_CLASS}>
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
                ) : (
                    <SubmitButton
                        status={submitStatus}
                        onClick={onSubmit}
                        isDisabled={isSubmitDisabled}
                        label="Submit"
                    />
                )}
            </div>
        </div>
    )
}