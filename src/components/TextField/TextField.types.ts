export type TextFieldType = 'text' | 'password' | 'number'

export interface TextFieldProps {
  value: string | number
  /** Receives the raw input value; callers parse (e.g. Number) as needed. */
  onChange: (value: string) => void
  type?: TextFieldType
  placeholder?: string
  hasError?: boolean
  isDisabled?: boolean
  min?: number
  max?: number
  autoFocus?: boolean
  /** Optional layout utilities (e.g. a fixed width). */
  className?: string
}
