export type ToastTone = 'error' | 'success'

export interface ToastProps {
  message: string
  tone: ToastTone
  onDismiss: () => void
}
