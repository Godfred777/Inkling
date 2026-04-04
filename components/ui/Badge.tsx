import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'tertiary' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        {
          // Default (Surface)
          'bg-surface-container-high text-on-surface-variant': variant === 'default',
          // Primary (Indigo)
          'bg-primary-container/20 text-primary': variant === 'primary',
          // Tertiary (Warm Accent - AI Insights)
          'bg-tertiary-fixed/20 text-tertiary': variant === 'tertiary',
          // Success
          'bg-success/20 text-success': variant === 'success',
          // Warning
          'bg-warning/20 text-warning': variant === 'warning',
          // Sizes
          'px-2 py-0.5 text-label-sm': size === 'sm',
          'px-2.5 py-1 text-label-md': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
