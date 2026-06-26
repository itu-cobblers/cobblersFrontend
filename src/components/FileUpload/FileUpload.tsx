import { type ChangeEvent } from 'react'
import type { FileUploadProps } from './FileUpload.types'
import { readSourceFiles } from './FileUpload.utils'
import {
  FILE_UPLOAD_CLASS,
  FILE_INPUT_CLASS,
  FILE_LIST_CLASS,
  FILE_CHIP_CLASS,
  FILE_EMPTY_CLASS,
} from './FileUpload.constants'

export default function FileUpload({ files, onFilesChange, accept = '.java' }: FileUploadProps) {
  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const list = event.target.files
    if (!list || list.length === 0) return
    onFilesChange(await readSourceFiles(list))
  }

  return (
    <div className={FILE_UPLOAD_CLASS}>
      <input className={FILE_INPUT_CLASS} type="file" accept={accept} multiple onChange={handleChange} />
      {files.length === 0 ? (
        <span className={FILE_EMPTY_CLASS}>No files chosen yet.</span>
      ) : (
        <div className={FILE_LIST_CLASS}>
          {files.map((file) => (
            <span key={file.name} className={FILE_CHIP_CLASS}>
              {file.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
