import { createTranslator, getLanguage, type Lang } from './i18n';
import ar from './lang/ar';

/**
 * The frame's own words (Sign out, Appearance, Search …) go through t(). They follow the Clerdo language setting
 * (see i18n.ts). An app with its own translation system can take them over with setFrameTranslator(fn).
 * {name} placeholders are filled from vars.
 */
export type Translate = (text: string, vars?: Record<string, string | number>) => string;

/** The frame's catalogs, for apps that merge them into their own. */
export const FRAME_CATALOGS: Partial<Record<Lang, Readonly<Record<string, string>>>> = { ar };

let own: Translate | null = null;
let builtIn: Translate | null = null;

export function setFrameTranslator(fn: Translate | null): void {
  own = fn;
}

export const t: Translate = (text, vars) => {
  if (own) return own(text, vars);
  builtIn ??= createTranslator(FRAME_CATALOGS, getLanguage());
  return builtIn(text, vars);
};

/** "Ctrl K" on Windows/Linux, "⌘ K" on Apple devices. */
export const modKey = (key: string): string =>
  (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? `⌘ ${key}` : `Ctrl ${key}`);
