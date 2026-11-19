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
  /** Inside a document: its title and save state ("Saved to Locker"). */
  doc?: { title: string; status?: string; onRename?: () => void };
  /** The one primary action in the top bar (usually Share). */
  primary?: ReactNode;
  searchPlaceholder?: string;
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

function FrameView({ app, user, onSignOut, onSignIn, doc, primary, searchPlaceholder, rail, panel, side, homeHref = '/', children }: ClerdoFrameProps) {
  const a = appById(app);
  const { theme } = useTheme();
  const [palette, setPalette] = useState(false);
  const placeholder = searchPlaceholder ?? `Search in ${a.name} or run a command`;
  useEffect(() => { document.title = doc ? `${doc.title} · ${a.name}` : `${a.name} · Clerdo`; }, [doc, a.name]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="cl-root cl-frame">
      <a className="cl-skip" href="#cl-main">Skip to content</a>
      <header className="cl-topbar">
        <a className="cl-topbar__brand" href={homeHref}>
          <img className="cl-logo" src={theme === 'dark' ? markForDark : markForLight} alt="Clerdo" />
          <span className="cl-topbar__app">{a.name}</span>
        </a>
        {doc && (
          <div className="cl-topbar__doc">
            {doc.onRename
              ? <button type="button" className="cl-topbar__title cl-topbar__title--btn" onClick={doc.onRename} title="Rename">{doc.title}</button>
              : <span className="cl-topbar__title">{doc.title}</span>}
            {doc.status && <span className="cl-topbar__status"><Icon name="check" />{doc.status}</span>}
          </div>
        )}
        <div className="cl-topbar__spacer" />
        <button type="button" className="cl-search" onClick={() => setPalette(true)}>
          <Icon name="search" /><span>{placeholder}</span><kbd>Ctrl K</kbd>
        </button>
        <div className="cl-topbar__spacer" />
        <div className="cl-topbar__actions">
          {primary}
          <AppSwitcher current={app} />
          {user ? <AccountMenu user={user} onSignOut={onSignOut} /> : onSignIn && <Button variant="primary" onClick={onSignIn}>Sign in</Button>}
        </div>
      </header>
      <div className="cl-frame__body">
        {rail}
        {panel}
        <main id="cl-main" className="cl-frame__main" tabIndex={-1}>{children}</main>
        {side}
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} placeholder={placeholder} />
      <Overlays />
    </div>
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
        <p className="cl-muted">{message ?? `${a.tagline}, with your Clerdo account.`}</p>
        <Button variant="primary" onClick={onSignIn}>Sign in with Clerdo</Button>
      </div>
    </div>
  );
}
