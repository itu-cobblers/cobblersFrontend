import type { TasksetPreviewProps } from './TasksetPreview.types'
import {
  PREVIEW_WRAP_CLASS,
  PREVIEW_TITLE_CLASS,
  PREVIEW_GROUP_CLASS,
  PREVIEW_DAY_HEADER_CLASS,
  PREVIEW_LIST_CLASS,
  PREVIEW_ITEM_CLASS,
  PREVIEW_SUMMARY_CLASS,
  PREVIEW_CARET_CLASS,
  PREVIEW_TITLE_ROW_CLASS,
  PREVIEW_KIND_CLASS,
  PREVIEW_DETAIL_CLASS,
  PREVIEW_DESC_CLASS,
  PREVIEW_HINT_CLASS,
  KIND_LABEL,
} from './TasksetPreview.constants'

export default function TasksetPreview({ title, groups }: TasksetPreviewProps) {
  return (
    <div className={PREVIEW_WRAP_CLASS}>
      {title && <h3 className={PREVIEW_TITLE_CLASS}>{title}</h3>}
      {groups.map((group) => (
        <section key={group.label} className={PREVIEW_GROUP_CLASS}>
          <h4 className={PREVIEW_DAY_HEADER_CLASS}>{group.label}</h4>
          <ul className={PREVIEW_LIST_CLASS}>
            {group.items.map((item) => (
              <li key={item.id}>
                <details className={PREVIEW_ITEM_CLASS}>
                  <summary className={PREVIEW_SUMMARY_CLASS}>
                    <span className={PREVIEW_CARET_CLASS}>▶</span>
                    <span className={PREVIEW_TITLE_ROW_CLASS}>{item.title}</span>
                    <span className={PREVIEW_KIND_CLASS}>{KIND_LABEL[item.kind]}</span>
                  </summary>
                  <div className={PREVIEW_DETAIL_CLASS}>
                    <p className={PREVIEW_DESC_CLASS}>{item.description}</p>
                    {item.hint && <p className={PREVIEW_HINT_CLASS}>💡 {item.hint}</p>}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
