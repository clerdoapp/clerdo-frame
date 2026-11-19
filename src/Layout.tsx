import type { ReactNode } from 'react';
import { Button } from './Button';
import { Icon, type IconName } from './icons';

export interface RailItemProps { icon: IconName; label: string; active?: boolean; onClick?: () => void; href?: string; badge?: number }

export function RailItem({ icon, label, active, onClick, href, badge }: RailItemProps) {
  const inner = (
    <>
      <span className="cl-rail__pill"><Icon name={icon} />{badge ? <span className="cl-rail__badge">{badge > 99 ? '99+' : badge}</span> : null}</span>
      {label}
    </>
  );
  return href
    ? <a className="cl-rail__item" href={href} aria-current={active ? 'page' : undefined}>{inner}</a>
    : <button type="button" className="cl-rail__item" aria-current={active ? 'true' : undefined} onClick={onClick}>{inner}</button>;
}

/** The left rail: an optional orange New button, items, and items pinned to the bottom. */
export function Rail({ onNew, newLabel = 'New', children, bottom }: { onNew?: () => void; newLabel?: string; children: ReactNode; bottom?: ReactNode }) {
  return (
    <nav className="cl-rail" aria-label="Sections">
      {onNew && <button type="button" className="cl-rail__new" aria-label={newLabel} title={newLabel} onClick={onNew}><Icon name="plus" /></button>}
      {children}
      <div className="cl-rail__spacer" />
      {bottom}
    </nav>
  );
}

/** A 300px tool panel (left) or 340px side panel (right) with a header and close button. */
export function Panel({ title, side = 'tool', onClose, children, actions }: { title: string; side?: 'tool' | 'side'; onClose?: () => void; children: ReactNode; actions?: ReactNode }) {
  return (
    <aside className={side === 'side' ? 'cl-panel cl-panel--side' : 'cl-panel'} aria-label={title}>
      <div className="cl-panel__head">
        <span>{title}</span>
        <span className="cl-panel__actions">{actions}{onClose && <Button variant="ghost" icon="x" iconOnly label="Close panel" onClick={onClose} />}</span>
      </div>
      <div className="cl-panel__body">{children}</div>
    </aside>
  );
}

/** The home screen every app shows when nothing is open: greeting, Start new, then the app's content. */
export function HomeScreen({ greeting, subtitle, children }: { greeting: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="cl-home">
      <div><h1 className="cl-home__greet">{greeting}</h1>{subtitle && <p className="cl-home__sub">{subtitle}</p>}</div>
      {children}
    </div>
  );
}

export function HomeSection({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="cl-home__block">
      <div className="cl-home__head"><h2 className="cl-home__section">{title}</h2>{actions}</div>
      {children}
    </section>
  );
}

export function NewCard({ label, onClick, blank, thumb }: { label: string; onClick: () => void; blank?: boolean; thumb?: ReactNode }) {
  return (
    <button type="button" className={blank ? 'cl-newcard cl-newcard--blank' : 'cl-newcard'} onClick={onClick}>
      <span className="cl-newcard__thumb">{thumb ?? <Icon name={blank ? 'plus' : 'template'} />}</span>
      {label}
    </button>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="cl-empty">
      <span className="cl-empty__icon"><Icon name={icon} size={28} /></span>
      <h3>{title}</h3>
      {body && <p className="cl-muted">{body}</p>}
      {action}
    </div>
  );
}

/** Greeting by local time of day. */
export const greetingFor = (name: string, now = new Date()): string => {
  const h = now.getHours();
  const first = name.trim().split(/\s+/)[0] ?? '';
  const part = h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  return first ? `${part}, ${first}` : part;
};
