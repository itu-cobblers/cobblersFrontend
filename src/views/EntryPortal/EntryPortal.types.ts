export type JoinMode = 'join' | 'solo'

import type { AssignmentSet } from '@types'

export interface EntryPortalProps {
  onJoinSuccess: (roomCode: string, displayName: string, set: AssignmentSet) => void
  onSoloSuccess: (set: AssignmentSet) => void
  onError: (message: string) => void
}