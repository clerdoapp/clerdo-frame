import { useEffect, useRef, useState } from 'react';
import { useFrame } from './context';
import { Button } from './Button';
import { Icon } from './icons';

/** Renders the frame's toasts and its confirm / prompt dialogs. */
export function Overlays() {
  const { toasts, dismissToast, dialog, closeDialog } = useFrame();
  return (
    <>
      <div className="cl-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`cl-toast cl-toast--${t.tone}`}>
            <Icon name={t.tone === 'error' ? 'warning' : t.tone === 'success' ? 'check' : 'info'} />
            <span>{t.text}</span>
            {t.action && <button type="button" className="cl-toast__action" onClick={() => { dismissToast(t.id); t.action?.run(); }}>{t.action.label}</button>}
            <button type="button" className="cl-toast__close" aria-label="Dismiss" onClick={() => dismissToast(t.id)}><Icon name="x" size={16} /></button>
          </div>
        ))}
      </div>
      {dialog && <DialogView key={dialog.opts.title} dialog={dialog} close={closeDialog} />}
    </>
  );
}

function DialogView({ dialog, close }: { dialog: NonNullable<ReturnType<typeof useFrame>['dialog']>; close: () => void }) {
  const [value, setValue] = useState(dialog.kind === 'prompt' ? dialog.opts.initial ?? '' : '');
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const ok = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (dialog.kind === 'prompt') { input.current?.focus(); input.current?.select(); } else ok.current?.focus();
  }, [dialog]);
  const cancel = () => { close(); if (dialog.kind === 'confirm') dialog.resolve(false); else dialog.resolve(null); };
  const submit = () => {
    if (dialog.kind === 'confirm') { close(); dialog.resolve(true); return; }
    const v = value.trim();
    const err = v === '' ? 'Enter a name' : dialog.opts.validate?.(v) ?? null;
    if (err) { setError(err); return; }
    close(); dialog.resolve(v);
  };
  return (
    <div className="cl-scrim" onPointerDown={(e) => { if (e.target === e.currentTarget) cancel(); }} onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); cancel(); } }}>
      <form className="cl-dialog" role="dialog" aria-modal="true" aria-labelledby="cl-dialog-title" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <h2 id="cl-dialog-title" className="cl-dialog__title">{dialog.opts.title}</h2>
        {dialog.kind === 'confirm' && dialog.opts.body && <p className="cl-dialog__body">{dialog.opts.body}</p>}
        {dialog.kind === 'prompt' && (
          <label className="cl-field">{dialog.opts.label}
            <input ref={input} className="cl-input" value={value} onChange={(e) => { setValue(e.target.value); setError(null); }} aria-invalid={error ? true : undefined} maxLength={255} />
            {error && <span className="cl-field__error">{error}</span>}
          </label>
        )}
        <div className="cl-dialog__actions">
          <Button variant="ghost" onClick={cancel}>Cancel</Button>
          <Button ref={ok} type="submit" variant={dialog.kind === 'confirm' && dialog.opts.danger ? 'danger' : 'primary'}>{dialog.opts.confirm}</Button>
        </div>
      </form>
    </div>
  );
}
