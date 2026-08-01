import { Icon } from '@components/Icon'
import {
    SUBMISSION_ROW_ACTIVE_CLASS,
    SUBMISSION_ROW_IDLE_CLASS,
    SUBMISSION_TITLE_CLASS,
    SUBMISSION_META_CLASS,
    SUBMISSION_BADGE_PASSED_CLASS,
    SUBMISSION_BADGE_FAILED_CLASS,
} from './SubmissionRow.constants'
import type {SubmissionRowProps} from "@components/SubmissionRow/SubmissionRow.types.ts";

export default function SubmissionRow({
    submission,
    title,
    meta,
    isActive = false,
    onClick,
}: SubmissionRowProps) {
    const isPassed = submission.passed !== false

    return (
        <li
            onClick={onClick}
            className={isActive ? SUBMISSION_ROW_ACTIVE_CLASS : SUBMISSION_ROW_IDLE_CLASS}
        >
            <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex items-center gap-3">
                    <span
                        className={
                            isPassed
                                ? SUBMISSION_BADGE_PASSED_CLASS
                                : SUBMISSION_BADGE_FAILED_CLASS
                        }
                    >
                        <Icon name={isPassed ? 'check' : 'x'} />
                    </span>
                    <div>
                        <div className={SUBMISSION_TITLE_CLASS}>{title}</div>
                        <div className={SUBMISSION_META_CLASS}>{meta}</div>
                    </div>
                </div>
            </div>
        </li>
    )
}