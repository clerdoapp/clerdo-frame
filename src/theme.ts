import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

const KEY = 'clerdo.theme';
const listeners = new Set<() => void>();

const readChoice = (): ThemeChoice => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
};

const systemDark = (): boolean => typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;

export const resolveTheme = (choice: ThemeChoice, prefersDark: boolean): Theme => (choice === 'system' ? (prefersDark ? 'dark' : 'light') : choice);

const apply = (): void => {
  document.documentElement.dataset.theme = resolveTheme(readChoice(), systemDark());
};

/** Light/dark for the whole page: follows the system unless the person picked one. Sets `data-theme` on <html>. */
export function useTheme(): { choice: ThemeChoice; theme: Theme; setChoice: (c: ThemeChoice) => void } {
  const choice = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    readChoice,
    () => 'system' as ThemeChoice,
  );
  useEffect(() => {
    apply();
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [choice]);
  const setChoice = useCallback((c: ThemeChoice) => {
    try { if (c === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, c); } catch { /* storage unavailable: applies for this page only */ }
    apply();
    for (const l of listeners) l();
  }, []);
  return { choice, theme: resolveTheme(choice, systemDark()), setChoice };
}
