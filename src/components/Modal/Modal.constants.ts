import type { ModalSize } from './Modal.types'

export const MODAL_OVERLAY_CLASS =
  'fixed inset-0 z-[100] flex items-center justify-center bg-ink/35 p-5 backdrop-blur-[2px]'

const MODAL_DIALOG_BASE_CLASS =
  'w-full rounded-[10px] border border-line bg-surface p-[22px] pb-[18px] shadow-[0_16px_48px_rgba(18,19,20,0.18)]'

export const MODAL_DIALOG_SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'max-w-[420px]',
  lg: 'max-w-[640px] max-h-[85vh] overflow-y-auto',
}

export const MODAL_DIALOG_CLASS = MODAL_DIALOG_BASE_CLASS
