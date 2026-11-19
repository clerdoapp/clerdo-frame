import { useEffect, useRef, useState, type ReactNode } from 'react';

/** A button-anchored popover that closes on Escape and outside clicks, and returns focus to its button. */
export function Popover({ trigger, children, align = 'end', label }: {
  trigger: (props: { open: boolean; toggle: () => void; ref: (el: HTMLButtonElement | null) => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'start' | 'end';
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const close = () => { setOpen(false); button.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    panel.current?.querySelector<HTMLElement>('a,button,input')?.focus();
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey, true); };
  }, [open]);
  return (
    <span className="cl-popover">
      {trigger({ open, toggle: () => setOpen((o) => !o), ref: (el) => { button.current = el; } })}
      {open && (
        <div ref={panel} className={`cl-popover__panel cl-popover__panel--${align}`} role="dialog" aria-label={label}>
          {children(close)}
        </div>
      )}
    </span>
  );
}
