import {
    SUBMISSION_ROW_ACTIVE_CLASS,
    SUBMISSION_ROW_IDLE_CLASS,
    SUBMISSION_TITLE_CLASS,
    SUBMISSION_META_CLASS,
} from './SubmissionRow.constants'
import type {SubmissionRowProps} from "@components/SubmissionRow/SubmissionRow.types.ts";
import {StatusBadge} from "@components/StatusBadge";

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
                    <StatusBadge
                        status={isPassed ? 'passed' : 'tried'}
                        size="m"
                    />
                    <div>
                        <div className={SUBMISSION_TITLE_CLASS}>{title}</div>
                        <div className={SUBMISSION_META_CLASS}>{meta}</div>
                    </div>
                </div>
            </div>
        </li>
    )
}