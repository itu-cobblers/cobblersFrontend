import classNames from 'classnames'
import { Icon } from '@components/Icon'
import atriumImage from '@/assets/itu-atrium.jpg'
import type { AppHeaderProps } from './AppHeader.types'
import {
  APP_HEADER_CLASS,
  APP_HEADER_BAND_CLASS,
  APP_HEADER_IMAGE_CLASS,
  APP_HEADER_BAR_CLASS,
  APP_HEADER_BAR_SIZE_CLASS,
  APP_HEADER_BRAND_ROW_CLASS,
  APP_HEADER_BRAND_CLASS,
  APP_HEADER_BRAND_BOX_CLASS,
  APP_HEADER_BRAND_BOX_SIZE_CLASS,
  APP_HEADER_BRAND_PREFIX_CLASS,
  APP_HEADER_BRAND_NAME_CLASS,
  APP_HEADER_SECTION_CLASS,
  APP_HEADER_SEPARATOR_CLASS,
  APP_HEADER_SECTION_NAME_CLASS,
  APP_HEADER_NAV_CLASS,
  APP_HEADER_CHIP_CLASS,
  APP_HEADER_SESSION_NAME_CLASS,
  APP_HEADER_SESSION_NAME_STRONG_CLASS,
  APP_HEADER_ACTION_CLASS,
  APP_HEADER_BRAND_PREFIX,
  APP_HEADER_BRAND_NAME,
} from './AppHeader.constants'

/**
 * The site header, after itustudent.itu.dk: the ITU atrium photo behind a
 * translucent black bar carrying the "ITU | BootIT" lockup.
 *
 * `hero` is the entry portal's 261px backsplash, where the photo below the bar
 * stays clear. `bar` is the 40px chrome strip used above the workspace — the
 * bar fills the band, so all that shows through is the top slice of the photo.
 *
 * Purely decorative: no links, no routing. The nav slot on the right is
 * deliberately empty until the buttons are specified.
 */
export default function AppHeader({
  variant = 'hero',
  section,
  sessionLabel,
  displayName,
  onLeaveSession,
  leaveLabel,
}: AppHeaderProps) {
  const boxClass = classNames(APP_HEADER_BRAND_BOX_CLASS, APP_HEADER_BRAND_BOX_SIZE_CLASS[variant])

  return (
    <header className={classNames(APP_HEADER_CLASS, APP_HEADER_BAND_CLASS[variant])}>
      <img src={atriumImage} alt="" aria-hidden="true" className={APP_HEADER_IMAGE_CLASS} />

      <div className={classNames(APP_HEADER_BAR_CLASS, APP_HEADER_BAR_SIZE_CLASS[variant])}>
        <div className={APP_HEADER_BRAND_ROW_CLASS}>
          <span className={APP_HEADER_BRAND_CLASS}>
            <span className={classNames(boxClass, APP_HEADER_BRAND_PREFIX_CLASS)}>
              {APP_HEADER_BRAND_PREFIX}
            </span>
            <span className={classNames(boxClass, APP_HEADER_BRAND_NAME_CLASS)}>
              {APP_HEADER_BRAND_NAME}
            </span>
          </span>

          {section && (
            <span className={APP_HEADER_SECTION_CLASS}>
              <span className={APP_HEADER_SEPARATOR_CLASS} aria-hidden="true">
                /
              </span>
              <span className={APP_HEADER_SECTION_NAME_CLASS}>{section}</span>
            </span>
          )}
        </div>

        <nav className={APP_HEADER_NAV_CLASS} aria-label="Main">
          {sessionLabel && <span className={APP_HEADER_CHIP_CLASS}>{sessionLabel}</span>}
          {displayName && (
            <span className={classNames(APP_HEADER_CHIP_CLASS, APP_HEADER_SESSION_NAME_CLASS)}>
              Signed in as <span className={APP_HEADER_SESSION_NAME_STRONG_CLASS}>{displayName}</span>
            </span>
          )}
          {onLeaveSession && (
            <button
              type="button"
              onClick={onLeaveSession}
              className={classNames(APP_HEADER_CHIP_CLASS, APP_HEADER_ACTION_CLASS)}
            >
              <Icon name="logout" />
              <span>{leaveLabel}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
