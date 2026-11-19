import { useCallback, useEffect, useState } from 'react';

/**
 * Sign-in for Clerdo web apps. Every app's server follows the same pattern (OAuth 2.0 + PKCE against
 * auth.clerdo.app, run by the app's own PHP backend): GET /api/me, /auth/login?next=, POST /auth/logout.
 * The browser only ever holds an HttpOnly session cookie; writes carry the CSRF token from /api/me.
 */
export interface ClerdoUser { id: string; name: string; email: string; avatar: string | null }
export interface Me { user: ClerdoUser; csrf: string | null; [key: string]: unknown }

export type SessionState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; me: Me }
  | { status: 'error'; message: string };

export const signInUrl = (next: string = location.pathname + location.search): string =>
  `/auth/login?next=${encodeURIComponent(next.startsWith('/') && !next.startsWith('//') ? next : '/')}`;

export const signIn = (next?: string): void => { location.assign(signInUrl(next)); };

export async function fetchMe(): Promise<SessionState> {
  try {
    const res = await fetch('/api/me', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    if (res.status === 401) return { status: 'signedOut' };
    if (!res.ok) return { status: 'error', message: `The server answered ${res.status}` };
    return { status: 'signedIn', me: (await res.json()) as Me };
  } catch {
    return { status: 'error', message: 'You seem to be offline' };
  }
}

export function useSession(): { session: SessionState; refresh: () => Promise<void>; signOut: () => Promise<void> } {
  const [session, setSession] = useState<SessionState>({ status: 'loading' });
  const refresh = useCallback(async () => { setSession(await fetchMe()); }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const signOut = useCallback(async () => {
    const csrf = session.status === 'signedIn' ? session.me.csrf : null;
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'same-origin', headers: csrf ? { 'X-CSRF-Token': csrf } : {} });
    } finally {
      setSession({ status: 'signedOut' });
    }
  }, [session]);
  return { session, refresh, signOut };
}

export const initials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase();
};
