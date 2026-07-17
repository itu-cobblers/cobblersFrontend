import '@testing-library/jest-dom/vitest'

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
