import classNames from 'classnames'
import type { MouseEvent } from 'react'
import type { AssignmentSetPreviewProps } from './AssignmentSetPreview.types'
import {
  PREVIEW_WRAP_CLASS,
  PREVIEW_TITLE_CLASS,
  PREVIEW_GROUP_CLASS,
  PREVIEW_DAY_HEADER_CLASS,
  PREVIEW_LIST_CLASS,
  PREVIEW_ITEM_CLASS,
  PREVIEW_ITEM_FOCUSED_CLASS,
  PREVIEW_SUMMARY_CLASS,
  PREVIEW_CARET_CLASS,
  PREVIEW_TITLE_ROW_CLASS,
  PREVIEW_KIND_CLASS,
  PREVIEW_DETAIL_CLASS,
  PREVIEW_DESC_CLASS,
  PREVIEW_HINT_CLASS,
  PREVIEW_FOCUS_BTN_CLASS,
  PREVIEW_FOCUSED_BADGE_CLASS,
  KIND_LABEL,
} from './AssignmentSetPreview.constants'

export default function AssignmentSetPreview({
  title,
  groups,
  onFocusAssignment,
  focusedAssignmentId,
}: AssignmentSetPreviewProps) {
  function handleFocusClick(event: MouseEvent<HTMLButtonElement>, id: number) {
    // Stop the click from also toggling the enclosing <details>/<summary>.
    event.preventDefault()
    event.stopPropagation()
    onFocusAssignment?.(id)
  }

  return (
    <div className={PREVIEW_WRAP_CLASS}>
      {title && <h3 className={PREVIEW_TITLE_CLASS}>{title}</h3>}
      {groups.map((group) => (
        <section key={group.label} className={PREVIEW_GROUP_CLASS}>
          <h4 className={PREVIEW_DAY_HEADER_CLASS}>{group.label}</h4>
          <ul className={PREVIEW_LIST_CLASS}>
            {group.items.map((item) => {
              const isFocused = item.id === focusedAssignmentId
              return (
                <li key={item.id}>
                  <details className={classNames(PREVIEW_ITEM_CLASS, { [PREVIEW_ITEM_FOCUSED_CLASS]: isFocused })}>
                    <summary className={PREVIEW_SUMMARY_CLASS}>
                      <span className={PREVIEW_CARET_CLASS}>▶</span>
                      <span className={PREVIEW_TITLE_ROW_CLASS}>{item.title}</span>
                      <span className={PREVIEW_KIND_CLASS}>{KIND_LABEL[item.kind]}</span>
                      {isFocused ? (
                        <span className={PREVIEW_FOCUSED_BADGE_CLASS}>Live</span>
                      ) : (
                        onFocusAssignment && (
                          <button
                            type="button"
                            className={PREVIEW_FOCUS_BTN_CLASS}
                            onClick={(event) => handleFocusClick(event, item.id)}
                          >
                            Focus
                          </button>
                        )
                      )}
                    </summary>
                    <div className={PREVIEW_DETAIL_CLASS}>
                      <p className={PREVIEW_DESC_CLASS}>{item.description}</p>
                      {item.hint && <p className={PREVIEW_HINT_CLASS}>{item.hint}</p>}
                    </div>
                  </details>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
