import { useSyncExternalStore } from 'react';

/**
 * One language for all of Clerdo. The choice lives in the `clerdo_lang` cookie on .clerdo.app, so picking Arabic in
 * one app applies to every app; elsewhere (local dev) it lives in localStorage. With no choice, the browser's
 * language decides. Choosing reloads the page, so text computed outside React is re-read too.
 */
export type Lang = 'en' | 'ar';
export type Catalog = Readonly<Record<string, string>>;
export type Vars = Record<string, string | number>;

export const LANGUAGES: ReadonlyArray<{ id: Lang; name: string; dir: 'ltr' | 'rtl' }> = [
  { id: 'en', name: 'English', dir: 'ltr' },
  { id: 'ar', name: 'العربية', dir: 'rtl' },
];

const COOKIE = 'clerdo_lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'ar';

const readCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  const m = /(?:^|;\s*)clerdo_lang=([a-z]{2})(?:;|$)/.exec(document.cookie);
  return m?.[1] ?? null;
};

const sharedDomain = (): string | null =>
  typeof location !== 'undefined' && /(^|\.)clerdo\.app$/.test(location.hostname) ? '.clerdo.app' : null;

const browserLang = (): Lang =>
  typeof navigator !== 'undefined' && (navigator.languages ?? [navigator.language]).some((l) => /^ar\b/i.test(l ?? '')) ? 'ar' : 'en';

/** The person's language: their choice, else the browser's. */
export function getLanguage(): Lang {
  const c = readCookie();
  if (isLang(c)) return c;
  try {
    const v = localStorage.getItem(COOKIE);
    if (isLang(v)) return v;
  } catch { /* storage unavailable */ }
  return browserLang();
}

export const dirOf = (lang: Lang): 'ltr' | 'rtl' => LANGUAGES.find((l) => l.id === lang)?.dir ?? 'ltr';

/** Sets <html lang dir> for the current language. Call once before the first render. */
export function applyLanguage(): Lang {
  const lang = getLanguage();
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }
  return lang;
}

/** Saves the choice for every Clerdo app and reloads so all text follows. */
export function setLanguage(lang: Lang, reload = true): void {
  const domain = sharedDomain();
  document.cookie = `${COOKIE}=${lang}; Path=/; Max-Age=${400 * 86400}; SameSite=Lax${domain ? `; Domain=${domain}` : ''}${location.protocol === 'https:' ? '; Secure' : ''}`;
  try { localStorage.setItem(COOKIE, lang); } catch { /* cookie still holds it */ }
  applyLanguage();
  if (reload) location.reload();
}

/** The current language, for components that format numbers and dates. */
export function useLanguage(): Lang {
  return useSyncExternalStore(() => () => {}, getLanguage, () => 'en' as Lang);
}

const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s);

/**
 * An app's translator: English text is the key. Missing text falls back to English, so a half-finished catalog
 * never shows a blank. Plurals: pass "one|other" text and a `count` var.
 */
export function createTranslator(catalogs: Partial<Record<Lang, Catalog>>, lang: Lang = getLanguage()) {
  const cat = catalogs[lang] ?? {};
  return (text: string, vars?: Vars): string => {
    let s = cat[text] ?? text;
    if (s.includes('|') && vars && typeof vars.count === 'number') {
      const forms = s.split('|');
      s = lang === 'ar' ? arabicPlural(forms, vars.count) : (forms[vars.count === 1 ? 0 : forms.length - 1] ?? s);
    }
    return fill(s, vars);
  };
}

/** Arabic forms in order "other|one|two|few|many"; fewer forms fall back to the last. */
function arabicPlural(forms: string[], n: number): string {
  const r = n % 100;
  const i = n === 1 ? 1 : n === 2 ? 2 : r >= 3 && r <= 10 ? 3 : r >= 11 ? 4 : 0;
  return forms[Math.min(i, forms.length - 1)] ?? forms[0] ?? '';
}

/** Numbers and dates in the person's language, with Western digits (as most Clerdo text uses). */
export const locale = (lang: Lang = getLanguage()): string => (lang === 'ar' ? 'ar-u-nu-latn' : 'en');
