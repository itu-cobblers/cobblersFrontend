import type {SubmitButtonStatus} from "@/components";

/**
 * Shared footer for code / predict / project panels:
 *   [Show/Hide reference answer?] [Submit]
 *
 * Reveal unlocks after the first submit and disappears once the assignment
 * is completed (passed on submit, or Marked as done). Mark as done is only
 * offered for graded kinds (`code` / `predict`) while the reference answer
 * is visible, reusing the Submit button and its status animation.
 */
export interface AssignmentFooterProps {
  submitStatus: SubmitButtonStatus;
  /** Omit when the assignment has nothing to execute — the menu drops the Run item. */
  onRun?: () => void;
  isRunning?: boolean;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
  canRevealAnswer?: boolean;
  isSolutionVisible?: boolean;
  isLoadingSolution?: boolean;
  onToggleSolution?: () => void;
  historyStatus?: 'success' | 'error' | null;
  onExitView?: () => void;
}
