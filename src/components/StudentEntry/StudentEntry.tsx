import classNames from 'classnames'
import { TextField } from '@components/TextField'
import { Button } from '@components/Button'
import type { StudentEntryProps, JoinMode } from './StudentEntry.types'
import {
  ENTRY_SCREEN_CLASS,
  ENTRY_CARD_CLASS,
  ENTRY_TITLE_CLASS,
  ENTRY_SUBTITLE_CLASS,
  ENTRY_FIELD_CLASS,
  ENTRY_FIELD_LABEL_CLASS,
  ENTRY_TOGGLE_CLASS,
  ENTRY_TOGGLE_BTN_BASE_CLASS,
  ENTRY_TOGGLE_BTN_ACTIVE_CLASS,
  ENTRY_TOGGLE_BTN_IDLE_CLASS,
  ENTRY_HINT_CLASS,
  ENTRY_TOGGLE_LABELS,
  SOLO_MODE_HINT,
} from './StudentEntry.constants'

const MODES: JoinMode[] = ['join', 'solo']

export default function StudentEntry({
  name,
  code,
  mode,
  isJoining,
  isStartingSolo,
  onNameChange,
  onCodeChange,
  onModeChange,
  onJoin,
  onStartSolo,
}: StudentEntryProps) {
  const hasName = Boolean(name.trim())
  const isJoin = mode === 'join'

  return (
    <div className={ENTRY_SCREEN_CLASS}>
      <div className={ENTRY_CARD_CLASS}>
        <div>
          <h1 className={ENTRY_TITLE_CLASS}>Welcome to bootIT</h1>
          <p className={ENTRY_SUBTITLE_CLASS}>Three days from zero to Java — welcome to ITU.</p>
        </div>

        <label className={ENTRY_FIELD_CLASS}>
          <span className={ENTRY_FIELD_LABEL_CLASS}>Your name</span>
          <TextField value={name} onChange={onNameChange} placeholder="e.g. Maria" autoFocus />
        </label>

        <div className={ENTRY_TOGGLE_CLASS}>
          {MODES.map((option) => (
            <button
              key={option}
              type="button"
              className={classNames(ENTRY_TOGGLE_BTN_BASE_CLASS, {
                [ENTRY_TOGGLE_BTN_ACTIVE_CLASS]: mode === option,
                [ENTRY_TOGGLE_BTN_IDLE_CLASS]: mode !== option,
              })}
              onClick={() => onModeChange(option)}
            >
              {ENTRY_TOGGLE_LABELS[option]}
            </button>
          ))}
        </div>

        {isJoin ? (
          <>
            <label className={ENTRY_FIELD_CLASS}>
              <span className={ENTRY_FIELD_LABEL_CLASS}>Class code</span>
              <TextField value={code} onChange={onCodeChange} placeholder="e.g. ABCD" />
            </label>
            <Button onClick={onJoin} isLoading={isJoining} isDisabled={!hasName || !code.trim()}>
              Join a class
            </Button>
          </>
        ) : (
          <>
            <p className={ENTRY_HINT_CLASS}>{SOLO_MODE_HINT}</p>
            <Button onClick={onStartSolo} isLoading={isStartingSolo} isDisabled={!hasName}>
              Start solo practice
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
