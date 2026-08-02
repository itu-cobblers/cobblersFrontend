import type { ReactNode } from 'react'
import type { SubmissionHistoryItem } from '@types'

export interface SubmissionRowProps {
    submission: SubmissionHistoryItem
    title: ReactNode
    meta: ReactNode
    isActive?: boolean
    onClick?: () => void
}