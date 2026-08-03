import {
  COLOPHON_CLASS,
  COLOPHON_LINK_CLASS,
  COLOPHON_SEPARATOR,
  COLOPHON_ORG_URL,
  COLOPHON_LINK_LABEL,
  COLOPHON_CREDIT_PREFIX,
  COLOPHON_CREDIT_SUFFIX,
  COLOPHON_TEAM,
} from './AppColophon.constants'
import { getTeamNameSeparator } from './AppColophon.utils'

/**
 * Credit band: the project's GitHub org on the left, a credit sentence naming
 * each team member (linked to their own GitHub) on the right.
 *
 * `rel="noopener noreferrer"` because these open in a new tab — without it the
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
      <span>
        {COLOPHON_CREDIT_PREFIX}{' '}
        {COLOPHON_TEAM.map((member, index) => (
          <span key={member.url}>
            <a
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className={COLOPHON_LINK_CLASS}
            >
              {member.name}
            </a>
            {getTeamNameSeparator(index)}
          </span>
        ))}{' '}
        {COLOPHON_CREDIT_SUFFIX}
      </span>
    </footer>
  )
}
