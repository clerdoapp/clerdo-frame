import { appById, type ClerdoAppId } from './apps';

/** Placeholder app icon: the app's identity color with its initial, until the icon set is drawn from the ribbon mark. */
export function AppIcon({ app, size = 40 }: { app: ClerdoAppId; size?: number }) {
  const a = appById(app);
  return (
    <span
      className="cl-appicon"
      aria-hidden="true"
      style={{ ['--c' as string]: `var(--app-${a.id})`, color: a.id === 'account' ? 'var(--bg)' : a.glyph === 'light' ? '#fff' : '#121417', width: size, height: size, fontSize: Math.round(size * 0.42), borderRadius: size <= 28 ? 'var(--radius-sm)' : undefined }}
    >
      <span>{a.name[0]}</span>
    </span>
  );
}
