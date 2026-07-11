export type JoinMode = 'join' | 'solo'

export interface StudentEntryProps {
  name: string
  code: string
  /** Which form is showing — join-a-class, or solo practice. */
  mode: JoinMode
  /** True while the join request is in flight. */
  isJoining: boolean
  /** True while the solo-practice request is in flight. */
  isStartingSolo: boolean
  onNameChange: (value: string) => void
  onCodeChange: (value: string) => void
  onModeChange: (mode: JoinMode) => void
  onJoin: () => void
  onStartSolo: () => void
}
