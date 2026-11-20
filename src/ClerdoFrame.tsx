import { modKey, t } from './text';
import { useEffect, useState, type ReactNode } from 'react';
import { appById, type ClerdoAppId } from './apps';
import { AccountMenu } from './AccountMenu';
import { AppSwitcher } from './AppSwitcher';
import { Button } from './Button';
import { CommandPalette } from './CommandPalette';
import { FrameProvider } from './context';
import { Icon } from './icons';
import { Overlays } from './Overlays';
import type { ClerdoUser } from './session';
import { useTheme } from './theme';
import markForLight from './assets/mark-for-light.png';
import markForDark from './assets/mark-for-dark.png';

export interface ClerdoFrameProps {
  app: ClerdoAppId;
  user: ClerdoUser | null;
  onSignOut: () => void;
  onSignIn?: () => void;
  /**
   * Inside a document: its title and save state ("Saved to Locker"). onTitleChange makes the title editable in
   * place; onRename opens the app's own rename instead.
   */
  doc?: { title: string; status?: string; saved?: boolean; onRename?: () => void; onTitleChange?: (title: string) => void; titleLabel?: string };
  /** The one primary action in the top bar (usually Share). */
  primary?: ReactNode;
  searchPlaceholder?: string;
  /** The app's own search (Grid searches functions too): the search box opens it, and Ctrl K is left to the app. */
  onSearch?: () => void;
  /** Extra top-bar buttons, before the primary action (undo, redo, people editing, …). */
  actions?: ReactNode;
  rail?: ReactNode;
  /** The open tool panel, if any (from <Panel>). */
  panel?: ReactNode;
  /** The open side panel, if any (from <Panel side="side">). */
  side?: ReactNode;
  /** Where the app name in the top bar leads: the app's home. */
  homeHref?: string;
  children: ReactNode;
}

/** The Clerdo frame every app is built in: top bar, rail, tool panel, canvas, side panel, Ctrl K, toasts, dialogs. */
export function ClerdoFrame(props: ClerdoFrameProps) {
  return (
    <FrameProvider>
      <FrameView {...props} />
    </FrameProvider>
  );
}

function FrameView({ app, user, onSignOut, onSignIn, doc, primary, searchPlaceholder, onSearch, actions, rail, panel, side, homeHref = '/', children }: ClerdoFrameProps) {
  const a = appById(app);
  const { theme } = useTheme();
  const [palette, setPalette] = useState(false);
  const placeholder = searchPlaceholder ?? t('Search in {app} or run a command', { app: a.name });
  useEffect(() => { document.title = doc ? `${doc.title} · ${a.name}` : `${a.name} · Clerdo`; }, [doc, a.name]);
  useEffect(() => {
    if (onSearch) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSearch]);
  return (
    <div className="cl-root cl-frame">
      <a className="cl-skip" href="#cl-main">{t('Skip to content')}</a>
      <header className="cl-topbar">
        <a className="cl-topbar__brand" href={homeHref}>
          <img className="cl-logo" src={theme === 'dark' ? markForDark : markForLight} alt="Clerdo" />
          <span className="cl-topbar__app">{a.name}</span>
        </a>
        {doc && (
          <div className="cl-topbar__doc">
            {doc.onTitleChange
              ? <TitleInput value={doc.title} label={doc.titleLabel ?? t('Name')} onChange={doc.onTitleChange} />
              : doc.onRename
                ? <button type="button" className="cl-topbar__title cl-topbar__title--btn" onClick={doc.onRename} title={t('Rename')}>{doc.title}</button>
                : <span className="cl-topbar__title">{doc.title}</span>}
            {doc.status && <span className="cl-topbar__status" role="status">{doc.saved !== false && <Icon name="check" />}{doc.status}</span>}
          </div>
        )}
        <div className="cl-topbar__spacer" />
        <button type="button" className="cl-search" onClick={() => (onSearch ? onSearch() : setPalette(true))}>
          <Icon name="search" /><span>{placeholder}</span><kbd>{modKey('K')}</kbd>
        </button>
        <div className="cl-topbar__spacer" />
        <div className="cl-topbar__actions">
          {actions}
          {primary}
          <AppSwitcher current={app} />
          {user ? <AccountMenu user={user} onSignOut={onSignOut} /> : onSignIn && <Button variant="primary" onClick={onSignIn}>{t('Sign in')}</Button>}
        </div>
      </header>
      <div className="cl-frame__body">
        {rail}
        {panel}
        <main id="cl-main" className="cl-frame__main" tabIndex={-1}>{children}</main>
        {side}
      </div>
      {!onSearch && <CommandPalette open={palette} onClose={() => setPalette(false)} placeholder={placeholder} />}
      <Overlays />
    </div>
  );
}

/** The document name, edited in place; commits on blur or Enter, Escape puts it back. */
function TitleInput({ value, label, onChange }: { value: string; label: string; onChange: (v: string) => void }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = () => { const v = draft.trim(); if (v && v !== value) onChange(v); else setDraft(value); };
  return (
    <input className="cl-topbar__title cl-topbar__title--input" aria-label={label} value={draft} spellCheck={false}
      size={Math.max(8, Math.min(40, draft.length + 1))}
      onChange={(e) => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); } else if (e.key === 'Escape') { setDraft(value); requestAnimationFrame(() => (e.target as HTMLInputElement).blur()); } }} />
  );
}

/** Full-page sign-in for apps that need an account, in the Clerdo brand. */
export function SignInScreen({ app, onSignIn, message }: { app: ClerdoAppId; onSignIn: () => void; message?: string }) {
  const a = appById(app);
  const { theme } = useTheme();
  return (
    <div className="cl-root cl-signin">
      <div className="cl-signin__card">
        <img className="cl-signin__mark" src={theme === 'dark' ? markForDark : markForLight} alt="Clerdo" />
        <h1 className="cl-signin__title">{a.name}</h1>
        <p className="cl-muted">{message ?? t('{tagline}, with your Clerdo account.', { tagline: t(a.tagline) })}</p>
        <Button variant="primary" onClick={onSignIn}>{t('Sign in with Clerdo')}</Button>
      </div>
    </div>
  );
}
