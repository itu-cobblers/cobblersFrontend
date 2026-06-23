const STATUS_LABEL = {
  success: 'Success',
  compile_error: 'Compile error',
  runtime_error: 'Runtime error',
}

export default function OutputPanel({ output, status }) {
  const isError = status === 'compile_error' || status === 'runtime_error'
  return (
    <div className="output-panel">
      <div className="output-header">
        <span>Terminal</span>
        {status && (
          <span className={`output-status ${isError ? 'is-error' : 'is-success'}`}>
            {STATUS_LABEL[status] ?? status}
          </span>
        )}
      </div>
      <pre className={`output-content ${isError ? 'is-error' : ''}`}>
        {output || <span className="output-placeholder">Press Run to see your output…</span>}
      </pre>
    </div>
  )
}
