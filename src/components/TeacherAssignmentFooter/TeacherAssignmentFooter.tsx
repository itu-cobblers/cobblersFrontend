import { ShowAnswerButton } from '@components'
import type { TeacherAssignmentFooterProps } from './TeacherAssignmentFooter.types'
import {
    TEACHER_ASSIGNMENT_FOOTER_CLASS,
    TEACHER_ASSIGNMENT_FOOTER_RIGHT_CLASS
} from './TeacherAssignmentFooter.constants'

export default function TeacherAssignmentFooter({
    isPredict,
    isCode,
    isProject,
    isAnswerVisible = false,
    isLoadingSolution = false,
    isSolutionVisible = false,
    onToggleAnswer,
    onToggleSolution,
    viewStatusLabel
}: TeacherAssignmentFooterProps) {
    return (
        <div className={TEACHER_ASSIGNMENT_FOOTER_CLASS}>
            <div className="flex items-center">
                {viewStatusLabel && (
                    <span className="text-sm italic text-gray-400">
                        {viewStatusLabel}
                    </span>
                )}
            </div>
            <div className={TEACHER_ASSIGNMENT_FOOTER_RIGHT_CLASS}>
                {isPredict && onToggleAnswer && (
                    <ShowAnswerButton
                        onClick={onToggleAnswer}
                        label={isAnswerVisible ? 'Hide answer' : 'Show answer'}
                    />
                )}
                {(isCode || isProject) && onToggleSolution && (
                    <ShowAnswerButton
                        onClick={onToggleSolution}
                        isDisabled={isLoadingSolution}
                        label={
                            isLoadingSolution
                                ? 'Loading…'
                                : isSolutionVisible
                                    ? 'Hide reference solution'
                                    : 'Show reference solution'
                        }
                    />
                )}
            </div>
        </div>
    )
}