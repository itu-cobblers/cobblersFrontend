/**
 * Anonymous, persistent student identity — no login (see the api repo's
 * CONTRACT.md "Identity"). A UUID is generated once and kept in localStorage;
 * the server keys progress by it. `displayName` is a label shown to the teacher.
 */
const ID_KEY = 'bootit.studentId'
const NAME_KEY = 'bootit.displayName'

export function getStudentId(): string {
  let id = localStorage.getItem(ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(ID_KEY, id)
  }
  return id
}

export function getDisplayName(): string {
  return localStorage.getItem(NAME_KEY) ?? ''
}

export function setDisplayName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}
