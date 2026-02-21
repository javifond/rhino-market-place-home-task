import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

/**
 * Button variant styles.
 * - `primary`: Solid background with primary color (default)
 * - `secondary`: Outlined style with border
 * - `ghost`: Transparent background, text only
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Button size options.
 * - `sm`: Compact, for tight spaces (32px height)
 * - `md`: Default size (40px height)
 * - `lg`: Prominent actions (48px height)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Button content */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * Base Button component (Server Component).
 *
 * A flexible button with variant and size options. All styles use CSS
 * custom properties for brand theming compatibility.
 *
 * For interactive variants (onClick handlers), wrap in a Client Component
 * or use directly in a 'use client' component.
 *
 * @example
 * ```tsx
 * // Primary action (default)
 * <Button type="submit">Save Changes</Button>
 *
 * // Secondary with size
 * <Button variant="secondary" size="lg">
 *   Learn More
 * </Button>
 *
 * // Ghost button for subtle actions
 * <Button variant="ghost" size="sm">
 *   Cancel
 * </Button>
 *
 * // With onClick (requires 'use client' parent)
 * <Button type="button" onClick={() => alert('Clicked!')}>
 *   Click Me
 * </Button>
 * ```
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const buttonClass = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={buttonClass} {...props}>
      {children}
    </button>
  );
}
