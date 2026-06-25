import { type ChangeEvent } from 'react'
import classNames from 'classnames'
import type { TextFieldProps } from './TextField.types'
import { TEXT_FIELD_BASE_CLASS } from './TextField.constants'

export default function TextField({
  value,
  onChange,
  type = 'text',
  placeholder,
  hasError = false,
  isDisabled = false,
  min,
  max,
  autoFocus = false,
  className,
}: TextFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={isDisabled}
      min={min}
      max={max}
      autoFocus={autoFocus}
      onChange={handleChange}
      className={classNames(
        TEXT_FIELD_BASE_CLASS,
        { 'border-berry': hasError, 'border-oak': !hasError },
        className,
      )}
    />
  )
}
