import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'
import type { SourceFile } from '@types'
import { readSourceFiles } from './FileUpload.utils'

/**
 * Drives the dropzone: a hidden file input (click-to-browse) plus native
 * drag-and-drop, both funneling into the same `readSourceFiles` → `onFilesChange`
 * path. `isDragActive` is purely visual (the dashed-border highlight while a
 * file is dragged over the zone).
 */
export function useFileDropzone(onFilesChange: (incomingFiles: SourceFile[]) => void) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  async function loadFiles(list: FileList | null) {
    if (!list || list.length === 0) return
    onFilesChange(await readSourceFiles(list))
  }

  function handleBrowseClick() {
    inputRef.current?.click()
  }

  function handleBrowseKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleBrowseClick()
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void loadFiles(event.target.files)
    // Reset so re-picking the exact same file(s) still fires a change.
    event.target.value = ''
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)
    void loadFiles(event.dataTransfer.files)
  }

  return {
    inputRef,
    isDragActive,
    handleBrowseClick,
    handleBrowseKeyDown,
    handleInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
