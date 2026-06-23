import { useState } from 'react'
import { executeCode } from '../lib/executeApi'

/**
 * Owns the "run code" lifecycle and its terminal state.
 *
 * Returns:
 *  - output, status, isRunning — what OutputPanel/Toolbar render
 *  - run(code)      → executes, updates the terminal, returns the raw response
 *                     ({ status, stdout, stderr }) so the caller can grade it,
 *                     or null on error.
 *  - showResult(r)  → mirror an external result (e.g. a submission) in the
 *                     same terminal without re-running.
 */
export function useExecutor() {
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'compile_error' | 'runtime_error'
  const [isRunning, setIsRunning] = useState(false)

  function render(result) {
    setStatus(result.status)
    setOutput((result.stdout?.trim() ? result.stdout : result.stderr) || '(no output)')
  }

  async function run(code) {
    setIsRunning(true)
    setOutput('Running…')
    setStatus(null)
    try {
      // Contract response: { status, stdout, stderr } — see CONTRACT.md.
      const data = await executeCode(code)
      render(data)
      return data
    } catch (err) {
      setOutput(`Error: ${err.message}`)
      setStatus('runtime_error')
      return null
    } finally {
      setIsRunning(false)
    }
  }

  return { output, status, isRunning, run, showResult: render }
}
