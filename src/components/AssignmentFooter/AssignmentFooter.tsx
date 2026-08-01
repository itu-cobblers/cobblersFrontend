import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { SubmitButton } from '@components/SubmitButton'
import type { AssignmentFooterProps } from './AssignmentFooter.types'
import {
    ASSIGNMENT_FOOTER_CLASS, ASSIGNMENT_FOOTER_PASSED_LABEL_CLASS,
    ASSIGNMENT_FOOTER_RIGHT_CLASS, ASSIGNMENT_FOOTER_TRIED_LABEL_CLASS,
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
    viewStatusLabel,
    onExitView,
}: AssignmentFooterProps) {


    const isHistoryView = historyStatus !== null;
    const isEditable = !isHistoryView && !isSolutionVisible;
    const isPassed = historyStatus === 'success';

    return (
        <div className={classNames(ASSIGNMENT_FOOTER_CLASS, 'justify-between items-center')}>
            <div className="flex items-center">
                {viewStatusLabel && (
                    <span className="text-sm italic text-gray-400">
                      {viewStatusLabel}
                  </span>
                )}
            </div>
            <div className={ASSIGNMENT_FOOTER_RIGHT_CLASS}>
                {isHistoryView && (
                    <div className={isPassed? ASSIGNMENT_FOOTER_PASSED_LABEL_CLASS : ASSIGNMENT_FOOTER_TRIED_LABEL_CLASS}>
                        <Icon name={isPassed? 'check' : 'alert'}/>
                        {isPassed ? 'Well done' : 'Not quite, try again'}
                    </div>
                )}
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