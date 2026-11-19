/** The Clerdo lineup. Mirrors claude/clerdo-apps.md in the Clerdo project: change it there first. */
export type ClerdoDivision = 'work' | 'creative' | 'business' | 'platform' | 'kelvo';
export type ClerdoAppId = 'draft' | 'grid' | 'frame' | 'rix' | 'agenda' | 'survey' | 'scrap' | 'zoetra' | 'vector' | 'core' | 'locker' | 'account' | 'kelvo';

export interface ClerdoApp {
  id: ClerdoAppId;
  name: string;
  marketingName: string;
  division: ClerdoDivision;
  url: string;
  tagline: string;
  /** Ink or white letter on the app color, whichever reads better (placeholder icons). */
  glyph: 'light' | 'dark';
  upcoming?: boolean;
}

export const CLERDO_HOME = 'https://clerdo.app';

export const CLERDO_DIVISIONS: ReadonlyArray<{ id: ClerdoDivision; name: string; switcherGroup: string }> = [
  { id: 'work', name: 'Clerdo Work', switcherGroup: 'Work' },
  { id: 'creative', name: 'Clerdo Creative', switcherGroup: 'Creative' },
  { id: 'business', name: 'Clerdo Business', switcherGroup: 'Business & platform' },
  { id: 'platform', name: 'Clerdo Platform', switcherGroup: 'Business & platform' },
  { id: 'kelvo', name: 'Kelvo', switcherGroup: 'Business & platform' },
];

export const CLERDO_APPS: ReadonlyArray<ClerdoApp> = [
  { id: 'draft', name: 'Draft', marketingName: 'Clerdo Draft', division: 'work', url: 'https://draft.clerdo.app', tagline: 'Documents', glyph: 'light' },
  { id: 'grid', name: 'Grid', marketingName: 'Clerdo Grid', division: 'work', url: 'https://grid.clerdo.app', tagline: 'Spreadsheets', glyph: 'light' },
  { id: 'frame', name: 'Frame', marketingName: 'Clerdo Frame', division: 'work', url: 'https://frame.clerdo.app', tagline: 'Presentations', glyph: 'dark' },
  { id: 'rix', name: 'Rix', marketingName: 'Rix', division: 'work', url: 'https://rix.clerdo.app', tagline: 'Mail', glyph: 'dark' },
  { id: 'agenda', name: 'Agenda', marketingName: 'Clerdo Agenda', division: 'work', url: 'https://agenda.clerdo.app', tagline: 'Calendar', glyph: 'light', upcoming: true },
  { id: 'survey', name: 'Survey', marketingName: 'Clerdo Survey', division: 'work', url: 'https://survey.clerdo.app', tagline: 'Forms and surveys', glyph: 'dark', upcoming: true },
  { id: 'scrap', name: 'Scrap', marketingName: 'Clerdo Scrap', division: 'work', url: 'https://scrap.clerdo.app', tagline: 'Notes', glyph: 'dark', upcoming: true },
  { id: 'zoetra', name: 'Zoetra', marketingName: 'Zoetra', division: 'creative', url: 'https://zoetra.clerdo.app', tagline: 'Video editing', glyph: 'light' },
  { id: 'vector', name: 'Vector', marketingName: 'Clerdo Vector', division: 'creative', url: 'https://github.com/clerdoapp/clerdovector/releases/latest', tagline: 'Illustration and drawing', glyph: 'light' },
  { id: 'core', name: 'Core', marketingName: 'Clerdo Core', division: 'business', url: 'https://cm.clerdo.app', tagline: 'Run your company', glyph: 'light' },
  { id: 'locker', name: 'Locker', marketingName: 'Clerdo Locker', division: 'platform', url: 'https://locker.clerdo.app', tagline: 'Your files', glyph: 'dark' },
  { id: 'account', name: 'Account', marketingName: 'Clerdo Account', division: 'platform', url: 'https://account.clerdo.app', tagline: 'Your account and family', glyph: 'light' },
  { id: 'kelvo', name: 'Kelvo', marketingName: 'Kelvo OS', division: 'kelvo', url: 'https://kelvo.clerdo.app', tagline: 'The Clerdo operating system', glyph: 'light' },
];

export const appById = (id: ClerdoAppId): ClerdoApp => {
  const app = CLERDO_APPS.find((a) => a.id === id);
  if (!app) throw new Error(`Unknown Clerdo app: ${id}`);
  return app;
};

/** Switcher groups in order, without apps that have not shipped. The current app is always listed. */
export function switcherGroups(current?: ClerdoAppId): Array<{ group: string; apps: ClerdoApp[] }> {
  const groups: Array<{ group: string; apps: ClerdoApp[] }> = [];
  for (const d of CLERDO_DIVISIONS) {
    const apps = CLERDO_APPS.filter((a) => a.division === d.id && (!a.upcoming || a.id === current));
    if (apps.length === 0) continue;
    const g = groups.find((x) => x.group === d.switcherGroup);
    if (g) g.apps.push(...apps);
    else groups.push({ group: d.switcherGroup, apps });
  }
  return groups;
}
