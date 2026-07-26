import type { ToolbarProps } from './Toolbar.types'
import { TOOLBAR_CLASS, TOOLBAR_FOLLOWING_CLASS, TOOLBAR_FOLLOWING_DOT_CLASS } from './Toolbar.constants'

/**
 * The thin status strip above the workspace: only whether the student is on
 * the same assignment the teacher is currently focused on. Session identity
 * ("Room: XXXX" / "Solo practice" + "Signed in as …") now lives in the
 * ProblemsList rail; Run/Submit live next to the code editor and terminal;
 * Leave/My Progress live in the rail's bottom tabs.
 */
export default function Toolbar({ isFollowingTeacher }: ToolbarProps) {
  return (
    <header className={TOOLBAR_CLASS}>
      {isFollowingTeacher && (
        <span className={TOOLBAR_FOLLOWING_CLASS}>
          <span className={TOOLBAR_FOLLOWING_DOT_CLASS} aria-hidden="true" />
          following teacher
        </span>
      )}
    </header>
  )
}
