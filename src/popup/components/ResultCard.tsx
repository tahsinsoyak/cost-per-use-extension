import React, { useEffect, useState } from 'react';
import { useCalculatorStore } from '../../shared/store/useCalculatorStore';
import { formatCurrency } from '../../shared/lib/formatCurrency';
import Badge from '../../shared/components/Badge';
import Button from '../../shared/components/Button';
import { Save, Plus, AlertCircle, Calendar, RefreshCcw, TrendingUp, DollarSign, CreditCard, Clock } from 'lucide-react';
import { translate } from '../../shared/locales';

export const ResultCard: React.FC = () => {
  const { currentResult, saveCalculation, addToComparison, comparisonList, settings } = useCalculatorStore();
  const [animate, setAnimate] = useState(false);

  const t = (key: string) => translate(key, settings.language);

  useEffect(() => {
    if (currentResult) {
      setAnimate(false);
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
  }, [currentResult]);

  if (!currentResult) return null;

  const {
    price,
    currency,
    customCurrencySymbol,
    resaleValue = 0,
    maintenanceCost = 0,
    totalEstimatedUses,
    netCost,
    costPerUse,
    costPerMonth,
    costPerYear,
    costPerDay,
    valueRating,
    workHoursCost,
    workHoursPerUse,
    installmentCount,
    monthlyPayment,
    totalInstallmentCost,
    installmentInterest,
  } = currentResult;

  const isCompared = comparisonList.some((item) => item.id === currentResult.id);

  const formatWorkTime = (hours: number) => {
    const dayWord = t('results.laborCard.workDays');
    const hourWord = t('results.laborCard.hours');
    const minWord = t('results.laborCard.minutes');

    if (hours >= 8) {
      const days = Math.floor(hours / 8); // work days (8hr)
      const remainingHours = Math.round(hours % 8);
      return remainingHours > 0 
        ? `${days} ${dayWord}, ${remainingHours} ${hourWord}` 
        : `${days} ${dayWord}`;
    }
    if (hours >= 1) {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      return minutes > 0 
        ? `${wholeHours} ${hourWord}, ${minutes} ${minWord}` 
        : `${wholeHours} ${hourWord}`;
    }
    const minutes = Math.round(hours * 60);
    return `${minutes} ${minWord}`;
  };

  return (
    <div
      data-testid="calculation-result"
      className={`
        result-ledger bg-surface border border-border/70 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark
        transition-all duration-500 transform flex flex-col gap-4 select-text
        ${animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
    >
      {/* Cost Per Use Display Area */}
      <div className="result-hero relative overflow-hidden border rounded-2xl p-6 flex flex-col items-center text-center">
        {/* Decorative backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent/5 dark:bg-accent/10 rounded-full blur-2xl pointer-events-none select-none"></div>

        <span className="result-eyebrow text-[10px] font-extrabold uppercase tracking-widest mb-1.5 select-none z-10">
          {t('results.costPerUse')}
        </span>
        
        {/* Massive Premium Hero Value */}
        <h2 className="result-number text-5xl font-black text-transparent bg-clip-text mb-3 drop-shadow-sm select-all z-10">
          {formatCurrency(costPerUse, currency, customCurrencySymbol)}
        </h2>

        {/* Rating Badge */}
        <div className="z-10">
          <Badge variant={
            valueRating === 'excellent' ? 'success' : 
            valueRating === 'good' ? 'primary' : 
            valueRating === 'think_twice' ? 'warning' : 'danger'
          } className="px-3.5 py-1 text-[10px] font-extrabold shadow-sm select-none">
            {t('results.ratingLabels.' + valueRating)}
          </Badge>
        </div>

        {/* Description Copy */}
        <p className="result-copy text-[11px] leading-relaxed px-4 mt-3 select-text z-10 font-medium">
          {t(`results.ratings.${valueRating}`)}
        </p>
      </div>

      {/* Breakdowns Grid */}
      <div className="metric-grid grid gap-2.5">
        
        <div className="metric-card bg-surface border border-border/40 rounded-xl p-3 flex flex-col justify-between hover:border-accent/35 hover:-translate-y-[0.5px] transition-all duration-200 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">{t('results.metrics.totalUses')}</span>
          <span className="text-xs font-black text-text-primary mt-1 flex items-center gap-1.5">
            <RefreshCcw className="w-3.5 h-3.5 text-accent/80" />
            <span>{totalEstimatedUses} {t('results.timesLabel')}</span>
          </span>
        </div>

        <div className="metric-card bg-surface border border-border/40 rounded-xl p-3 flex flex-col justify-between hover:border-accent/35 hover:-translate-y-[0.5px] transition-all duration-200 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">{t('results.metrics.perDay')}</span>
          <span className="text-xs font-black text-text-primary mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent/80" />
            <span>{formatCurrency(costPerDay, currency, customCurrencySymbol)}</span>
          </span>
        </div>

        <div className="metric-card bg-surface border border-border/40 rounded-xl p-3 flex flex-col justify-between hover:border-accent/35 hover:-translate-y-[0.5px] transition-all duration-200 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">{t('results.metrics.perMonth')}</span>
          <span className="text-xs font-black text-text-primary mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent/80" />
            <span>{formatCurrency(costPerMonth, currency, customCurrencySymbol)}</span>
          </span>
        </div>

        <div className="metric-card bg-surface border border-border/40 rounded-xl p-3 flex flex-col justify-between hover:border-accent/35 hover:-translate-y-[0.5px] transition-all duration-200 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">{t('results.metrics.perYear')}</span>
          <span className="text-xs font-black text-text-primary mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent/80" />
            <span>{formatCurrency(costPerYear, currency, customCurrencySymbol)}</span>
          </span>
        </div>

        <div className="metric-card metric-card-wide bg-surface border border-border/40 rounded-xl p-3 flex flex-col justify-between hover:border-accent/35 hover:-translate-y-[0.5px] transition-all duration-200 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">{t('results.metrics.netCost')}</span>
          <span className="text-xs font-black text-text-primary mt-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-accent/80" />
            <span>{formatCurrency(netCost, currency, customCurrencySymbol)}</span>
          </span>
        </div>
      </div>

      {/* Equivalent Labor Time Card */}
      {workHoursCost !== undefined && workHoursCost > 0 && (
        <div className="bg-gradient-to-tr from-accent/5 to-success/5 border border-accent/20 rounded-2xl p-4 flex flex-col gap-3 hover:border-accent/35 transition-colors shadow-sm animate-slide-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/20 text-accent flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5 select-text">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">{t('results.laborCard.title')}</span>
              <span className="text-sm font-extrabold text-text-primary">
                {formatWorkTime(workHoursCost)}
              </span>
              <p className="text-[9px] text-text-secondary leading-normal">
                {t('results.laborCard.descTotal').replace('{value}', formatWorkTime(workHoursCost))}
              </p>
            </div>
          </div>

          {/* Work time per use */}
          {workHoursPerUse !== undefined && workHoursPerUse > 0 && (
            <div className="border-t border-accent/10 pt-2.5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-success/10 dark:bg-success/20 text-success flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">
                  {t('results.laborCard.laborPerUse')}
                </span>
                <span className="text-sm font-extrabold text-text-primary">
                  {t('results.laborCard.descPerUse').replace('{value}', formatWorkTime(workHoursPerUse))}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Installment Breakdown Card */}
      {installmentCount && monthlyPayment && totalInstallmentCost && (
        <div className="bg-gradient-to-tr from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3.5 hover:border-amber-500/35 transition-colors shadow-sm animate-slide-in">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0.5 select-text">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary select-none">
              {t('results.installmentCard.title')}
            </span>
            <span className="text-sm font-extrabold text-text-primary">
              {t('results.installmentCard.monthly')
                .replace('{payment}', formatCurrency(monthlyPayment, currency, customCurrencySymbol))
                .replace('{months}', installmentCount.toString())}
            </span>
            <p className="text-[9px] text-text-secondary leading-normal">
              {t('results.installmentCard.total')
                .replace('{total}', formatCurrency(totalInstallmentCost, currency, customCurrencySymbol))
                .replace('{sticker}', formatCurrency(price, currency, customCurrencySymbol))}
              {installmentInterest && installmentInterest > 0 && (
                <span className="text-danger font-bold">
                  {' '}(+{formatCurrency(installmentInterest, currency, customCurrencySymbol)} {t('results.installmentCard.interestShort')})
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Advanced Adjustments Breakdown */}
      {(resaleValue > 0 || maintenanceCost > 0) && (
        <div className="bg-elevated/40 border border-border/30 rounded-2xl p-3.5 text-[10px] text-text-secondary flex flex-col gap-1.5">
          <div className="flex justify-between select-none">
            <span>{t('results.stickerPriceLabel')}</span>
            <span className="font-bold text-text-primary">{formatCurrency(price, currency, customCurrencySymbol)}</span>
          </div>
          {resaleValue > 0 && (
            <div className="flex justify-between">
              <span className="select-none">{t('results.estResaleLabel')}</span>
              <span className="font-extrabold text-success">-{formatCurrency(resaleValue, currency, customCurrencySymbol)}</span>
            </div>
          )}
          {maintenanceCost > 0 && (
            <div className="flex justify-between">
              <span className="select-none">{t('results.maintenanceAddLabel')}</span>
              <span className="font-extrabold text-danger">+{formatCurrency(maintenanceCost, currency, customCurrencySymbol)}</span>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex gap-2 p-3 bg-background border border-border/30 rounded-2xl">
        <AlertCircle className="w-4 h-4 text-text-secondary/70 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-text-secondary leading-normal select-none">
          {t('results.disclaimer')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="result-actions flex gap-2">
        <Button
          onClick={() => saveCalculation()}
          variant="secondary"
          className="flex-1 flex gap-1.5 items-center justify-center text-xs py-3 select-none"
        >
          <Save className="w-4 h-4" />
          <span>{t('results.btnSave')}</span>
        </Button>
        <Button
          onClick={() => addToComparison(currentResult)}
          variant="secondary"
          disabled={isCompared}
          className="flex-1 flex gap-1.5 items-center justify-center text-xs py-3 select-none"
        >
          <Plus className="w-4 h-4" />
          <span>{isCompared ? t('results.btnCompared') : t('results.btnCompare')}</span>
        </Button>
      </div>
    </div>
  );
};
export default ResultCard;
