import { useState, type FormEvent } from 'react'
import { isTeacher, grantTeacher } from '@lib/teacherAuth'

/** Owns the teacher code-entry state and verification. */
export function useTeacherAuth() {
  const [isAuthed, setIsAuthed] = useState(isTeacher)
  const [code, setCode] = useState('')
  const [hasError, setHasError] = useState(false)

  function handleCodeChange(value: string) {
    setCode(value)
    setHasError(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (code === import.meta.env.VITE_TEACHER_CODE) {
      grantTeacher()
      setIsAuthed(true)
    } else {
      setHasError(true)
      setCode('')
    }
  }

  return { isAuthed, code, hasError, handleCodeChange, handleSubmit }
}
