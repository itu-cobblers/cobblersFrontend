import { mockExecute } from './mockApi' // MOCK: remove with the fallback branch below

/**
 * Calls the executor backend. This is the single seam between the UI and the
 * `POST /api/execute` endpoint defined in CONTRACT.md:
 *
 *   request:  { code }
 *   response: { status: 'success' | 'compile_error' | 'runtime_error',
 *               stdout: string, stderr: string }
 *
 * @param {string} code  full Java source (single class)
 * @returns {Promise<{ status: string, stdout: string, stderr: string }>}
 */
export async function executeCode(code) {
  try {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch (err) {
    // ─────────────── MOCK FALLBACK — remove when the backend is ready ───────────────
    // Delete this catch block, the `mockExecute` import above, and mockExecute.js.
    // Then a backend outage surfaces as a real error instead of fake output.
    console.warn('[execute] backend unavailable, using mock:', err.message)
    return mockExecute()
    // ──────────────────────────── END MOCK FALLBACK ─────────────────────────────────
  }
}
