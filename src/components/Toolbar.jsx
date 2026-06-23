export default function Toolbar({ onRun, isRunning, onSubmit, isSubmitting, onToggleSidebar, subtitle }) {
  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <button
          className="fold-btn"
          onClick={onToggleSidebar}
          title="Toggle task panel"
          aria-label="Toggle task panel"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="1" y1="3" x2="13" y2="3" />
            <line x1="1" y1="7" x2="13" y2="7" />
            <line x1="1" y1="11" x2="13" y2="11" />
          </svg>
        </button>
        <span className="logo">bootIT</span>
        {subtitle && <span className="logo-sub">{subtitle}</span>}
        <span className="lang-badge">Java</span>
      </div>
      <div className="toolbar-right">
        {/* Run = execute only (no submit) */}
        <button
          className="icon-btn run-icon-btn"
          onClick={onRun}
          disabled={isRunning || isSubmitting}
          title="Run code"
          aria-label="Run code"
        >
          {isRunning ? (
            <span className="spinner spinner-accent" />
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor">
              <polygon points="2,1 13,7 2,13" />
            </svg>
          )}
        </button>
        {/* Submit = confirm, then send to teacher */}
        <button className="run-btn" onClick={onSubmit} disabled={isRunning || isSubmitting}>
          {isSubmitting && <span className="spinner" />}
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </header>
  )
}
