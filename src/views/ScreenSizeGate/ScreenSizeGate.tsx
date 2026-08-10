import { ScreenSizeBlocker } from '@components/ScreenSizeBlocker'
import { StudentView } from '@views/StudentView'
import { TeacherGate } from '@views/TeacherGate'
import { useScreenSizeGate } from './ScreenSizeGate.hooks'

const isTeacherPath = window.location.pathname.startsWith('/teacher')

/**
 * Root switch: blocks the whole app below iPad-landscape width before
 * routing between the teacher and student entry points.
 */
export default function ScreenSizeGate() {
  const isBlocked = useScreenSizeGate()

  if (isBlocked) return <ScreenSizeBlocker />

  return isTeacherPath ? <TeacherGate /> : <StudentView />
}
