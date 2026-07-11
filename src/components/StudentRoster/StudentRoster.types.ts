export type RosterStatus = 'working' | 'stuck' | 'done'

export interface RosterEntry {
  studentId: string
  displayName: string
  completed: number
  total: number
  currentTitle: string
  status: RosterStatus
}

export interface StudentRosterProps {
  students: RosterEntry[]
}
