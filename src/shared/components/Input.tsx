import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  warning?: string;
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, warning, prefixElement, suffixElement, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const id = props.id ?? generatedId;
    const feedbackId = `${id}-feedback`;
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-secondary select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3.5 text-text-secondary/80 pointer-events-none flex items-center justify-center font-medium">
              {prefixElement}
            </div>
          )}
          <input
            ref={ref}
            step={props.type === 'number' && props.inputMode === 'decimal' ? 'any' : undefined}
            className={`
              app-input w-full bg-surface text-text-primary text-sm rounded-xl border border-border/80 px-3.5 py-2.5
              placeholder:text-text-secondary/40 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all duration-200
              ${prefixElement ? 'pl-9' : ''}
              ${suffixElement ? 'pr-9' : ''}
              ${error ? 'border-danger/80 focus:border-danger focus:ring-danger/25' : ''}
              ${className}
            `}
            {...props}
            id={id}
            aria-invalid={error ? true : props['aria-invalid']}
            aria-describedby={[props['aria-describedby'], (error || warning) ? feedbackId : ''].filter(Boolean).join(' ') || undefined}
          />
          {suffixElement && (
            <div className="absolute right-3.5 text-text-secondary/80 pointer-events-none flex items-center justify-center font-medium">
              {suffixElement}
            </div>
          )}
        </div>
        {error && (
          <span id={feedbackId} className="text-xs text-danger font-medium leading-none mt-0.5 animate-slide-in">
            {error}
          </span>
        )}
        {!error && warning && (
          <span id={feedbackId} className="text-xs text-warning font-medium leading-normal mt-0.5 animate-slide-in">
            {warning}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
