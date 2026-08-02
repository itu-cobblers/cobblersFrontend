import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type { AttendanceListProps, AttendanceStudent } from './AttendanceList.types'
import {StatusBadge} from "@/components";

export default function AttendanceList({
  students,
  activeStudentId,
  onSelectStudent,
  selectedAssignmentTitle,
}: AttendanceListProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden rounded-md border border-divider bg-card">
      {/* Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-divider px-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-bold">
          <Icon name="book" /> Students
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground/70">
          {students.length}
        </span>
      </div>

      {/* Subheader / contextual status */}
      {selectedAssignmentTitle && (
        <div className="border-b border-border bg-accent/10 px-3 py-1.5 text-[11px] text-accent font-medium truncate">
          Status for: {selectedAssignmentTitle}
        </div>
      )}

      {/* Student List */}
      <ul className="min-h-0 flex-1 overflow-y-auto py-2 scrollbar-hide">
        {students.length === 0 ? (
          <li className="px-4 py-8 text-center text-xs text-muted-foreground">
            No active students in room.
          </li>
        ) : (
          students.map((student: AttendanceStudent) => {
            const isActive = student.studentId === activeStudentId
            return (
              <li key={student.studentId}>
                <button
                  type="button"
                  onClick={() => onSelectStudent(isActive ? null : student.studentId)}
                  className={classNames(
                    'group relative flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors',
                    isActive ? 'bg-black/[0.08] text-foreground' : 'text-muted-foreground hover:bg-black/[0.04] hover:text-foreground',
                  )}
                >
                  {isActive && <span className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-accent" />}

                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" title="Active student" />
                    <span className="truncate text-[13px] font-medium text-foreground">
                      {student.displayName}
                    </span>
                  </div>

                  {student.assignmentStatus && (
                    <StatusBadge status={student.assignmentStatus} />
                  )}
                </button>
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}
