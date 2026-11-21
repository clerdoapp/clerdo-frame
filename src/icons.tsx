import type { SVGProps } from 'react';

/** Clerdo interface icons: 24px grid, 1.8px round strokes, drawn in currentColor. */
const PATHS = {
  plus: 'M12 5v14M5 12h14',
  home: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  users: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a6 6 0 0 1 5 6',
  star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  template: 'M4 4h16v16H4zM4 9h16M9 9v11',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  share: 'M12 3v12M7 8l5-5 5 5M5 14v6h14v-6',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  apps: 'M5 5h2v2H5zM11 5h2v2h-2zM17 5h2v2h-2zM5 11h2v2H5zM11 11h2v2h-2zM17 11h2v2h-2zM5 17h2v2H5zM11 17h2v2h-2zM17 17h2v2h-2z',
  check: 'M5 12l4 4 10-10',
  x: 'M6 6l12 12M18 6 6 18',
  file: 'M6 3h8l5 5v13H6zM14 3v5h5',
  folder: 'M3 6h6l2 2h10v11H3z',
  folderPlus: 'M3 6h6l2 2h10v11H3zM12 11v5M9.5 13.5h5',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
  pencil: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  move: 'M3 6h6l2 2h10v11H3zM10 13h6M13 10l3 3-3 3',
  restore: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM9 12l2 2 4-4',
  key: 'M8 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 11h10M18 11v3M15 11v2',
  lock: 'M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3M12 15v2',
  card: 'M3 6h18v12H3zM3 10h18M7 15h3',
  device: 'M4 5h16v11H4zM2 19h20M10 16v3h4v-3',
  phone: 'M8 3h8v18H8zM11 18h2',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  timer: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2 2M9 2h6',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1',
  image: 'M4 4h16v16H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  tiles: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  cloud: 'M7 18a5 5 0 0 1-.5-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z',
  warning: 'M12 3 2 20h20zM12 10v4M12 17h.01',
} as const;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

/** Icons that point along the reading direction mirror in right-to-left languages. */
const DIRECTIONAL = new Set<IconName>(['chevronRight', 'logout', 'move']);

export function Icon({ name, size = 20, className, ...rest }: IconProps) {
  const cls = ['cl-icon', DIRECTIONAL.has(name) ? 'cl-flip' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <svg className={cls} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
      <path d={PATHS[name]} />
    </svg>
  );
}
