import React, { useState, useEffect } from 'react';
import { useCalculatorStore } from '../../shared/store/useCalculatorStore';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Button from '../../shared/components/Button';
import { Currency } from '../../shared/types/calculation';
import { Settings, Info, Sparkles, CreditCard, Clock } from 'lucide-react';
import { translate } from '../../shared/locales';

export const CalculatorForm: React.FC = () => {
  const {
    currentProductName,
    currentPrice,
    currentCurrency,
    currentCustomCurrencySymbol,
    currentDurationValue,
    currentDurationUnit,
    currentUsesPerWeek,
    currentResaleValue,
    currentMaintenanceCost,
    currentInstallmentCount,
    currentTotalInstallmentCost,
    currentInlineHourlyWage,
    formErrors,
    formWarnings,
    setInputs,
    calculate,
    triggerScrape,
    settings,
  } = useCalculatorStore();

  const t = (key: string) => translate(key, settings.language);

  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Custom input toggles
  const [durationMode, setDurationMode] = useState<'pill' | 'custom'>('pill');
  const [usageMode, setUsageMode] = useState<'pill' | 'custom'>('pill');
  const [isPageScrapable, setIsPageScrapable] = useState(false);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.url) {
          const url = activeTab.url;
          const scrapable =
            settings.autoFillEnabled &&
            !url.startsWith('chrome://') &&
            !url.startsWith('chrome-extension://') &&
            !url.startsWith('edge://') &&
            !url.startsWith('about:');
          setIsPageScrapable(scrapable);
        }
      });
    }
  }, [settings.autoFillEnabled]);

  const handleManualScrape = () => {
    triggerScrape(true);
  };

  // Sync mode on initial load/load calculation
  useEffect(() => {
    // If values don't match the pills, switch to custom mode
    const isDurationPill = 
      (currentDurationValue === '6' && currentDurationUnit === 'months') ||
      (currentDurationValue === '1' && currentDurationUnit === 'years') ||
      (currentDurationValue === '2' && currentDurationUnit === 'years') ||
      (currentDurationValue === '3' && currentDurationUnit === 'years');
      
    if (!isDurationPill && currentDurationValue !== '') {
      setDurationMode('custom');
    }

    const isUsagePill = ['1', '3', '5', '7'].includes(currentUsesPerWeek);
    if (!isUsagePill && currentUsesPerWeek !== '') {
      setUsageMode('custom');
    }
  }, [currentDurationValue, currentDurationUnit, currentUsesPerWeek]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputs({ currentCurrency: e.target.value as Currency });
  };

  const currencyOptions = [
    { value: 'USD', label: '$ USD' },
    { value: 'TRY', label: '₺ TRY' },
    { value: 'EUR', label: '€ EUR' },
    { value: 'GBP', label: '£ GBP' },
    { value: 'CUSTOM', label: t('calculator.customValue') },
  ];

  const durationUnitOptions = [
    { value: 'years', label: t('settings.unitYears') },
    { value: 'months', label: t('settings.unitMonths') },
  ];

  // Helper to determine active currency symbol
  const getCurrencySymbolText = () => {
    if (currentCurrency === 'CUSTOM') {
      return currentCustomCurrencySymbol || '¤';
    }
    const symbols: Record<string, string> = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currentCurrency] || '$';
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in pb-1 select-text">
      
      {/* Product Name (Notepad Style) */}
      <div className="relative flex items-center justify-between border-b border-dashed border-border/80 pb-1.5 focus-within:border-accent/60 transition-all duration-200">
        <input
          type="text"
          placeholder={t('calculator.placeholderProduct')}
          value={currentProductName}
          onChange={(e) => setInputs({ currentProductName: e.target.value })}
          className="flex-1 bg-transparent text-base font-extrabold tracking-tight text-text-primary placeholder:text-text-secondary/40 border-none outline-none focus:ring-0 px-1 py-0.5"
        />
        {isPageScrapable && (
          <button
            type="button"
            onClick={handleManualScrape}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold text-accent hover:text-accent bg-accent/5 hover:bg-accent/15 border border-accent/20 rounded-xl transition-all duration-200 active:scale-95 select-none shrink-0 ml-2 shadow-sm"
            title={t('calculator.autofillTooltip')}
          >
            <Sparkles className="w-3 h-3 text-accent animate-pulse" />
            <span>{t('common.autofillBtn')}</span>
          </button>
        )}
      </div>

      {/* Wise/Revolut Style Price Card */}
      <div className="bg-elevated/40 border border-border/50 rounded-2xl p-4 flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-accent/15 focus-within:border-accent/40 transition-all duration-200">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-secondary select-none">
          <span>{t('calculator.labelPrice')}</span>
          <span className="flex items-center gap-1 text-accent select-none">
            <Sparkles className="w-3 h-3" />
            {t('calculator.titlePrice')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Glowing Prefix */}
          <span className="text-3xl font-extrabold text-accent/80 pl-1 select-none">
            {getCurrencySymbolText()}
          </span>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="0.00"
            required
            value={currentPrice}
            onChange={(e) => setInputs({ currentPrice: e.target.value })}
            className="w-full bg-transparent text-3xl font-extrabold tracking-tight text-text-primary placeholder:text-text-secondary/20 border-none outline-none focus:ring-0 p-0"
          />
          {/* Compact Currency Dropdown */}
          <select
            value={currentCurrency}
            onChange={handleCurrencyChange}
            className="bg-surface text-text-primary text-xs font-bold border border-border/80 rounded-xl px-2.5 py-1.5 cursor-pointer hover:border-accent/40 focus:border-accent/50 outline-none transition-colors"
          >
            {currencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {formErrors.price && (
          <span className="text-[10px] text-danger font-semibold mt-1">
            {formErrors.price}
          </span>
        )}
      </div>

      {currentCurrency === 'CUSTOM' && (
        <div className="animate-slide-in">
          <Input
            label={t('settings.customCurrencySymbol')}
            placeholder="e.g. ¥, CHF, kr"
            value={currentCustomCurrencySymbol}
            onChange={(e) => setInputs({ currentCustomCurrencySymbol: e.target.value })}
            maxLength={3}
          />
        </div>
      )}

      {/* Duration Selector (Pills vs Custom) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary select-none">
          {t('calculator.labelDuration')}
        </label>
        
        {durationMode === 'pill' ? (
          <div className="grid grid-cols-5 gap-1.5 select-none">
            {[
              { label: `6 ${t('common.moShort')}`, val: '6', unit: 'months' },
              { label: `1 ${t('common.yrShort')}`, val: '1', unit: 'years' },
              { label: `2 ${t('common.yrShort')}`, val: '2', unit: 'years' },
              { label: `3 ${t('common.yrShort')}`, val: '3', unit: 'years' },
            ].map((p) => {
              const isActive = currentDurationValue === p.val && currentDurationUnit === p.unit;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setInputs({ currentDurationValue: p.val, currentDurationUnit: p.unit as 'months' | 'years' })}
                  className={`
                    py-2 text-xs font-bold rounded-xl border transition-all duration-200 active:scale-95
                    ${isActive 
                      ? 'bg-accent/10 border-accent/50 text-accent font-extrabold shadow-sm' 
                      : 'bg-surface/50 border-border/80 text-text-secondary hover:border-accent/20 hover:text-text-primary'}
                  `}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setDurationMode('custom')}
              className="py-2 text-xs font-bold rounded-xl border bg-surface/50 border-border/80 text-text-secondary hover:border-accent/20 hover:text-text-primary active:scale-95"
            >
              {t('calculator.customValue')}
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2 animate-slide-in">
            <div className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                placeholder={t('calculator.durationPlaceholder')}
                value={currentDurationValue}
                onChange={(e) => setInputs({ currentDurationValue: e.target.value })}
                error={formErrors.ownershipDurationValue ? t('calculator.errors.durationRequired') : undefined}
              />
            </div>
            <div className="w-24">
              <Select
                options={durationUnitOptions}
                value={currentDurationUnit}
                onChange={(e) => setInputs({ currentDurationUnit: e.target.value as 'months' | 'years' })}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDurationMode('pill');
                setInputs({ currentDurationValue: '1', currentDurationUnit: 'years' });
              }}
              className="px-2.5 py-2.5 h-[40px] text-xs font-bold select-none"
            >
              {t('calculator.reset')}
            </Button>
          </div>
        )}
      </div>

      {/* Usage Selector (Pills vs Custom) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary select-none">
          {t('calculator.labelUsage')}
        </label>
        
        {usageMode === 'pill' ? (
          <div className="grid grid-cols-5 gap-1.5 select-none">
            {[
              { label: `1x ${t('common.perWeekShort')}`, val: '1' },
              { label: `3x ${t('common.perWeekShort')}`, val: '3' },
              { label: `5x ${t('common.perWeekShort')}`, val: '5' },
              { label: `7x ${t('common.perWeekShort')}`, val: '7' },
            ].map((p) => {
              const isActive = currentUsesPerWeek === p.val;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setInputs({ currentUsesPerWeek: p.val })}
                  className={`
                    py-2 text-xs font-bold rounded-xl border transition-all duration-200 active:scale-95
                    ${isActive 
                      ? 'bg-accent/10 border-accent/50 text-accent font-extrabold shadow-sm' 
                      : 'bg-surface/50 border-border/80 text-text-secondary hover:border-accent/20 hover:text-text-primary'}
                  `}
                >
                  {p.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setUsageMode('custom')}
              className="py-2 text-xs font-bold rounded-xl border bg-surface/50 border-border/80 text-text-secondary hover:border-accent/20 hover:text-text-primary active:scale-95"
            >
              {t('calculator.customValue')}
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2 animate-slide-in">
            <div className="flex-1">
              <Input
                type="number"
                inputMode="numeric"
                placeholder={t('calculator.usesPlaceholder')}
                value={currentUsesPerWeek}
                onChange={(e) => setInputs({ currentUsesPerWeek: e.target.value })}
                error={formErrors.usesPerWeek ? t('calculator.errors.usesRequired') : undefined}
                warning={formWarnings.usesPerWeek ? t('calculator.warnings.highUsage') : undefined}
                suffixElement={<span className="text-[10px] font-extrabold text-text-secondary/70">{t('common.perWeekShort')}</span>}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setUsageMode('pill');
                setInputs({ currentUsesPerWeek: '5' });
              }}
              className="px-2.5 py-2.5 h-[40px] text-xs font-bold select-none"
            >
              {t('calculator.reset')}
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent transition-colors py-1 focus:outline-none select-none"
        >
          <Settings className={`w-3.5 h-3.5 transition-transform duration-300 ${showAdvanced ? 'rotate-90' : ''}`} />
          <span>{t('calculator.advancedToggle')}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 bg-elevated/40 border border-border/40 rounded-2xl flex flex-col gap-3 animate-slide-in">
            <Input
              label={t('calculator.labelResale')}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={currentResaleValue}
              onChange={(e) => setInputs({ currentResaleValue: e.target.value })}
              error={formErrors.resaleValue}
              prefixElement={getCurrencySymbolText()}
            />
            <Input
              label={t('calculator.labelMaintenance')}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={currentMaintenanceCost}
              onChange={(e) => setInputs({ currentMaintenanceCost: e.target.value })}
              prefixElement={getCurrencySymbolText()}
            />

            {/* Divider */}
            <div className="border-t border-border/40 pt-2 mt-1">
              <div className="flex items-center gap-1.5 mb-2">
                <CreditCard className="w-3.5 h-3.5 text-accent/70" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary select-none">
                  {t('calculator.paymentPlanTitle')}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    label={t('calculator.labelPayments')}
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 12"
                    value={currentInstallmentCount}
                    onChange={(e) => setInputs({ currentInstallmentCount: e.target.value })}
                    suffixElement={<span className="text-[10px] font-extrabold text-text-secondary/70">{t('common.moShort')}</span>}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={t('calculator.labelTotalPaid')}
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={currentTotalInstallmentCost}
                    onChange={(e) => setInputs({ currentTotalInstallmentCost: e.target.value })}
                    prefixElement={getCurrencySymbolText()}
                  />
                </div>
              </div>
              <p className="text-[9px] text-text-secondary/70 mt-1 leading-normal">
                {t('calculator.paymentsHelp')}
              </p>
            </div>

            {/* Work Hours */}
            <div className="border-t border-border/40 pt-2 mt-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-accent/70" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary select-none">
                  {t('calculator.hourlyWageTitle')}
                </span>
              </div>
              <Input
                label={t('calculator.labelHourlyWage')}
                type="number"
                inputMode="decimal"
                placeholder="e.g. 25.00"
                value={currentInlineHourlyWage}
                onChange={(e) => setInputs({ currentInlineHourlyWage: e.target.value })}
                prefixElement={getCurrencySymbolText()}
                suffixElement={<span className="text-[10px] font-extrabold text-text-secondary/70">/{t('common.hourShort')}</span>}
              />
              <p className="text-[9px] text-text-secondary/70 mt-1 leading-normal">
                {t('calculator.hourlyWageHelp')}
              </p>
            </div>

            <div className="flex gap-1.5 items-start">
              <Info className="w-3.5 h-3.5 text-text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-text-secondary leading-normal">
                {t('calculator.advancedInfo')}
              </p>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" fullWidth className="mt-2 py-3 select-none">
        {t('calculator.btnCalculate')}
      </Button>
    </form>
  );
};
export default CalculatorForm;
