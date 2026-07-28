import { type ChangeEvent, type SyntheticEvent } from 'react'
import classNames from 'classnames'
import { DISPLAY_NAME_MAX_LENGTH } from '@lib/identity'
import { Icon } from '@components/Icon'
import type { EntryPortalProps } from './EntryPortal.types.ts'
import { useNameCaret } from './EntryPortal.hooks.ts'
import {
  ENTRY_PORTAL_SCREEN_CLASS,
  ENTRY_PORTAL_GRID_CLASS,
  ENTRY_PORTAL_GLOW_CLASS,
  ENTRY_PORTAL_SCANLINE_CLASS,
  ENTRY_PORTAL_VIGNETTE_CLASS,
  ENTRY_PORTAL_HEADER_CLASS,
  ENTRY_PORTAL_BRAND_CLASS,
  ENTRY_PORTAL_DOT_CLASS,
  ENTRY_PORTAL_CENTER_CLASS,
  ENTRY_PORTAL_TITLE_CLASS,
  ENTRY_PORTAL_SUBTITLE_CLASS,
  ENTRY_PORTAL_NAME_LABEL_CLASS,
  ENTRY_PORTAL_NAME_ROW_CLASS,
  ENTRY_PORTAL_NAME_MEASURE_CLASS,
  ENTRY_PORTAL_NAME_INPUT_CLASS,
  ENTRY_PORTAL_NAME_MIRROR_CLASS,
  ENTRY_PORTAL_CARET_CLASS,
  ENTRY_PORTAL_CTA_ROW_CLASS,
  ENTRY_PORTAL_SOLO_BTN_CLASS,
  ENTRY_PORTAL_JOIN_BTN_CLASS,
  ENTRY_PORTAL_JOIN_BTN_CODE_CLASS,
  ENTRY_PORTAL_NO_SESSION_ROW_CLASS,
  ENTRY_PORTAL_REFRESH_BTN_CLASS,
  ENTRY_PORTAL_FOOTER_CLASS,
  ENTRY_PORTAL_NO_SESSION_LABEL,
  ENTRY_PORTAL_CHECKING_LABEL,
} from './EntryPortal.constants.ts'

/**
 * Full-screen "boot" entry — type your name, then either join today's
 * session with one click (no code to type — see `todayLatestSessionCode`)
 * or start solo practice. Presentational only; the student flow owns the
 * join/solo logic via `src/views/StudentView/useStudentSession`.
 */
export default function EntryPortal({
  name,
  isReturningStudent,
  todayLatestSessionCode,
  isJoining,
  isStartingSolo,
  onNameChange,
  onJoinToday,
  onStartSolo,
  onRefreshTodayLatestSession,
}: EntryPortalProps) {
  const hasName = Boolean(name.trim())
  const isCheckingSession = todayLatestSessionCode === undefined
  const canJoinToday = hasName && !isCheckingSession && todayLatestSessionCode !== null && !isJoining
  const { inputRef, mirrorRef, caretLeft, isActive, handleCaretSync } = useNameCaret(name)

  function handleNameInputChange(event: ChangeEvent<HTMLInputElement>) {
    onNameChange(event.target.value)
    handleCaretSync(event)
  }

  function handleNameInputCaretEvent(event: SyntheticEvent<HTMLInputElement>) {
    handleCaretSync(event)
  }

  return (
    <main className={ENTRY_PORTAL_SCREEN_CLASS}>
      <div className={ENTRY_PORTAL_GRID_CLASS} />
      <div className={ENTRY_PORTAL_GLOW_CLASS} />
      <div className={ENTRY_PORTAL_SCANLINE_CLASS} />
      <div className={ENTRY_PORTAL_VIGNETTE_CLASS} />

      <header className={ENTRY_PORTAL_HEADER_CLASS}>
        <div className={ENTRY_PORTAL_BRAND_CLASS}>
          <span className={ENTRY_PORTAL_DOT_CLASS} />
          <span>IT University of Copenhagen</span>
        </div>
      </header>

      <section className={ENTRY_PORTAL_CENTER_CLASS}>
        <h1 className={ENTRY_PORTAL_TITLE_CLASS}>
          {isReturningStudent && name.trim() ? `Welcome to BootIT, ${name.trim()}` : 'Welcome to BootIT'}
        </h1>
        <p className={ENTRY_PORTAL_SUBTITLE_CLASS}>Your first step in programming</p>

        <p className={ENTRY_PORTAL_NAME_LABEL_CLASS}>Please type anything you'd like to be called</p>
        <div className={ENTRY_PORTAL_NAME_ROW_CLASS}>
          <span className={ENTRY_PORTAL_NAME_MEASURE_CLASS}>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={handleNameInputChange}
              onSelect={handleNameInputCaretEvent}
              onClick={handleNameInputCaretEvent}
              onKeyUp={handleNameInputCaretEvent}
              onFocus={handleNameInputCaretEvent}
              aria-label="Your name"
              maxLength={DISPLAY_NAME_MAX_LENGTH}
              autoFocus
              className={ENTRY_PORTAL_NAME_INPUT_CLASS}
            />
            <span ref={mirrorRef} className={ENTRY_PORTAL_NAME_MIRROR_CLASS} aria-hidden="true" />
            <span
              className={classNames(ENTRY_PORTAL_CARET_CLASS, { 'is-typing': isActive, 'is-empty': !hasName })}
              style={{ transform: `translate(${caretLeft}px, -50%)` }}
              aria-hidden="true"
            />
          </span>
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
      </section>

      <footer className={ENTRY_PORTAL_FOOTER_CLASS}>
        <span>&gt; boot.itu --ready</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          connected
        </span>
      </footer>
    </main>
  )
}
