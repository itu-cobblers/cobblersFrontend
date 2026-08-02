import { Modal } from '@components/Modal'
import type { RoomCodeModalProps } from './RoomCodeModal.types'
import {
  ROOM_CODE_MODAL_CLASS,
  ROOM_CODE_MODAL_LABEL_CLASS,
  ROOM_CODE_MODAL_VALUE_CLASS,
  ROOM_CODE_MODAL_HINT_CLASS,
  ROOM_CODE_MODAL_LABEL,
  ROOM_CODE_MODAL_HINT,
} from './RoomCodeModal.constants'

/** Blows the room code up front and centre so a room full of students can read it. */
export default function RoomCodeModal({ isOpen, onClose, sessionCode }: RoomCodeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={ROOM_CODE_MODAL_CLASS}>
        <span className={ROOM_CODE_MODAL_LABEL_CLASS}>{ROOM_CODE_MODAL_LABEL}</span>
        <span className={ROOM_CODE_MODAL_VALUE_CLASS}>{sessionCode}</span>
        <span className={ROOM_CODE_MODAL_HINT_CLASS}>{ROOM_CODE_MODAL_HINT}</span>
      </div>
    </Modal>
  )
}
