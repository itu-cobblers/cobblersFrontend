import type { ToastTone } from './Toast.types'

export const TOAST_WRAP_CLASS =
  'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg px-4 py-2.5 shadow-lg'

export const TOAST_TONE_CLASS: Record<ToastTone, string> = {
  error: 'bg-error text-white',
  success: 'bg-ok text-white',
}

export const TOAST_MESSAGE_CLASS = 'text-[13px] font-semibold'

export const TOAST_DISMISS_CLASS =
  'text-[15px] leading-none text-white/70 transition-colors hover:text-white'
