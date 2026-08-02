import { type ChangeEvent } from 'react'
import { DISPLAY_NAME_MAX_LENGTH } from '@lib/identity'
import { Icon } from '@components/Icon'
import { AppHeader } from '@components/AppHeader'
import type { EntryPortalProps } from './EntryPortal.types.ts'
import { useEntryPortal } from './EntryPortal.hooks.ts'
import {
  ENTRY_PORTAL_SCREEN_CLASS,
  ENTRY_PORTAL_BACKDROP_CLASS,
  ENTRY_PORTAL_SCRIM_CLASS,
  ENTRY_PORTAL_CENTER_CLASS,
  ENTRY_PORTAL_CARD_CLASS,
  ENTRY_PORTAL_TITLE_CLASS,
  ENTRY_PORTAL_BODY_CLASS,
  ENTRY_PORTAL_NAME_ROW_CLASS,
  ENTRY_PORTAL_NAME_INPUT_CLASS,
  ENTRY_PORTAL_CTA_ROW_CLASS,
  ENTRY_PORTAL_SOLO_BTN_CLASS,
  ENTRY_PORTAL_JOIN_BTN_CLASS,
  ENTRY_PORTAL_JOIN_BTN_CODE_CLASS,
  ENTRY_PORTAL_NO_SESSION_ROW_CLASS,
  ENTRY_PORTAL_REFRESH_BTN_CLASS,
  ENTRY_PORTAL_NO_SESSION_LABEL,
  ENTRY_PORTAL_CHECKING_LABEL,
  ENTRY_PORTAL_TITLE,
  ENTRY_PORTAL_INTRO,
  ENTRY_PORTAL_NAME_PLACEHOLDER,
} from './EntryPortal.constants.ts'

export default function EntryPortal({
                                      onJoinSuccess,
                                      onSoloSuccess,
                                      onError,
                                    }: EntryPortalProps) {
  const {
    name,
    todayLatestSessionCode,
    isJoining,
    isStartingSolo,
    onNameChange,
    onJoinToday,
    onStartSolo,
    onRefreshTodayLatestSession,
  } = useEntryPortal({ onJoinSuccess, onSoloSuccess, onError })

  const hasName = Boolean(name.trim())
  const isCheckingSession = todayLatestSessionCode === undefined
  const canJoinToday = hasName && !isCheckingSession && todayLatestSessionCode !== null && !isJoining
  function handleNameInputChange(event: ChangeEvent<HTMLInputElement>) {
    onNameChange(event.target.value)
  }

  return (
    <main className={ENTRY_PORTAL_SCREEN_CLASS}>
      <div className={ENTRY_PORTAL_SCRIM_CLASS} />

      <div className={ENTRY_PORTAL_BACKDROP_CLASS}>
        <AppHeader />
      </div>

      <section className={ENTRY_PORTAL_CENTER_CLASS}>
        <div className={ENTRY_PORTAL_CARD_CLASS}>
          <h1 className={ENTRY_PORTAL_TITLE_CLASS}>{ENTRY_PORTAL_TITLE}</h1>
          <p className={ENTRY_PORTAL_BODY_CLASS}>{ENTRY_PORTAL_INTRO}</p>

          <div className={ENTRY_PORTAL_NAME_ROW_CLASS}>
            <input
              type="text"
              value={name}
              onChange={handleNameInputChange}
              aria-label="Your name"
              placeholder={ENTRY_PORTAL_NAME_PLACEHOLDER}
              maxLength={DISPLAY_NAME_MAX_LENGTH}
              autoFocus
              className={ENTRY_PORTAL_NAME_INPUT_CLASS}
            />
          </div>

          <div className={ENTRY_PORTAL_CTA_ROW_CLASS}>
            <button
              type="button"
              onClick={onStartSolo}
              disabled={!hasName || isStartingSolo}
              className={ENTRY_PORTAL_SOLO_BTN_CLASS}
            >
              {isStartingSolo ? 'Starting…' : 'Solo Practice'}
            </button>
            {!isCheckingSession && todayLatestSessionCode === null ? (
              <div className={ENTRY_PORTAL_NO_SESSION_ROW_CLASS}>
                <span>{ENTRY_PORTAL_NO_SESSION_LABEL}</span>
                <button
                  type="button"
                  onClick={onRefreshTodayLatestSession}
                  aria-label="Check again for a session"
                  title="Check again for a session"
                  className={ENTRY_PORTAL_REFRESH_BTN_CLASS}
                >
                  <Icon name="refresh" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onJoinToday}
                disabled={!canJoinToday}
                className={ENTRY_PORTAL_JOIN_BTN_CLASS}
              >
                {isJoining ? (
                  'Joining…'
                ) : isCheckingSession ? (
                  ENTRY_PORTAL_CHECKING_LABEL
                ) : (
                  <>
                    Join current Session{' '}
                    <span className={ENTRY_PORTAL_JOIN_BTN_CODE_CLASS}>{todayLatestSessionCode}</span>{' '}
                    <span aria-hidden="true">&rarr;</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

    </main>
  )
}