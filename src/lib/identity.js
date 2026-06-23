/**
 * Anonymous, persistent student identity — no login (see the api repo's
 * CONTRACT.md "Identity"). A UUID is generated once and kept in localStorage;
 * the server keys progress by it. The typed display name isn't captured yet.
 */
const KEY = 'bootit.studentId'

export function getStudentId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}
