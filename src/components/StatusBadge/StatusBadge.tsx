import { LABEL_TEXT_CLASSES, SIZE_CLASSES, STATUS_COLORS, STATUS_ICON } from "@components/StatusBadge/StatusBadge.constants.ts";
import { Icon } from "@/components";
import type { StatusBadgeProps } from "@components/StatusBadge/StatusBadge.types.ts";
import classNames from 'classnames';

export default function StatusBadge({ status, size = 's', label, className }: StatusBadgeProps) {
  const iconName = STATUS_ICON[status];
  const badgeElement = (
      <span
          className={classNames(
              'inline-flex shrink-0 items-center justify-center rounded-full',
              STATUS_COLORS[status],
              SIZE_CLASSES[size]
          )}
      >
      {iconName && <Icon name={iconName} />}
    </span>
  )

  if (label) {
    return (
        <div
            className={classNames(
                'flex items-center justify-center gap-1 font-medium',
                LABEL_TEXT_CLASSES[size],
                STATUS_COLORS[status].split(' ')[1],
                className
            )}
        >
          {badgeElement}
          {label}
        </div>
    )
  }

  return (
      <span className={classNames(
          'flex items-center justify-center gap-1 font-medium',
          STATUS_COLORS[status].split(' ')[1],
          className)}>
      {badgeElement}
    </span>
  )
}