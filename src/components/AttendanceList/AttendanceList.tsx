import classNames from 'classnames'
import { Icon } from '@components/Icon'
import { StatusBadge } from '@components/StatusBadge'
import { LIST_COUNT_CLASS } from '@components/ProblemsList/ProblemsList.constants'
import type { AttendanceListProps, AttendanceStudent } from './AttendanceList.types'
import {
  ROSTER_CLASS,
  ROSTER_HEADER_CLASS,
  ROSTER_HEADER_LEFT_CLASS,
  ROSTER_SUBHEADER_CLASS,
  ROSTER_ITEMS_CLASS,
  ROSTER_EMPTY_CLASS,
  ROSTER_ITEM_BASE_CLASS,
  ROSTER_ITEM_ACTIVE_CLASS,
  ROSTER_ITEM_IDLE_CLASS,
  ROSTER_ITEM_LEFT_CLASS,
  ROSTER_ONLINE_DOT_CLASS,
  ROSTER_ITEM_NAME_CLASS,
} from './AttendanceList.constants'

export default function AttendanceList({
  students,
  activeStudentId,
  onSelectStudent,
  selectedAssignmentTitle,
}: AttendanceListProps) {
  return (
    <aside className={ROSTER_CLASS}>
      <div className={ROSTER_HEADER_CLASS}>
        <span className={ROSTER_HEADER_LEFT_CLASS}>
          <Icon name="users" />
          Students
        </span>
        <span className={LIST_COUNT_CLASS}>{students.length}</span>
      </div>

      {selectedAssignmentTitle && (
        <div className={ROSTER_SUBHEADER_CLASS}>Status for: {selectedAssignmentTitle}</div>
      )}

      <ul className={ROSTER_ITEMS_CLASS}>
        {students.length === 0 ? (
          <li className={ROSTER_EMPTY_CLASS}>No active students in room.</li>
        ) : (
          students.map((student: AttendanceStudent) => {
            const isActive = student.studentId === activeStudentId
            return (
              <li key={student.studentId}>
                <button
                  type="button"
                  onClick={() => onSelectStudent(isActive ? null : student.studentId)}
                  className={classNames(
                    ROSTER_ITEM_BASE_CLASS,
                    isActive ? ROSTER_ITEM_ACTIVE_CLASS : ROSTER_ITEM_IDLE_CLASS,
                  )}
                >
                  <div className={ROSTER_ITEM_LEFT_CLASS}>
                    <span className={ROSTER_ONLINE_DOT_CLASS} title="Active student" />
                    <span className={ROSTER_ITEM_NAME_CLASS}>{student.displayName}</span>
                  </div>

                  {student.assignmentStatus && <StatusBadge status={student.assignmentStatus} />}
                </button>
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}
