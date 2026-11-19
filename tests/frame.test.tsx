import { describe, expect, it, beforeAll } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { CLERDO_APPS, switcherGroups, appById } from '../src/apps';
import { filterCommands, type Command } from '../src/context';
import { resolveTheme } from '../src/theme';
import { greetingFor } from '../src/Layout';
import { initials, signInUrl } from '../src/session';
import { ClerdoFrame, Rail, RailItem, useFrame } from '../src/index';

beforeAll(() => { (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true; });

describe('app list', () => {
  it('has the 13 apps of the plan, each id once', () => {
    expect(CLERDO_APPS).toHaveLength(13);
    expect(new Set(CLERDO_APPS.map((a) => a.id)).size).toBe(13);
  });
  it('hides upcoming apps from the switcher except the current one', () => {
    const ids = (cur?: Parameters<typeof switcherGroups>[0]) => switcherGroups(cur).flatMap((g) => g.apps.map((a) => a.id));
    expect(ids()).not.toContain('agenda');
    expect(ids()).toContain('locker');
    expect(ids('agenda')).toContain('agenda');
    expect(switcherGroups().map((g) => g.group)).toEqual(['Work', 'Creative', 'Business & platform']);
  });
  it('throws on an unknown app', () => {
    expect(() => appById('nope' as never)).toThrow();
  });
});

describe('commands', () => {
  const run = () => undefined;
  const cmds: Command[] = [
    { id: '1', title: 'New folder', run },
    { id: '2', title: 'Upload files', keywords: 'add import', run },
    { id: '3', title: 'Budget 2026.xlsx', hint: 'Locker › Finance', run },
  ];
  it('matches every word across title, hint and keywords', () => {
    expect(filterCommands(cmds, 'finance budget').map((c) => c.id)).toEqual(['3']);
    expect(filterCommands(cmds, 'import').map((c) => c.id)).toEqual(['2']);
    expect(filterCommands(cmds, 'zzz')).toEqual([]);
  });
  it('ranks title starts first', () => {
    expect(filterCommands([...cmds, { id: '4', title: 'Rename folder', run }], 'fold').map((c) => c.id)).toEqual(['1', '4']);
  });
});

describe('helpers', () => {
  it('resolves the theme', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });
  it('greets by time of day with the first name', () => {
    expect(greetingFor('Hamzeh Ali', new Date(2026, 0, 1, 9))).toBe('Good morning, Hamzeh');
    expect(greetingFor('', new Date(2026, 0, 1, 20))).toBe('Good evening');
  });
  it('makes initials', () => {
    expect(initials('Eyas Abualrob')).toBe('EA');
    expect(initials('hamzeh')).toBe('H');
  });
  it('only signs in to same-site paths', () => {
    expect(signInUrl('/f/123')).toBe('/auth/login?next=%2Ff%2F123');
    expect(signInUrl('//evil.example')).toBe('/auth/login?next=%2F');
  });
});

describe('ClerdoFrame', () => {
  it('renders the top bar, rail, canvas, and opens the palette with Ctrl K', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    let ran = false;
    function Canvas() {
      const { useCommands } = useFrame();
      useCommands([{ id: 'x', title: 'Upload files', run: () => { ran = true; } }]);
      return <p>canvas</p>;
    }
    await act(async () => {
      createRoot(host).render(
        <ClerdoFrame app="locker" user={{ id: 'u', name: 'Hamzeh', email: 'h@example.com', avatar: null }} onSignOut={() => undefined}
          rail={<Rail onNew={() => undefined}><RailItem icon="home" label="Home" active /></Rail>}>
          <Canvas />
        </ClerdoFrame>,
      );
    });
    expect(host.querySelector('.cl-topbar__app')?.textContent).toBe('Locker');
    expect(host.querySelector('.cl-rail__item[aria-current]')?.textContent).toBe('Home');
    expect(host.textContent).toContain('canvas');
    expect(document.title).toBe('Locker · Clerdo');
    await act(async () => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })); });
    const item = host.querySelector<HTMLElement>('.cl-palette__item');
    expect(item?.textContent).toContain('Upload files');
    await act(async () => { item?.click(); });
    expect(ran).toBe(true);
    expect(host.querySelector('.cl-palette')).toBeNull();
  });
});
