import React, { useEffect } from 'react';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useCalculatorStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-success" />,
    error: <AlertCircle className="w-4 h-4 text-danger" />,
    info: <Info className="w-4 h-4 text-accent" />,
  };

  const borderColors = {
    success: 'border-success/30 bg-success/5 dark:bg-success/10',
    error: 'border-danger/30 bg-danger/5 dark:bg-danger/10',
    info: 'border-accent/30 bg-accent/5 dark:bg-accent/10',
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[9999] 
        flex items-center gap-2.5 px-4 py-3 bg-surface border rounded-xl 
        shadow-premium dark:shadow-premium-dark max-w-[90%] w-max animate-scale-in 
        text-xs font-semibold
        ${borderColors[toast.type]}
      `}
    >
      <span className="flex-shrink-0">{icons[toast.type]}</span>
      <span className="text-text-primary pr-2">{toast.message}</span>
      <button
        onClick={clearToast}
        className="text-text-secondary hover:text-text-primary transition-colors p-0.5 rounded-md hover:bg-elevated/50"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
export default Toast;
