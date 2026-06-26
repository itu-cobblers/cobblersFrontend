import type { SourceFile } from '@types'

/** Read a picked FileList into in-memory SourceFile objects (name + contents). */
export async function readSourceFiles(list: FileList): Promise<SourceFile[]> {
  const files = Array.from(list)
  return Promise.all(files.map(async (file) => ({ name: file.name, content: await file.text() })))
}
