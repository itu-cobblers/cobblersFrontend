import { AppHeader } from '@components/AppHeader'
import { AppFooter } from '@components/AppFooter'
import type { PortalShellProps } from './PortalShell.types'
import {
  PORTAL_SCREEN_CLASS,
  PORTAL_BACKDROP_CLASS,
  PORTAL_SCRIM_CLASS,
  PORTAL_CENTER_CLASS,
  PORTAL_CARD_CLASS,
} from './PortalShell.constants'

/**
 * The page every student and teacher sees before they reach a workspace.
 * Owns the chrome so the entry portal, the teacher gate and session creation
 * differ only in what sits inside the card.
 */
export default function PortalShell({ children }: PortalShellProps) {
  return (
    <main className={PORTAL_SCREEN_CLASS}>
      <div className={PORTAL_SCRIM_CLASS} />

      <div className={PORTAL_BACKDROP_CLASS}>
        <AppHeader />
      </div>

      <section className={PORTAL_CENTER_CLASS}>
        <div className={PORTAL_CARD_CLASS}>{children}</div>
      </section>

      <AppFooter />
    </main>
  )
}
