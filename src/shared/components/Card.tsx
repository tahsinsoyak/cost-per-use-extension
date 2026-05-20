import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-surface border border-border/50 rounded-2xl p-5
        ${elevated ? 'shadow-premium dark:shadow-premium-dark' : ''}
        ${hoverable ? 'hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover transition-all duration-200 hover:-translate-y-[1px]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
