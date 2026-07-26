import classNames from 'classnames'
import { TextField } from '@components/TextField'
import type { EntryPortalProps, JoinMode } from './EntryPortal.types.ts'
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
  ENTRY_PORTAL_NAME_INPUT_CLASS,
  ENTRY_PORTAL_TOGGLE_CLASS,
  ENTRY_PORTAL_TOGGLE_BTN_BASE_CLASS,
  ENTRY_PORTAL_TOGGLE_BTN_ACTIVE_CLASS,
  ENTRY_PORTAL_TOGGLE_BTN_IDLE_CLASS,
  ENTRY_PORTAL_FIELD_CLASS,
  ENTRY_PORTAL_FIELD_LABEL_CLASS,
  ENTRY_PORTAL_HINT_CLASS,
  ENTRY_PORTAL_CTA_ROW_CLASS,
  ENTRY_PORTAL_SOLO_BTN_CLASS,
  ENTRY_PORTAL_JOIN_BTN_CLASS,
  ENTRY_PORTAL_FOOTER_CLASS,
  ENTRY_PORTAL_TOGGLE_LABELS,
  ENTRY_PORTAL_SOLO_HINT,
} from './EntryPortal.constants.ts'

const MODES: JoinMode[] = ['join', 'solo']

/**
 * Full-screen "boot" entry — type your name, then join a class or practice
 * solo. Presentational only; the student flow owns the join/solo logic via
 * `src/views/EntryPortal`. Designed to be reused by the teacher gate later.
 */
export default function EntryPortal({
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
}: EntryPortalProps) {
  const hasName = Boolean(name.trim())
  const isJoin = mode === 'join'

  return (
    <main className={ENTRY_PORTAL_SCREEN_CLASS}>
      <div className={ENTRY_PORTAL_GRID_CLASS} />
      <div className={ENTRY_PORTAL_GLOW_CLASS} />
      <div className={ENTRY_PORTAL_SCANLINE_CLASS} />
      <div className={ENTRY_PORTAL_VIGNETTE_CLASS} />

      <header className={ENTRY_PORTAL_HEADER_CLASS}>
        <div className={ENTRY_PORTAL_BRAND_CLASS}>
          <span className={ENTRY_PORTAL_DOT_CLASS} />
          <span>ITU</span>
          <span className="text-foreground/25">/</span>
          <span className="text-foreground/90">BOOTIT</span>
        </div>
      </header>

      <section className={ENTRY_PORTAL_CENTER_CLASS}>
        <h1 className={ENTRY_PORTAL_TITLE_CLASS}>Welcome to bootIT</h1>
        <p className={ENTRY_PORTAL_SUBTITLE_CLASS}>Three days from zero to Java — welcome to ITU.</p>

        <p className={ENTRY_PORTAL_NAME_LABEL_CLASS}>Your name — anything you'd like to be called</p>
        <TextField
          value={name}
          onChange={onNameChange}
          placeholder="e.g. Maria"
          autoFocus
          className={ENTRY_PORTAL_NAME_INPUT_CLASS}
        />

        <div className={ENTRY_PORTAL_TOGGLE_CLASS}>
          {MODES.map((option) => (
            <button
              key={option}
              type="button"
              className={classNames(ENTRY_PORTAL_TOGGLE_BTN_BASE_CLASS, {
                [ENTRY_PORTAL_TOGGLE_BTN_ACTIVE_CLASS]: mode === option,
                [ENTRY_PORTAL_TOGGLE_BTN_IDLE_CLASS]: mode !== option,
              })}
              onClick={() => onModeChange(option)}
            >
              {ENTRY_PORTAL_TOGGLE_LABELS[option]}
            </button>
          ))}
        </div>

        {isJoin ? (
          <div className={ENTRY_PORTAL_FIELD_CLASS}>
            <p className={ENTRY_PORTAL_FIELD_LABEL_CLASS}>Class code</p>
            <TextField value={code} onChange={onCodeChange} placeholder="e.g. ABCD" />
          </div>
        ) : (
          <p className={ENTRY_PORTAL_HINT_CLASS}>{ENTRY_PORTAL_SOLO_HINT}</p>
        )}

        <div className={ENTRY_PORTAL_CTA_ROW_CLASS}>
          {isJoin ? (
            <button
              type="button"
              onClick={onJoin}
              disabled={!hasName || !code.trim() || isJoining}
              className={ENTRY_PORTAL_JOIN_BTN_CLASS}
            >
              {isJoining ? 'Joining…' : 'Join a class'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartSolo}
              disabled={!hasName || isStartingSolo}
              className={ENTRY_PORTAL_SOLO_BTN_CLASS}
            >
              {isStartingSolo ? 'Starting…' : 'Start solo practice'}
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
