import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from '@components/Icon'
import type { SubmitButtonProps } from './SubmitButton.types'
import { useSubmitButtonDisplayStatus } from './SubmitButton.hooks'
import {
  SUBMIT_BUTTON_LABEL,
  SUBMIT_BUTTON_ICON,
  SUBMIT_BUTTON_ICON_CLASS,
  SUBMIT_BUTTON_CLASS,
  SUBMIT_BUTTON_BG_CLASS,
  SUBMIT_BUTTON_WAITING_CLASS,
  SUBMIT_BUTTON_ICON_WRAP_CLASS,
} from './SubmitButton.constants'

/** The idle→waiting→result content swap: flies up and out, fades the next state in. */
const CONTENT_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
}

/** The idle arrow's hover nudge — propagated down from the button's own `whileHover`. */
const HOVER_VARIANTS = {
  rest: { y: 0 },
  hover: { y: -3 },
}

const SPIN_TRANSITION = { repeat: Infinity, ease: 'linear', duration: 0.8 } as const

/**
 * The shared Submit button for the terminal/predict panels: an up-arrow
 * "Submit" affordance that nudges up on hover, flies out into a spinner
 * while a submission is in flight (button locks against re-clicks and dims),
 * then holds a green check ("Well Done") or amber "!" ("Not Quite") before
 * easing back to idle on its own.
 */
export default function SubmitButton({ status, onClick, isDisabled = false, label }: SubmitButtonProps) {
  const displayStatus = useSubmitButtonDisplayStatus(status)
  const isWaiting = status === 'waiting'
  const displayLabel = label ?? SUBMIT_BUTTON_LABEL[displayStatus]

  return (
      <motion.button
          type="button"
          aria-label={displayLabel}
          onClick={onClick}
          disabled={isDisabled || isWaiting}
          initial="rest"
          whileHover="hover"
          className={classNames(SUBMIT_BUTTON_CLASS, SUBMIT_BUTTON_BG_CLASS[displayStatus], { [SUBMIT_BUTTON_WAITING_CLASS]: isWaiting })}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
              key={displayStatus}
              className="flex items-center gap-2"
              variants={CONTENT_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.span className={classNames(SUBMIT_BUTTON_ICON_WRAP_CLASS, SUBMIT_BUTTON_ICON_CLASS)} variants={HOVER_VARIANTS}>
              <motion.span
                  className="flex"
                  animate={isWaiting ? { rotate: 360 } : { rotate: 0 }}
                  transition={isWaiting ? SPIN_TRANSITION : { duration: 0.15 }}
              >
                <Icon name={SUBMIT_BUTTON_ICON[displayStatus]} />
              </motion.span>
            </motion.span>
            <span>{displayLabel}</span>
          </motion.span>
        </AnimatePresence>
      </motion.button>
  )
}
