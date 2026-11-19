import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from './icons';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  /** Icon-only button: `children` is ignored, `label` becomes the accessible name and tooltip. */
  iconOnly?: boolean;
  label?: string;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', icon, iconOnly, label, className, children, type = 'button', ...rest },
  ref,
) {
  const cls = ['cl-btn', `cl-btn--${variant}`, iconOnly ? 'cl-btn--icon' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <button ref={ref} type={type} className={cls} aria-label={iconOnly ? label : undefined} title={iconOnly ? label : undefined} {...rest}>
      {icon && <Icon name={icon} />}
      {!iconOnly && children}
    </button>
  );
});
