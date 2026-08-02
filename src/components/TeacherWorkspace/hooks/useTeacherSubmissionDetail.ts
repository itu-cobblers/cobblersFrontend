import { useState, useEffect } from 'react'
import { fetchSubmissionDetailsById } from '@/api/submissionApi'
import type { SubmissionDetailDto } from '@types'

export function useTeacherSubmissionDetail(activeSubId: string | null) {
    const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetailDto | null>(null)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const currentDetail = submissionDetail?.subId === activeSubId ? submissionDetail : null
    const isLoadingDetail = !!activeSubId && (isFetching || submissionDetail?.subId !== activeSubId)

    useEffect(() => {
        if (!activeSubId) return

        let isMounted = true

        const fetchDetail = async () => {
            setIsFetching(true)
            try {
                const detail = await fetchSubmissionDetailsById(activeSubId)
                if (isMounted) {
                    setSubmissionDetail(detail)
                }
            } catch (err) {
                console.error("[Teacher] Failed to fetch submission detail:", err)
            } finally {
                if (isMounted) setIsFetching(false)
            }
        }

        fetchDetail()

        return () => {
            isMounted = false
        }
    }, [activeSubId])

    return {
        submissionDetail: currentDetail,
        isLoadingDetail
    }
}