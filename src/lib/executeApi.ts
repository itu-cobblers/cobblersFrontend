import type { ExecuteRequest, ExecuteResult } from '@types'

/**
 * Calls the executor backend. This is the single seam between the UI and the
 * `POST /api/execute` endpoint defined in CONTRACT.md.
 *
 *   request:  { code? } | { files, entryClass }, optional stdin
 *   response: { status, stdout, stderr }
 */
export async function executeCode(request: ExecuteRequest): Promise<ExecuteResult> {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}
