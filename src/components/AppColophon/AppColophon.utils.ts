import { COLOPHON_TEAM } from './AppColophon.constants'

/** "a, b and c" separators — the join text after the nth team member's name. */
export function getTeamNameSeparator(index: number) {
  if (index === COLOPHON_TEAM.length - 1) return ''
  if (index === COLOPHON_TEAM.length - 2) return ' and '
  return ', '
}
