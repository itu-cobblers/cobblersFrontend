/**
 * contentConfig.ts — hand-maintained map from an assignment set to the
 * teaching deck that backs its Content tab, and from that deck's pages to
 * the assignments they introduce.
 *
 * Keyed by `assignmentSetId` (the id the backend hands back with an
 * `AssignmentSet`); `default` covers every set until a real entry is added
 * below for it. `pageLinks` powers the two-way jump between Content and
 * Practice ("Try this now" / "Go to slide to learn more") — add one entry
 * per page that should link to an assignment; pages with no entry are
 * theory-only and link nowhere.
 */
import bootItDay1Pdf from '@/assets/slides/Boot IT - Day 1 .pdf?url'
import bootItDay2Pdf from '@/assets/slides/Boot IT - Day 2 .pdf?url'
import bootItDay3Pdf from '@/assets/slides/Boot IT - Day 3 .pdf?url'

export interface ContentPageLink {
  /** 1-indexed page number in the PDF. */
  page: number
  assignmentId: number
}

export interface ContentSetConfig {
  pdfSrc: string
  pageLinks: ContentPageLink[]
}

const DEFAULT_CONTENT: ContentSetConfig = {
  pdfSrc: bootItDay1Pdf,
  // e.g. { page: 12, assignmentId: 101 } — fill in once real assignment ids are known.
  pageLinks: [],
}

const CONTENT_BY_ASSIGNMENT_SET: Record<string, ContentSetConfig> = {
  // Every assignment set uses the Day 1 deck for now — add a real entry per
  // `assignmentSetId` as more decks are produced, e.g.:
  // 'day-2-assignment-set-id': {
  //   pdfSrc: bootItDay2Pdf,
  //   pageLinks: [{ page: 12, assignmentId: 205 }],
  // },
  'day1-2026': {
    pdfSrc: bootItDay1Pdf,
    pageLinks: [{
      page: 3, assignmentId: 1
    }],
  },
  'day2-2026': {
     pdfSrc: bootItDay2Pdf,
     pageLinks: [{
       page: 12, assignmentId: 11
     }],
   },
  'day3-2026': {
    pdfSrc: bootItDay3Pdf,
    pageLinks: [{
      page: 12, assignmentId: 33
    }],
  }
}

/** Looks up an assignment set's Content deck; falls back to the Day 1 deck for every set not yet configured above. */
export function getContentConfig(assignmentSetId: string | undefined): ContentSetConfig {
  return (assignmentSetId && CONTENT_BY_ASSIGNMENT_SET[assignmentSetId]) || DEFAULT_CONTENT
}
