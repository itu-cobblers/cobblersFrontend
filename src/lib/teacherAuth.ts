const KEY = 'bootit.teacherAuth'

export const isTeacher = (): boolean => sessionStorage.getItem(KEY) === '1'
export const grantTeacher = (): void => sessionStorage.setItem(KEY, '1')
export const revokeTeacher = (): void => sessionStorage.removeItem(KEY)
