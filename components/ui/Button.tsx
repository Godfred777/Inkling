import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface',
          {
            // Primary Button (AI Action) - with subtle gradient
            'bg-primary-container text-on-primary-container hover:bg-primary hover:shadow-ambient bg-gradient-to-br from-primary-container to-primary':
              variant === 'primary',
            // Secondary Button
            'text-primary bg-transparent hover:bg-surface-container-highest btn-secondary-hover':
              variant === 'secondary',
            // Ghost Button
            'text-on-surface-variant bg-transparent hover:bg-surface-container hover:text-on-surface':
              variant === 'ghost',
            // Sizes
            'px-3 py-1.5 text-label-md': size === 'sm',
            'px-4 py-2 text-body-md': size === 'md',
            'px-6 py-3 text-body-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
