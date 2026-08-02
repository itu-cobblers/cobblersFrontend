import { Icon } from '@components/Icon'
import { Spinner } from '@components/Spinner'
import type { RunMenuAction, RunMenuProps } from './RunMenu.types'
import { useMenuDisclosure } from '@hooks/useMenuDisclosure'
import {
  RUN_MENU_WRAPPER_CLASS,
  RUN_MENU_SHELL_CLASS,
  RUN_MENU_PLAY_CLASS,
  RUN_MENU_CHEVRON_CLASS,
  RUN_MENU_LIST_CLASS,
  RUN_MENU_ITEM_CLASS,
  RUN_MENU_LABEL,
} from './RunMenu.constants'

/**
 * VS Code's split run control: the play half runs the code, the chevron opens
 * Run and Submit.
 *
 * Only for assignments that can actually execute. Predict and project have
 * nothing to run, so they keep the plain SubmitButton rather than hiding
 * Submit behind a play icon that would do nothing.
 */
export default function RunMenu({
  onRun,
  onSubmit,
  isRunning = false,
  isSubmitting = false,
  isSubmitDisabled = false,
}: RunMenuProps) {
  const { isOpen, setIsOpen, wrapperRef } = useMenuDisclosure()

  const actions: RunMenuAction[] = [
    { id: 'run', label: RUN_MENU_LABEL.run, onSelect: onRun, isDisabled: isRunning },
    {
      id: 'submit',
      label: RUN_MENU_LABEL.submit,
      onSelect: onSubmit,
      isDisabled: isSubmitDisabled || isSubmitting,
    },
  ]

  const primary = actions[0]
  const isBusy = isRunning || isSubmitting

  function handlePrimaryClick() {
    primary.onSelect()
  }

  function handleToggle() {
    setIsOpen(!isOpen)
  }

  function handleSelect(action: RunMenuAction) {
    setIsOpen(false)
    action.onSelect()
  }

  return (
    <div className={RUN_MENU_WRAPPER_CLASS} ref={wrapperRef}>
      <div className={RUN_MENU_SHELL_CLASS}>
        <button
          type="button"
          onClick={handlePrimaryClick}
          disabled={primary.isDisabled}
          aria-label={primary.label}
          className={RUN_MENU_PLAY_CLASS}
        >
          {isBusy ? <Spinner /> : <Icon name="play" />}
        </button>
        <button
          type="button"
          onClick={handleToggle}
          aria-label="More actions"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={RUN_MENU_CHEVRON_CLASS}
        >
          <Icon name="chevronDown" />
        </button>
      </div>

      {isOpen && (
        <div className={RUN_MENU_LIST_CLASS} role="menu">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(action)}
              disabled={action.isDisabled}
              className={RUN_MENU_ITEM_CLASS}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
