import { useState } from 'react'
import type { ExecuteRequest, ExecuteResult, ExecuteStatus } from '@types'
import { executeCode } from '@lib/executeApi'

export interface UseExecutor {
  output: string
  status: ExecuteStatus | null
  isRunning: boolean
  /** Execute a request, update the terminal, and return the raw response (or null on error). */
  run: (request: ExecuteRequest) => Promise<ExecuteResult | null>
  /** Mirror an external result (e.g. a submission) in the terminal without re-running. */
  showResult: (result: ExecuteResult) => void
  /** Clear the terminal (e.g. when switching assignments). */
  reset: () => void
}

/**
 * Owns the "run code" lifecycle and its terminal state. See CONTRACT.md for the
 * `{ status, stdout, stderr }` response shape.
 */
export function useExecutor(): UseExecutor {
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<ExecuteStatus | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  function render(result: ExecuteResult) {
    setStatus(result.status)
    setOutput((result.stdout?.trim() ? result.stdout : result.stderr) || '(no output)')
  }

  function reset() {
    setOutput('')
    setStatus(null)
  }

  async function run(request: ExecuteRequest): Promise<ExecuteResult | null> {
    setIsRunning(true)
    setOutput('Running…')
    setStatus(null)
    try {
      const data = await executeCode(request)
      render(data)
      return data
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err)
      setOutput(`Error: ${reason}`)
      setStatus('runtime_error')
      return null
    } finally {
      setIsRunning(false)
    }
  }

  return { output, status, isRunning, run, showResult: render, reset }
}
