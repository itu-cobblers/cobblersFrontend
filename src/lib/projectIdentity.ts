/**
 * projectIdentity.ts — resolves a Day-3 mini-project's original PDF brief.
 *
 * The description panel embeds this PDF directly instead of re-typesetting
 * its text, so every project's own colors/fonts/layout come through exactly
 * as designed — no frontend approximation needed. Keyed by the assignment's
 * `title` (the only stable, student-facing identifier the wire format
 * exposes; `slug` never leaves the server, see SCHEMA.md), since
 * `ProjectAssignment.brief` stays a plain string per CONTRACT.md and never
 * carries a PDF reference itself.
 */
import buildATreePdf from '@/assets/projects/Build_a_Tree.pdf?url'
import grandpasTimeMachinePdf from '@/assets/projects/Grandpas_Time_Machine.pdf?url'
import grandmasKitchenPdf from '@/assets/projects/Grandmas_Blackmarket_Kitchen.pdf?url'
import seatSelectorPdf from '@/assets/projects/Seat Selector.pdf?url'

export interface ProjectIdentity {
  /** Bundled URL to the project's original PDF brief. */
  pdfUrl: string
}

const DEFAULT_IDENTITY: ProjectIdentity = { pdfUrl: '' }

const PROJECT_IDENTITY: Record<string, ProjectIdentity> = {
  'Build a Tree': { pdfUrl: buildATreePdf },
  "Grandpa's Time Machine": { pdfUrl: grandpasTimeMachinePdf },
  "Grandma's Blackmarket Kitchen": { pdfUrl: grandmasKitchenPdf },
  'Seat Selector': { pdfUrl: seatSelectorPdf },
}

/** Looks up a project's visual identity by assignment title; falls back to a neutral default. */
export function getProjectIdentity(title: string): ProjectIdentity {
  return PROJECT_IDENTITY[title] ?? DEFAULT_IDENTITY
}
