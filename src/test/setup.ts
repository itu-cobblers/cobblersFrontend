import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// react-pdf pulls in pdfjs-dist's canvas backend at import time, which
// references browser canvas globals (DOMMatrix, etc.) jsdom doesn't
// implement. No test exercises real PDF rendering, so stub the module
// instead of chasing every missing canvas global.
vi.mock('react-pdf', () => ({
  Document: () => null,
  Page: () => null,
  pdfjs: { GlobalWorkerOptions: {} },
}))

// Node 22+ ships an experimental `localStorage` global that shadows the DOM
// one and is undefined unless Node is started with --localstorage-file, so
// code using bare `localStorage`/`sessionStorage` crashes under vitest. Back
// both with a simple in-memory Storage for tests.
function createMemoryStorage(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key)
    },
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
  }
}

Object.defineProperty(globalThis, 'localStorage', { value: createMemoryStorage(), configurable: true })
Object.defineProperty(globalThis, 'sessionStorage', { value: createMemoryStorage(), configurable: true })

// jsdom has no layout engine, so it doesn't implement ResizeObserver — stub it
// for components (SlideViewer) that measure their container for a responsive size.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, 'ResizeObserver', { value: MockResizeObserver, configurable: true })
