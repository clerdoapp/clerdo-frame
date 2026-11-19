import { useEffect, useMemo, useRef, useState } from 'react';
import { filterCommands, useFrame } from './context';
import { Icon } from './icons';

/** Ctrl K / Cmd K: search the app's commands (and whatever the app registers, like files). */
export function CommandPalette({ open, onClose, placeholder }: { open: boolean; onClose: () => void; placeholder: string }) {
  const { commands } = useFrame();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useMemo(() => (open ? filterCommands(commands(), q) : []), [open, q, commands]);
  useEffect(() => { if (open) { setQ(''); setActive(0); setTimeout(() => input.current?.focus(), 0); } }, [open]);
  useEffect(() => setActive(0), [q]);
  if (!open) return null;
  const run = (i: number) => { const c = list[i]; if (c) { onClose(); c.run(); } };
  return (
    <div className="cl-scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cl-palette" role="dialog" aria-modal="true" aria-label="Search and commands">
        <div className="cl-palette__field">
          <Icon name="search" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="cl-palette-list"
            aria-activedescendant={list[active] ? `cl-cmd-${active}` : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === 'Enter') { e.preventDefault(); run(active); }
              else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="cl-palette-list" className="cl-palette__list" role="listbox">
          {list.length === 0 && <li className="cl-palette__empty">No matches</li>}
          {list.map((c, i) => (
            <li key={c.id} id={`cl-cmd-${i}`} role="option" aria-selected={i === active} className="cl-palette__item" onPointerMove={() => setActive(i)} onClick={() => run(i)}>
              <Icon name={c.icon ?? 'chevronRight'} />
              <span className="cl-palette__title">{c.title}</span>
              {c.hint && <span className="cl-palette__hint">{c.hint}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
