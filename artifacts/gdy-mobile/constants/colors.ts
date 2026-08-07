/**
 * GDY Mobile design tokens — dark navy + indigo palette
 * Derived from artifacts/duck-master/src/index.css
 */

// GDY is dark-first — both light and dark use the navy palette
const navyPalette = {
  text: '#e8eaf6',
  tint: '#6366f1',

  background: '#0d1117',
  foreground: '#e8eaf6',

  card: '#161c2d',
  cardForeground: '#e8eaf6',

  primary: '#6366f1',
  primaryForeground: '#ffffff',

  secondary: '#1a2236',
  secondaryForeground: '#e8eaf6',

  accent: '#8b5cf6',
  accentForeground: '#ffffff',

  muted: '#1a2236',
  mutedForeground: '#8b9ab2',

  destructive: '#ef4444',
  destructiveForeground: '#ffffff',

  border: '#1e2d45',
  input: '#1e2d45',

  cyan: '#06b6d4',
  success: '#22c55e',
};

const colors = {
  light: navyPalette,
  dark: navyPalette,

  // Border radius in px (matching web --radius: 0.5rem → 8px, using 12 for mobile)
  radius: 12,
};

export default colors;

/** 25 category accent colours mirroring the web app's --cat-* hue progression */
export const CATEGORY_COLORS: string[] = [
  '#6366f1', // 01 — indigo
  '#8b5cf6', // 02 — violet
  '#a855f7', // 03 — purple
  '#d946ef', // 04 — fuchsia
  '#ec4899', // 05 — pink
  '#f43f5e', // 06 — rose
  '#ef4444', // 07 — red
  '#f97316', // 08 — orange
  '#f59e0b', // 09 — amber
  '#eab308', // 10 — yellow
  '#84cc16', // 11 — lime
  '#22c55e', // 12 — green
  '#10b981', // 13 — emerald
  '#14b8a6', // 14 — teal
  '#06b6d4', // 15 — cyan
  '#0ea5e9', // 16 — sky
  '#3b82f6', // 17 — blue
  '#6366f1', // 18 — indigo
  '#7c3aed', // 19 — violet-dark
  '#9333ea', // 20 — purple-dark
  '#c026d3', // 21 — fuchsia-dark
  '#db2777', // 22 — pink-dark
  '#e11d48', // 23 — rose-dark
  '#ea580c', // 24 — orange-dark
  '#d97706', // 25 — amber-dark
];
