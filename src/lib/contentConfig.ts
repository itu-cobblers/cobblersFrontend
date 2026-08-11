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
import bootItDay1Pdf from '@/assets/slides/Boot IT - Day 1.pdf?url'
import bootItDay2Pdf from '@/assets/slides/Boot IT - Day 2.pdf?url'
import bootItDay3Pdf from '@/assets/slides/Boot IT - Day 3.pdf?url'
import bootItDayAll from '@/assets/slides/Boot IT - all.pdf?url'

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
  pdfSrc: bootItDayAll,
  pageLinks: [
    {page: 18, assignmentId: 1 },
    {page: 20, assignmentId: 2 },
    {page: 23, assignmentId: 3 },
    {page: 25, assignmentId: 4 },
    {page: 28, assignmentId: 5 },
    {page: 30, assignmentId: 6 },
    {page: 33, assignmentId: 7 },
    {page: 35, assignmentId: 8 },
    {page: 38, assignmentId: 9 },
    {page: 40, assignmentId: 10 },
    {page: 53, assignmentId: 11 },
    {page: 55, assignmentId: 12 },
    {page: 57, assignmentId: 13 },
    {page: 59, assignmentId: 14 },
    {page: 62, assignmentId: 15 },
    {page: 65, assignmentId: 16 },
    {page: 68, assignmentId: 17 },
    {page: 72, assignmentId: 18 },
    {page: 74, assignmentId: 19 },
    {page: 75, assignmentId: 20 },
    {page: 76, assignmentId: 21 },
    {page: 77, assignmentId: 22 },
    {page: 78, assignmentId: 23 },
    {page: 79, assignmentId: 24 },
    {page: 80, assignmentId: 25 },
    {page: 82, assignmentId: 26 },
    {page: 83, assignmentId: 27 },
    {page: 84, assignmentId: 28 },
    {page: 85, assignmentId: 29 },
    {page: 86, assignmentId: 30 },
    {page: 87, assignmentId: 31 },
    {page: 88, assignmentId: 32 },
    {page: 94, assignmentId: 33 },
    {page: 95, assignmentId: 34 },
    {page: 98, assignmentId: 35 },
    {page: 122, assignmentId: 36 },
    {page: 123, assignmentId: 37 },
    {page: 124, assignmentId: 38 },
    {page: 125, assignmentId: 39 },
  ],
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
    pageLinks: [
      {page: 18, assignmentId: 1 },
      {page: 20, assignmentId: 2 },
      {page: 23, assignmentId: 3 },
      {page: 25, assignmentId: 4 },
      {page: 28, assignmentId: 5 },
      {page: 30, assignmentId: 6 },
      {page: 33, assignmentId: 7 },
      {page: 35, assignmentId: 8 },
      {page: 38, assignmentId: 9 },
      {page: 40, assignmentId: 10 },
    ],
  },
  'day2-2026': {
    pdfSrc: bootItDay2Pdf,
    pageLinks: [
      {page: 13, assignmentId: 11 },
      {page: 15, assignmentId: 12 },
      {page: 17, assignmentId: 13 },
      {page: 19, assignmentId: 14 },
      {page: 22, assignmentId: 15 },
      {page: 25, assignmentId: 16 },
      {page: 28, assignmentId: 17 },
      {page: 32, assignmentId: 18 },
      {page: 34, assignmentId: 19 },
      {page: 35, assignmentId: 20 },
      {page: 36, assignmentId: 21 },
      {page: 37, assignmentId: 22 },
      {page: 38, assignmentId: 23 },
      {page: 39, assignmentId: 24 },
      {page: 40, assignmentId: 25 },
      {page: 42, assignmentId: 26 },
      {page: 43, assignmentId: 27 },
      {page: 44, assignmentId: 28 },
      {page: 45, assignmentId: 29 },
      {page: 46, assignmentId: 30 },
      {page: 47, assignmentId: 31 },
      {page: 48, assignmentId: 32 },
      {page: 54, assignmentId: 33 },
      {page: 55, assignmentId: 34 },
      {page: 58, assignmentId: 35 },
    ],
   },
  'day3-2026': {
    pdfSrc: bootItDay3Pdf,
    pageLinks: [
      {page: 22, assignmentId: 36 },
      {page: 23, assignmentId: 37 },
      {page: 24, assignmentId: 38 },
      {page: 25, assignmentId: 39 },
    ],
  }
}

/** Looks up an assignment set's Content deck; falls back to the Day 1 deck for every set not yet configured above. */
export function getContentConfig(assignmentSetId: string | undefined): ContentSetConfig {
  return (assignmentSetId && CONTENT_BY_ASSIGNMENT_SET[assignmentSetId]) || DEFAULT_CONTENT
}
