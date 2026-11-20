import { CLERDO_HOME, switcherGroups, type ClerdoAppId } from './apps';
import { t } from './text';
import { AppIcon } from './AppIcon';
import { Button } from './Button';
import { Popover } from './Popover';

export function AppSwitcher({ current }: { current: ClerdoAppId }) {
  return (
    <Popover
      label={t('Clerdo apps')}
      trigger={({ open, toggle, ref }) => (
        <Button ref={ref} variant="ghost" icon="apps" iconOnly label={t('Clerdo apps')} aria-expanded={open} aria-haspopup="dialog" onClick={toggle} />
      )}
    >
      {() => (
        <nav className="cl-switcher" aria-label={t('Clerdo apps')}>
          {switcherGroups(current).map((g) => (
            <div key={g.group}>
              <div className="cl-switcher__group">{t(g.group)}</div>
              <div className="cl-switcher__grid">
                {g.apps.map((a) => (
                  <a key={a.id} className="cl-switcher__app" href={a.url} aria-current={a.id === current ? 'true' : undefined}>
                    <AppIcon app={a.id} />
                    {a.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div className="cl-switcher__foot"><a href={CLERDO_HOME}>clerdo.app</a></div>
        </nav>
      )}
    </Popover>
  );
}
