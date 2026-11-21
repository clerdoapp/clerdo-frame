import { afterEach, describe, expect, it } from 'vitest';
import { applyLanguage, createTranslator, getLanguage, setLanguage } from '../src/i18n';
import { CLERDO_APPS, CLERDO_DIVISIONS } from '../src/apps';
import ar from '../src/lang/ar';

afterEach(() => {
  document.cookie = 'clerdo_lang=; Max-Age=0; Path=/';
  localStorage.clear();
});

describe('languages', () => {
  it('translates, fills placeholders and falls back to English', () => {
    const t = createTranslator({ ar: { 'Hello {name}': 'مرحبًا {name}' } }, 'ar');
    expect(t('Hello {name}', { name: 'Sam' })).toBe('مرحبًا Sam');
    expect(t('Not translated')).toBe('Not translated');
    expect(createTranslator({ ar: {} }, 'en')('Hello {name}', { name: 'Sam' })).toBe('Hello Sam');
  });

  it('picks plural forms', () => {
    const en = createTranslator({}, 'en');
    expect(en('{count} file|{count} files', { count: 1 })).toBe('1 file');
    expect(en('{count} file|{count} files', { count: 5 })).toBe('5 files');
    const t = createTranslator({ ar: { 'x': '{count} ملف|ملف واحد|ملفان|{count} ملفات|{count} ملفًا' } }, 'ar');
    expect([0, 1, 2, 3, 11, 100].map((count) => t('x', { count }))).toEqual(['0 ملف', 'ملف واحد', 'ملفان', '3 ملفات', '11 ملفًا', '100 ملف']);
  });

  it('remembers the choice and sets the page direction', () => {
    setLanguage('ar', false);
    expect(getLanguage()).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    setLanguage('en', false);
    expect(applyLanguage()).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('has Arabic for every frame text, app tagline and switcher group', () => {
    const sources = import.meta.glob('../src/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    const keys = new Set<string>();
    for (const text of Object.values(sources)) {
      for (const m of text.matchAll(/\bt\('((?:[^'\\]|\\.)*)'/g)) keys.add(m[1]!.replace(/\\'/g, "'"));
    }
    for (const a of CLERDO_APPS) keys.add(a.tagline);
    for (const d of CLERDO_DIVISIONS) keys.add(d.switcherGroup);
    keys.delete('Language');
    expect([...keys].filter((k) => !(k in ar))).toEqual([]);
  });
});
