/**
 * The frame's own words (Sign out, Appearance, Search …) go through t(), so an app with its own languages
 * can translate them: setFrameTranslator(fn) once at start-up. {name} placeholders are filled from vars.
 */
export type Translate = (text: string, vars?: Record<string, string | number>) => string;

const fill = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;

let translate: Translate = fill;

export function setFrameTranslator(fn: Translate | null): void {
  translate = fn ?? fill;
}

export const t: Translate = (text, vars) => translate(text, vars);

/** "Ctrl K" on Windows/Linux, "⌘ K" on Apple devices. */
export const modKey = (key: string): string =>
  (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? `⌘ ${key}` : `Ctrl ${key}`);
