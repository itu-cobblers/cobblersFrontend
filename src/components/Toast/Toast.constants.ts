import type { ToastTone } from './Toast.types'

export const TOAST_WRAP_CLASS =
  'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg px-4 py-2.5'

/**
 * Ink is `--background`, not white: the status fills invert with the theme
 * (`#DC2626` light → `#ff7b72` dark), and white on the pale dark fills is
 * 2.5:1 / 1.5:1 — illegible. The page colour is always the opposite of the
 * foreground, so it stays the high-contrast choice in both. Identical to
 * `text-white` in light, where `--background` is pure white.
 */
export const TOAST_TONE_CLASS: Record<ToastTone, string> = {
  error: 'bg-status-error text-background',
  success: 'bg-status-success text-background',
}

export const TOAST_MESSAGE_CLASS = 'text-[13px] font-semibold'

export const TOAST_DISMISS_CLASS =
  'text-[15px] leading-none text-background/70 transition-colors hover:text-background'
