export interface JoinRoomBarProps {
  name: string
  code: string
  isJoined: boolean
  /** Shown once joined, e.g. "Joined room ABCD as Maria". */
  joinedLabel: string
  error?: string | null
  onNameChange: (value: string) => void
  onCodeChange: (value: string) => void
  onJoin: () => void
}
