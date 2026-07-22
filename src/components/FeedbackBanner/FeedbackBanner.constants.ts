import type { FeedbackTone } from './FeedbackBanner.types'

export const FEEDBACK_BANNER_BASE_CLASS = 'shrink-0 border-l-4 px-3.5 py-2.5'

export const FEEDBACK_BANNER_TONE_CLASS: Record<FeedbackTone, string> = {
  success: 'border-ok bg-ok/10',
  hint: 'border-accent bg-accent/8',
}

export const FEEDBACK_LABEL_BASE_CLASS = 'mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.8px]'

export const FEEDBACK_LABEL_TONE_CLASS: Record<FeedbackTone, string> = {
  success: 'text-ok',
  hint: 'text-accent',
}

export const FEEDBACK_LABEL_TEXT: Record<FeedbackTone, string> = {
  success: 'Check passed',
  hint: 'Feedback from the check',
}

export const FEEDBACK_MESSAGE_CLASS = 'text-[12px] leading-relaxed text-ink'

export const FEEDBACK_DEFAULT_MESSAGE: Record<FeedbackTone, string> = {
  success: 'Nice — your solution does exactly what the task asked.',
  hint: 'Not quite there yet — compare your output with the task and try again.',
}
