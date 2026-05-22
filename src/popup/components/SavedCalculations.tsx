import React from 'react';
import { useCalculatorStore } from '../../shared/store/useCalculatorStore';
import { formatCurrency } from '../../shared/lib/formatCurrency';
import Badge from '../../shared/components/Badge';
import { Trash2, ExternalLink, Calendar, RefreshCcw } from 'lucide-react';
import { CostCalculation } from '../../shared/types/calculation';
import { translate } from '../../shared/locales';

export const SavedCalculations: React.FC = () => {
  const { history, deleteCalculation, clearHistory, setInputs, calculate, settings } = useCalculatorStore();

  const t = (key: string) => translate(key, settings.language);

  const handleLoad = (calc: CostCalculation) => {
    setInputs({
      currentProductName: calc.productName || '',
      currentPrice: calc.price.toString(),
      currentCurrency: calc.currency,
      currentCustomCurrencySymbol: calc.customCurrencySymbol || '',
      currentDurationValue: calc.ownershipDurationValue.toString(),
      currentDurationUnit: calc.ownershipDurationUnit,
      currentUsesPerWeek: calc.usesPerWeek.toString(),
      currentResaleValue: calc.resaleValue ? calc.resaleValue.toString() : '',
      currentMaintenanceCost: calc.maintenanceCost ? calc.maintenanceCost.toString() : '',
    });
    // Trigger calculation
    setTimeout(() => {
      calculate();
    }, 50);
  };

  const handleOpenOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html', '_blank');
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-elevated flex items-center justify-center text-text-secondary mb-4 border border-border/10">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-text-primary mb-1 select-none">{t('history.empty')}</h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-[240px]">
          {t('history.emptySub')}
        </p>
      </div>
    );
  }

  // Display only the last 3 in the popup
  const recentHistory = history.slice(0, 3);

  return (
    <div className="flex flex-col gap-3.5 animate-fade-in">
      <div className="flex justify-between items-center select-none">
        <span className="text-xs font-bold text-text-secondary">
          {t('history.recentTitle')}
        </span>
        <div className="flex gap-2">
          {history.length > 3 && (
            <button
               onClick={handleOpenOptions}
               className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              <span>{t('history.viewAll').replace('{count}', history.length.toString())}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={clearHistory}
            className="text-xs text-danger font-semibold hover:underline"
          >
            {t('history.btnClear')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {recentHistory.map((item) => (
          <div
            key={item.id}
            className="group relative flex justify-between items-center p-3.5 bg-surface border border-border/60 rounded-2xl hover:border-accent/40 shadow-premium dark:shadow-premium-dark hover:shadow-premium-hover transition-all duration-200"
          >
            <div
              onClick={() => handleLoad(item)}
              className="flex-1 flex flex-col gap-1 pr-8 cursor-pointer select-text"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary max-w-[140px] truncate block">
                  {item.productName || 'Product'}
                </span>
                <span className="text-[10px] text-text-secondary font-medium">
                  ({item.ownershipDurationValue}{item.ownershipDurationUnit === 'years' ? t('common.yrShort') : t('common.moShort')})
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-extrabold text-accent">
                  {formatCurrency(item.costPerUse, item.currency, item.customCurrencySymbol)}
                </span>
                <span className="text-[10px] text-text-secondary font-medium select-none">
                  {t('results.perUseLabel')}
                </span>
              </div>
              <div>
                <Badge variant={
                  item.valueRating === 'excellent' ? 'success' : 
                  item.valueRating === 'good' ? 'primary' : 
                  item.valueRating === 'think_twice' ? 'warning' : 'danger'
                } className="text-[8px] py-0 px-2 select-none font-bold">
                  {t('results.ratingLabels.' + item.valueRating)}
                </Badge>
              </div>
            </div>

            <div className="absolute right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleLoad(item)}
                className="text-text-secondary hover:text-accent p-1.5 rounded-lg hover:bg-elevated transition-colors"
                title={t('history.restoreTooltip')}
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteCalculation(item.id)}
                className="text-text-secondary hover:text-danger p-1.5 rounded-lg hover:bg-elevated transition-colors"
                title={t('history.deleteTooltip')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SavedCalculations;
