import { appById } from './apps';
import { Icon } from './icons';
import { Popover } from './Popover';
import { initials, type ClerdoUser } from './session';
import { useTheme, type ThemeChoice } from './theme';

export function AccountMenu({ user, onSignOut }: { user: ClerdoUser; onSignOut: () => void }) {
  const { choice, setChoice } = useTheme();
  const themes: Array<[ThemeChoice, string]> = [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']];
  return (
    <Popover
      label="Account"
      trigger={({ open, toggle, ref }) => (
        <button ref={ref} type="button" className="cl-avatar" aria-label={`Account: ${user.name}`} aria-expanded={open} onClick={toggle}>
          {user.avatar ? <img src={user.avatar} alt="" /> : initials(user.name)}
        </button>
      )}
    >
      {(close) => (
        <div className="cl-menu cl-account">
          <div className="cl-account__who">
            <span className="cl-avatar cl-avatar--lg" aria-hidden="true">{user.avatar ? <img src={user.avatar} alt="" /> : initials(user.name)}</span>
            <div><div className="cl-account__name">{user.name}</div><div className="cl-muted cl-account__email">{user.email}</div></div>
          </div>
          <a className="cl-menu__item" href={appById('account').url}><Icon name="gear" />Manage your Clerdo account</a>
          <div className="cl-menu__label">Appearance</div>
          <div className="cl-seg" role="radiogroup" aria-label="Appearance">
            {themes.map(([c, l]) => (
              <button key={c} type="button" role="radio" aria-checked={choice === c} className="cl-seg__item" onClick={() => setChoice(c)}>{l}</button>
            ))}
          </div>
          <div className="cl-menu__sep" />
          <button type="button" className="cl-menu__item" onClick={() => { close(); onSignOut(); }}><Icon name="logout" />Sign out</button>
        </div>
      )}
    </Popover>
  );
}
