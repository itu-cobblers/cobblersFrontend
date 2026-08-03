import {
  APP_FOOTER_CLASS,
  APP_FOOTER_ADDRESS_CLASS,
  APP_FOOTER_BRAND_CLASS,
  APP_FOOTER_ADDRESS,
  APP_FOOTER_BRAND,
} from './AppFooter.constants'

/**
 * The ITU page footer, after itustudent.itu.dk — address left, university name
 * in a black box right, on a 70px grey band.
 *
 * Purely decorative: no links, no routing.
 */
export default function AppFooter() {
  return (
    <footer className={APP_FOOTER_CLASS}>
      <span className={APP_FOOTER_ADDRESS_CLASS}>{APP_FOOTER_ADDRESS}</span>
      <span className={APP_FOOTER_BRAND_CLASS}>{APP_FOOTER_BRAND}</span>
    </footer>
  )
}
