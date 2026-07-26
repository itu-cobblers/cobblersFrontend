/**
 * BootIT Design System - Theme Palette & Typography Tokens
 */

export const PALETTE = {
  cta: {
    hex: '#427BAB',
    rgb: 'rgb(66, 123, 171)',
    oklch: 'oklch(0.56 0.09 245)',
    description: 'Main Button, CTA',
  },
  /** Secondary */
  secondary: {
    hex: '#B8C1CA',
    rgb: 'rgb(184, 193, 202)',
    oklch: 'oklch(0.81 0.02 250)',
    description: 'Secondary',
  },
  /** Foreground */
  text: {
    hex: '#424242',
    rgb: 'rgb(66, 66, 66)',
    oklch: 'oklch(0.32 0 0)',
    description: 'Foreground',
  },
  /** Muted Text */
  textMuted: {
    hex: '#71717A',
    rgb: 'rgb(113, 113, 122)',
    oklch: 'oklch(0.5 0.01 250)',
    description: 'Muted Text',
  },
  /** Accent Highlight */
  accent: {
    hex: '#5C2482',
    rgb: 'rgb(92, 36, 130)',
    oklch: 'oklch(0.35 0.17 305)',
    description: 'Highlight Purple',
  },
  /** Compile Error & Test Failed */
  statusError: {
    main: '#DC2626',
    lightBg: '#FEF2F2',
    border: '#FCA5A5',
    text: '#991B1B',
    oklch: 'oklch(0.6 0.22 27)',
    description: 'Error Red',
  },
  /** Success & Test Passed*/
  statusSuccess: {
    main: '#16A34A',
    lightBg: '#F0FDF4',
    border: '#86EFAC',
    text: '#166534',
    oklch: 'oklch(0.65 0.2 145)',
    description: 'Success Green',
  },
  statusWarning: {
    main: '#F0AD4E',
    lightBg: '#FFF9E6',
    border: '#FFEBA8',
    text: '#B26A00',
    oklch: 'oklch(0.77 0.17 74)',
    description: 'Warning Yellow',
  },
  /** Background */
  background: {
    canvas: '#FFFFFF',
    surface: '#F8FAFC',
    panel: '#F1F5F9',
    border: '#E2E8F0',
  },
} as const

/**
 * Typography Levels
 * fontSize, lineHeight, fontWeight, and color
 */
export const TYPOGRAPHY_LEVELS = {
  /** Hero / Modal Title */
  display: {
    name: 'Display / Hero Title',
    fontSize: '2rem', // 32px
    lineHeight: '2.25rem', // 36px
    fontWeight: '700',
    color: PALETTE.text.hex,
    tailwindClass: 'text-3xl font-bold leading-tight',
  },
  /** H1 */
  h1: {
    name: 'Heading 1',
    fontSize: '1.5rem', // 24px
    lineHeight: '2rem', // 32px
    fontWeight: '700',
    color: PALETTE.text.hex,
    tailwindClass: 'text-2xl font-bold leading-snug',
  },
  /** H2 */
  h2: {
    name: 'Heading 2',
    fontSize: '1.25rem', // 20px
    lineHeight: '1.75rem', // 28px
    fontWeight: '600',
    color: PALETTE.text.hex,
    tailwindClass: 'text-xl font-semibold leading-snug',
  },
  /** H3 */
  h3: {
    name: 'Heading 3',
    fontSize: '1.125rem', // 18px
    lineHeight: '1.5rem', // 24px
    fontWeight: '600',
    color: PALETTE.text.hex,
    tailwindClass: 'text-lg font-semibold leading-normal',
  },
  /** Body Base */
  body: {
    name: 'Body / Base',
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    fontWeight: '400',
    color: PALETTE.text.hex,
    tailwindClass: 'text-sm font-normal leading-normal',
  },
  /** Body Strong */
  bodyStrong: {
    name: 'Body Strong',
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    fontWeight: '600',
    color: PALETTE.text.hex,
    tailwindClass: 'text-sm font-semibold leading-normal',
  },
  /** Subtext / Muted */
  subtext: {
    name: 'Subtext / Muted',
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem', // 20px
    fontWeight: '400',
    color: PALETTE.textMuted.hex,
    tailwindClass: 'text-sm font-normal text-muted-foreground',
  },
  /** Caption / Small */
  caption: {
    name: 'Caption / Small',
    fontSize: '0.75rem', // 12px
    lineHeight: '1rem', // 16px
    fontWeight: '400',
    color: PALETTE.textMuted.hex,
    tailwindClass: 'text-xs font-normal text-muted-foreground',
  },
  /** Terminal / Monospace */
  code: {
    name: 'Code / Monospace',
    fontSize: '1rem', // 13px
    lineHeight: '1.25rem', // 20px
    fontWeight: '400',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    color: PALETTE.text.hex,
    tailwindClass: 'font-mono text-[13px] leading-relaxed',
  },
} as const

export type Palette = typeof PALETTE
export type TypographyLevelKey = keyof typeof TYPOGRAPHY_LEVELS
