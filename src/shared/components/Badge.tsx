import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
}) => {
  const styles = {
    primary: 'bg-accent/10 text-accent dark:bg-accent/25 dark:text-accent-hover',
    success: 'bg-success/15 text-success dark:bg-success/20 dark:text-success',
    warning: 'bg-warning/15 text-warning dark:bg-warning/20 dark:text-warning',
    danger: 'bg-danger/15 text-danger dark:bg-danger/20 dark:text-danger',
    secondary: 'bg-elevated text-text-secondary border border-border/10',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full leading-none select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
export default Badge;
