import React from 'react';
import { useCalculatorStore } from '../../shared/store/useCalculatorStore';
import { formatCurrency } from '../../shared/lib/formatCurrency';
import Badge from '../../shared/components/Badge';
import { Trash2, TrendingDown, HelpCircle } from 'lucide-react';
import { translate } from '../../shared/locales';

export const ProductComparison: React.FC = () => {
  const { comparisonList, removeFromComparison, clearComparison, settings } = useCalculatorStore();

  const t = (key: string) => translate(key, settings.language);

  if (comparisonList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-elevated flex items-center justify-center text-text-secondary mb-4 border border-border/10">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-text-primary mb-1 select-none">
          {t('compare.emptyTitle')}
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-[240px]">
          {t('compare.empty')}
        </p>
      </div>
    );
  }

  // Calculate lowest and highest cost per use
  let lowestId = '';
  let highestId = '';
  let minCost = Infinity;
  let maxCost = -Infinity;

  if (comparisonList.length > 1) {
    comparisonList.forEach((item) => {
      if (item.costPerUse < minCost) {
        minCost = item.costPerUse;
        lowestId = item.id;
      }
      if (item.costPerUse > maxCost) {
        maxCost = item.costPerUse;
        highestId = item.id;
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex justify-between items-center select-none">
        <span className="text-xs font-bold text-text-secondary">
          {t('compare.comparingCount').replace('{count}', comparisonList.length.toString())}
        </span>
        <button
          onClick={clearComparison}
          className="text-xs text-danger font-semibold hover:underline"
        >
          {t('compare.btnClear')}
        </button>
      </div>

      <div className="comparison-grid grid gap-3">
        {comparisonList.map((item) => {
          const isBestValue = comparisonList.length > 1 && item.id === lowestId;
          const isHighestCost = comparisonList.length > 1 && item.id === highestId;

          return (
            <div
              key={item.id}
              className={`
                compare-card relative flex flex-col justify-between bg-surface border rounded-2xl p-3 shadow-premium dark:shadow-premium-dark transition-all duration-200
                ${isBestValue ? 'border-success/60 ring-1 ring-success/30 bg-success/[0.01]' : 'border-border/60'}
                ${isHighestCost ? 'border-danger/30' : ''}
              `}
            >
              {/* Delete button */}
              <button
                onClick={() => removeFromComparison(item.id)}
                className="absolute top-2 right-2 text-text-secondary hover:text-danger p-1 rounded-lg hover:bg-elevated transition-colors"
                title={t('compare.btnRemove')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col gap-1.5 pr-4 select-text">
                <span className="text-xs font-bold text-text-primary truncate block" title={item.productName || 'Unnamed'}>
                  {item.productName || t('common.productDefault')}
                </span>
                
                {/* Cost per Use */}
                <div className="flex flex-col mt-1">
                  <span className="text-[10px] text-text-secondary font-medium">
                    {t('compare.rowCostUse')}
                  </span>
                  <span className={`text-base font-extrabold tracking-tight ${isBestValue ? 'text-success' : 'text-accent'}`}>
                    {formatCurrency(item.costPerUse, item.currency, item.customCurrencySymbol)}
                  </span>
                </div>

                {/* Best Value badge */}
                {isBestValue && (
                  <Badge variant="success" className="py-0 px-2 text-[9px] w-max font-bold">
                    {t('compare.bestBadge')}
                  </Badge>
                )}
                {isHighestCost && (
                  <Badge variant="danger" className="py-0 px-2 text-[9px] w-max font-bold">
                    {t('compare.highestBadge')}
                  </Badge>
                )}

                <div className="border-t border-border/30 my-1.5"></div>

                {/* Specs */}
                <div className="flex flex-col gap-1 text-[10px] text-text-secondary">
                  <div className="flex justify-between">
                    <span>{t('compare.rowPrice')}</span>
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(item.price, item.currency, item.customCurrencySymbol, true)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('compare.rowDuration')}</span>
                    <span className="font-semibold text-text-primary">
                      {item.ownershipDurationValue} {
                        t(item.ownershipDurationUnit === 'years' ? 'common.yrShort' : 'common.moShort')
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('compare.rowUsesWeek')}</span>
                    <span className="font-semibold text-text-primary">{item.usesPerWeek}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('compare.rowUses')}</span>
                    <span className="font-semibold text-text-primary">{item.totalEstimatedUses}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {comparisonList.length > 1 && minCost !== Infinity && (
        <div className="flex gap-2.5 p-3.5 bg-success/5 border border-success/20 rounded-xl items-start">
          <TrendingDown className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-text-secondary leading-normal">
            <strong>{t('compare.insightTitle')}</strong>{' '}
            {t('compare.insightDescription')}
          </p>
        </div>
      )}
    </div>
  );
};
export default ProductComparison;
