import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { IconName } from './icons';

export interface Command {
  id: string;
  title: string;
  /** Shown under the title in the palette (e.g. the folder a file is in). */
  hint?: string;
  icon?: IconName;
  /** Extra words that should find this command. */
  keywords?: string;
  run: () => void;
}

export interface Toast { id: number; text: string; tone: 'info' | 'success' | 'error'; action?: { label: string; run: () => void } }

interface ConfirmOptions { title: string; body?: string; confirm: string; danger?: boolean }
interface PromptOptions { title: string; label: string; initial?: string; confirm: string; validate?: (v: string) => string | null }

type DialogState =
  | { kind: 'confirm'; opts: ConfirmOptions; resolve: (ok: boolean) => void }
  | { kind: 'prompt'; opts: PromptOptions; resolve: (v: string | null) => void }
  | null;

interface FrameApi {
  /** Registers commands for the palette while the calling component is mounted. */
  useCommands: (commands: Command[]) => void;
  commands: () => Command[];
  toast: (text: string, tone?: Toast['tone'], action?: Toast['action']) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  prompt: (opts: PromptOptions) => Promise<string | null>;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  dialog: DialogState;
  closeDialog: () => void;
}

const Ctx = createContext<FrameApi | null>(null);

export function FrameProvider({ children }: { children: ReactNode }) {
  const registry = useRef(new Map<symbol, Command[]>());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const nextToast = useRef(1);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((text: string, tone: Toast['tone'] = 'info', action?: Toast['action']) => {
    const id = nextToast.current++;
    setToasts((t) => [...t.slice(-2), { id, text, tone, action }]);
    setTimeout(() => dismissToast(id), action ? 8000 : 4500);
  }, [dismissToast]);

  const confirm = useCallback((opts: ConfirmOptions) => new Promise<boolean>((resolve) => setDialog({ kind: 'confirm', opts, resolve })), []);
  const prompt = useCallback((opts: PromptOptions) => new Promise<string | null>((resolve) => setDialog({ kind: 'prompt', opts, resolve })), []);
  const closeDialog = useCallback(() => setDialog(null), []);

  const useCommands = useCallback((commands: Command[]) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const key = useRef(Symbol('commands')).current;
    registry.current.set(key, commands);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => () => { registry.current.delete(key); }, [key]);
  }, []);
  const commands = useCallback(() => [...registry.current.values()].flat(), []);

  const api = useMemo<FrameApi>(() => ({ useCommands, commands, toast, confirm, prompt, toasts, dismissToast, dialog, closeDialog }),
    [useCommands, commands, toast, confirm, prompt, toasts, dismissToast, dialog, closeDialog]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useFrame(): FrameApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFrame must be used inside <ClerdoFrame> or <FrameProvider>');
  return v;
}

/** Ranks commands for a query: every word must appear; title-start matches rank first. */
export function filterCommands(all: Command[], query: string): Command[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return all.slice(0, 50);
  const scored: Array<[number, Command]> = [];
  for (const c of all) {
    const title = c.title.toLowerCase();
    const hay = `${title} ${c.hint ?? ''} ${c.keywords ?? ''}`.toLowerCase();
    if (!words.every((w) => hay.includes(w))) continue;
    const first = words[0] ?? '';
    const score = title.startsWith(first) ? 0 : title.includes(first) ? 1 : 2;
    scored.push([score, c]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, 50).map(([, c]) => c);
}
