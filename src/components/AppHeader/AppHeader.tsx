import classNames from 'classnames'
import atriumImage from '@/assets/itu-atrium.jpg'
import {
  APP_HEADER_CLASS,
  APP_HEADER_IMAGE_CLASS,
  APP_HEADER_BAR_CLASS,
  APP_HEADER_BRAND_CLASS,
  APP_HEADER_BRAND_BOX_CLASS,
  APP_HEADER_BRAND_PREFIX_CLASS,
  APP_HEADER_BRAND_NAME_CLASS,
  APP_HEADER_NAV_CLASS,
  APP_HEADER_BRAND_PREFIX,
  APP_HEADER_BRAND_NAME,
} from './AppHeader.constants'

/**
 * The site header, after itustudent.itu.dk: the ITU atrium photo as a
 * backsplash pinned to the top of the page, with a translucent black bar
 * across the top 74px of it carrying the "ITU | BootIT" lockup.
 *
 * Purely decorative for now — no links, no routing. The nav slot on the right
 * is deliberately empty until the buttons are specified.
 */
export default function AppHeader() {
  return (
    <header className={APP_HEADER_CLASS}>
      <img src={atriumImage} alt="" aria-hidden="true" className={APP_HEADER_IMAGE_CLASS} />

      <div className={APP_HEADER_BAR_CLASS}>
        <span className={APP_HEADER_BRAND_CLASS}>
          <span className={classNames(APP_HEADER_BRAND_BOX_CLASS, APP_HEADER_BRAND_PREFIX_CLASS)}>
            {APP_HEADER_BRAND_PREFIX}
          </span>
          <span className={classNames(APP_HEADER_BRAND_BOX_CLASS, APP_HEADER_BRAND_NAME_CLASS)}>
            {APP_HEADER_BRAND_NAME}
          </span>
        </span>

        <nav className={APP_HEADER_NAV_CLASS} aria-label="Main" />
      </div>
    </header>
  )
}
