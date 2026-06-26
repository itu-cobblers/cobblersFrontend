import type { ExecuteRequest, ExecuteResult } from '@types'
import { mockExecute } from './mockApi' // MOCK: remove with the fallback branch below

/**
 * Calls the executor backend. This is the single seam between the UI and the
 * `POST /api/execute` endpoint defined in CONTRACT.md.
 *
 *   request:  { code? } | { files, entryClass }, optional stdin
 *   response: { status, stdout, stderr }
 */
export async function executeCode(request: ExecuteRequest): Promise<ExecuteResult> {
  try {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch (err) {
    // ─────────────── MOCK FALLBACK — remove when the backend is ready ───────────────
    // Delete this catch block, the `mockExecute` import above, and mockApi.ts.
    const reason = err instanceof Error ? err.message : String(err)
    console.warn('[execute] backend unavailable, using mock:', reason)
    return mockExecute()
    // ──────────────────────────── END MOCK FALLBACK ─────────────────────────────────
  }
}
