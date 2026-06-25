/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEACHER_CODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
