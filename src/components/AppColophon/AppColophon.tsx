import {
  COLOPHON_CLASS,
  COLOPHON_LINK_CLASS,
  COLOPHON_SEPARATOR,
  COLOPHON_ORG_URL,
  COLOPHON_LINK_LABEL,
  COLOPHON_CREDIT,
} from './AppColophon.constants'

/**
 * Credit band: the project's GitHub org on the left, the year on the right.
 *
 * `rel="noopener noreferrer"` because it opens in a new tab — without it the
 * opened page can reach back through `window.opener`.
 */
export default function AppColophon() {
  return (
    <footer className={COLOPHON_CLASS}>
      <a
        href={COLOPHON_ORG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={COLOPHON_LINK_CLASS}
      >
        {COLOPHON_LINK_LABEL}
      </a>
      <span aria-hidden="true">{COLOPHON_SEPARATOR}</span>
      <span>{COLOPHON_CREDIT}</span>
    </footer>
  )
}
