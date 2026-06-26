import { TextField } from '@components/TextField'
import { Button } from '@components/Button'
import type { JoinRoomBarProps } from './JoinRoomBar.types'
import {
  JOIN_BAR_CLASS,
  JOIN_LABEL_CLASS,
  JOIN_JOINED_CLASS,
  JOIN_ERROR_CLASS,
  JOIN_NAME_INPUT_CLASS,
  JOIN_CODE_INPUT_CLASS,
} from './JoinRoomBar.constants'

export default function JoinRoomBar({
  name,
  code,
  isJoined,
  joinedLabel,
  error,
  onNameChange,
  onCodeChange,
  onJoin,
}: JoinRoomBarProps) {
  if (isJoined) {
    return (
      <div className={JOIN_BAR_CLASS}>
        <span className={JOIN_JOINED_CLASS}>{joinedLabel}</span>
      </div>
    )
  }

  return (
    <div className={JOIN_BAR_CLASS}>
      <span className={JOIN_LABEL_CLASS}>Join your class room:</span>
      <TextField value={name} onChange={onNameChange} placeholder="Your name" className={JOIN_NAME_INPUT_CLASS} />
      <TextField value={code} onChange={onCodeChange} placeholder="Room code" className={JOIN_CODE_INPUT_CLASS} />
      <Button onClick={onJoin} isDisabled={!name.trim() || !code.trim()}>
        Join
      </Button>
      {error && <span className={JOIN_ERROR_CLASS}>{error}</span>}
    </div>
  )
}
