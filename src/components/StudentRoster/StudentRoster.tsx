import classNames from 'classnames'
import { ProgressBar } from '@components/ProgressBar'
import type { StudentRosterProps } from './StudentRoster.types'
import {
  ROSTER_WRAP_CLASS,
  ROSTER_EMPTY_CLASS,
  ROSTER_ITEM_CLASS,
  ROSTER_ITEM_HEADER_CLASS,
  ROSTER_NAME_CLASS,
  ROSTER_META_CLASS,
  ROSTER_CURRENT_CLASS,
  ROSTER_PROGRESS_CLASS,
  ROSTER_PILL_BASE_CLASS,
  ROSTER_PILL_TONE_CLASS,
  ROSTER_PILL_LABEL,
} from './StudentRoster.constants'

export default function StudentRoster({ students }: StudentRosterProps) {
  if (students.length === 0) {
    return <p className={ROSTER_EMPTY_CLASS}>No students have joined yet.</p>
  }

  return (
    <div className={ROSTER_WRAP_CLASS}>
      {students.map((student) => (
        <div key={student.studentId} className={ROSTER_ITEM_CLASS}>
          <div className={ROSTER_ITEM_HEADER_CLASS}>
            <span className={ROSTER_NAME_CLASS}>{student.displayName}</span>
            <span className={classNames(ROSTER_PILL_BASE_CLASS, ROSTER_PILL_TONE_CLASS[student.status])}>
              {ROSTER_PILL_LABEL[student.status]}
            </span>
          </div>
          <div className={ROSTER_PROGRESS_CLASS}>
            <ProgressBar value={student.completed} max={student.total} />
          </div>
          <div className={ROSTER_META_CLASS}>
            <span className={ROSTER_CURRENT_CLASS}>{student.currentTitle}</span>
            <span>
              {student.completed}/{student.total}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
