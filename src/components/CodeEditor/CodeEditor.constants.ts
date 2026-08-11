import type { editor } from 'monaco-editor'

export const CODE_EDITOR_CONTAINER_CLASS = 'min-h-0 flex-1 overflow-hidden bg-terminal'

/** The editor sits on this, so dimming fades the code and not the surface behind it. */
export const CODE_EDITOR_SURFACE_CLASS = 'h-full w-full transition-opacity duration-200'

/**
 * Read-only view (reference solution, past submission): the code desaturates
 * and washes toward the background, so the pane reads as inert on sight
 * instead of needing a badge to say so.
 *
 * `grayscale` opens a stacking context and a containing block for fixed
 * descendants — harmless here because read-only mode already switches off the
 * suggest widget and context menu, which are the overlays that would care.
 */
export const CODE_EDITOR_DIMMED_CLASS = 'opacity-45 grayscale'

/**
 * Monaco ships its own themes; ours are CSS. A `.dark` class on `<html>` cannot
 * reach inside the editor, so `CodeEditor` reads `useTheme()` and passes a name.
 *
 * Light uses the built-in `vs`, whose white background already matches
 * `--terminal`. Dark cannot: Monaco's only dark built-ins are `vs-dark`
 * (VS Code **Dark+**, two defaults ago, background `#1E1E1E`) and `hc-black`
 * (pure black, high contrast). Neither is Dark 2026, so `vs-dark` painted the
 * pane `#1E1E1E` inside a `#121314` container — a visible seam.
 *
 * `EDITOR_DARK_THEME` fixes that by extending `vs-dark` with our background.
 */
export const EDITOR_DARK_THEME = 'bootcode-dark'

export const EDITOR_THEME: Record<'light' | 'dark', string> = {
  light: 'vs',
  dark: EDITOR_DARK_THEME,
}

/**
 * Registered once at startup in `main.tsx`, **not** in `beforeMount`.
 * `beforeMount` fires per editor instance, so a live editor whose `theme` prop
 * changes without a remount would be handed a name Monaco has never seen — and
 * `setTheme` answers an unknown name by silently falling back to `vs`, i.e. the
 * *light* theme. Registration is global and one-time; it belongs where the rest
 * of the one-time Monaco setup already lives.
 *
 * Surfaces only — `inherit: true` keeps every one of `vs-dark`'s token colours.
 *
 * Deliberately *not* adopting Dark 2026's syntax palette along with its
 * background. That palette moves structural keywords (`class`, `void`) to a
 * red `#ff7b72` and function calls to a purple that collides with flow
 * keywords. Students here spend three days learning that red means broken;
 * colouring `class` in error-red fights that, and the keyword/function
 * separation is scaffolding beginners lean on more than we do.
 */
export const EDITOR_DARK_THEME_DATA: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#121314',
    'editorGutter.background': '#121314',
    'minimap.background': '#121314',
  },
}

/** Monaco options tuned to feel like VSCode's Java experience. tabSize 4 is the Java the students write. */
export const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  lineNumbers: 'on',
  tabSize: 4,
  automaticLayout: true,
  wordWrap: 'on',
  padding: { top: 12 },
  domReadOnly: false,
  contextmenu: true,
  matchBrackets: 'always',
  selectionHighlight: true,
  renderLineHighlight: 'line',
  suggestOnTriggerCharacters: true,
  quickSuggestions: { other: true, comments: false, strings: false },
  wordBasedSuggestions: 'off',
  acceptSuggestionOnEnter: 'on',
  tabCompletion: 'on',
  suggestSelection: 'first',
  snippetSuggestions: 'inline',
  suggest: {
    showMethods: true,
    showFields: true,
    showClasses: true,
    showKeywords: true,
    showSnippets: true,
    filterGraceful: true,
    localityBonus: true,
  },
}

/**
 * Layered over EDITOR_OPTIONS when the pane is showing something the student
 * can't edit. `readOnly` alone still leaves a caret, a context menu and live
 * suggestions, which all read as "you can type here" — these switch the rest off.
 *
 * Scrolling and selection are deliberately left working: reference solutions
 * and past submissions can run past the viewport, and they'd be unreadable
 * otherwise.
 */
export const EDITOR_READ_ONLY_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  domReadOnly: true,
  contextmenu: false,
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  matchBrackets: 'never',
  selectionHighlight: false,
  renderLineHighlight: 'none',
}
