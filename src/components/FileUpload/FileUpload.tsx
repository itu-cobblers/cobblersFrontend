import classNames from 'classnames'
import { Icon } from '@components/Icon'
import type { FileUploadProps } from './FileUpload.types'
import { useFileDropzone } from './FileUpload.hooks'
import {
  FILE_UPLOAD_CLASS,
  DROPZONE_BASE_CLASS,
  DROPZONE_IDLE_CLASS,
  DROPZONE_ACTIVE_CLASS,
  DROPZONE_LABEL_CLASS,
  DROPZONE_SUBLABEL_CLASS,
  FILE_INPUT_HIDDEN_CLASS,
  FILE_LIST_CLASS,
  FILE_CHIP_CLASS,
  FILE_EMPTY_CLASS,
} from './FileUpload.constants'

/**
 * A large drag-and-drop dropzone (click-to-browse too) for a project
 * assignment's source files — replaces the terminal for `project` kind since
 * there's nothing to run, only upload. Every drop/pick replaces the current
 * file set (`onFilesChange` gets the full new list, not an append).
 */
export default function FileUpload({ files, onFilesChange, accept = '.java' }: FileUploadProps) {
  const {
    inputRef,
    isDragActive,
    handleBrowseClick,
    handleBrowseKeyDown,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileDropzone(onFilesChange)

  return (
    <div className={FILE_UPLOAD_CLASS}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleBrowseClick}
        onKeyDown={handleBrowseKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={classNames(DROPZONE_BASE_CLASS, isDragActive ? DROPZONE_ACTIVE_CLASS : DROPZONE_IDLE_CLASS)}
      >
        <Icon name="upload" />
        <span className={DROPZONE_LABEL_CLASS}>
          {isDragActive ? 'Drop your files here' : 'Drag & drop your .java files here'}
        </span>
        <span className={DROPZONE_SUBLABEL_CLASS}>or click to browse — uploading again replaces the current files</span>
        <input
          ref={inputRef}
          className={FILE_INPUT_HIDDEN_CLASS}
          type="file"
          accept={accept}
          multiple
          onChange={handleInputChange}
        />
      </div>
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
