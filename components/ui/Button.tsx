'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-pp-primary text-white border border-pp-secondary/30 hover:bg-pp-primary/90 active:scale-[0.98]',
  secondary:
    'bg-transparent text-pp-secondary border border-pp-secondary/40 hover:border-pp-secondary/70 hover:text-white active:scale-[0.98]',
  ghost:
    'bg-transparent text-pp-text-muted hover:text-white hover:bg-white/5 active:scale-[0.98]',
  accent:
    'bg-pp-accent text-pp-bg-dark font-semibold hover:bg-pp-accent/90 shadow-glow-accent active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3.5 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-sans font-medium',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-pp-accent/60',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
