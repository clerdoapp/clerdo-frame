import { appById, type ClerdoAppId } from './apps';
import draft from './assets/apps/draft.webp';
import grid from './assets/apps/grid.webp';
import frame from './assets/apps/frame.webp';
import rix from './assets/apps/rix.webp';
import agenda from './assets/apps/agenda.webp';
import survey from './assets/apps/survey.webp';
import scrap from './assets/apps/scrap.webp';
import zoetra from './assets/apps/zoetra.webp';
import vector from './assets/apps/vector.webp';
import core from './assets/apps/core.webp';
import locker from './assets/apps/locker.webp';
import account from './assets/apps/account.webp';
import kelvo from './assets/apps/kelvo.webp';

const ICONS: Record<ClerdoAppId, string> = { draft, grid, frame, rix, agenda, survey, scrap, zoetra, vector, core, locker, account, kelvo };

/** The app's icon (designed set, 2026-11-21). Decorative: the app's name is always written next to it. */
export function AppIcon({ app, size = 40 }: { app: ClerdoAppId; size?: number }) {
  const a = appById(app);
  return <img className="cl-appicon" src={ICONS[a.id]} alt="" aria-hidden="true" width={size} height={size} draggable={false} />;
}
