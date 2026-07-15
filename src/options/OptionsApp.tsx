import React, { useEffect, useState } from 'react';
import { Heart, Settings, ShieldAlert } from 'lucide-react';
import Badge from '../shared/components/Badge';
import Button from '../shared/components/Button';
import Input from '../shared/components/Input';
import Select from '../shared/components/Select';
import Toast from '../shared/components/Toast';
import { formatCurrency } from '../shared/lib/formatCurrency';
import { Language, translate } from '../shared/locales';
import { useCalculatorStore } from '../shared/store/useCalculatorStore';
import { Currency } from '../shared/types/calculation';
import HistoryPanel from './components/HistoryPanel';
import LanguageSelector from './components/LanguageSelector';

export const OptionsApp: React.FC = () => {
  const { init, settings, updateSettings, isInitialized, showToast } = useCalculatorStore();
  const t = (key: string) => translate(key, settings.language);

  const [defaultCurrency, setDefaultCurrency] = useState<Currency>('USD');
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState('');
  const [defaultDurationValue, setDefaultDurationValue] = useState('1');
  const [defaultDurationUnit, setDefaultDurationUnit] = useState<'months' | 'years'>('years');
  const [defaultUsesPerWeek, setDefaultUsesPerWeek] = useState('5');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [showWorkCost, setShowWorkCost] = useState(false);
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [monthlySalary, setMonthlySalary] = useState('');
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState('40');

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isInitialized) return;
    setDefaultCurrency(settings.defaultCurrency);
    setCustomCurrencySymbol(settings.customCurrencySymbol);
    setDefaultDurationValue(settings.defaultDurationValue.toString());
    setDefaultDurationUnit(settings.defaultDurationUnit);
    setDefaultUsesPerWeek(settings.defaultUsesPerWeek.toString());
    setTheme(settings.theme);
    setLanguage(settings.language);
    setShowWorkCost(settings.showWorkCost);
    setAutoFillEnabled(settings.autoFillEnabled !== false);
    setMonthlySalary(settings.monthlySalary ? settings.monthlySalary.toString() : '');
    setWorkHoursPerWeek(settings.workHoursPerWeek ? settings.workHoursPerWeek.toString() : '40');
  }, [isInitialized, settings]);

  const handleSavePreferences = async (event: React.FormEvent) => {
    event.preventDefault();
    const salary = parseFloat(monthlySalary) || 0;
    const weeklyHours = parseFloat(workHoursPerWeek) || 40;

    await updateSettings({
      defaultCurrency,
      customCurrencySymbol,
      defaultDurationValue: parseInt(defaultDurationValue) || 1,
      defaultDurationUnit,
      defaultUsesPerWeek: parseInt(defaultUsesPerWeek) || 5,
      theme,
      language,
      showWorkCost,
      autoFillEnabled,
      monthlySalary: salary,
      workHoursPerWeek: weeklyHours,
      hourlyWage: weeklyHours > 0 ? salary / (weeklyHours * 4.345) : 0,
    });
    showToast(translate('settings.saveSuccess', language), 'success');
  };

  const getCurrencySymbol = () => {
    if (defaultCurrency === 'CUSTOM') return customCurrencySymbol || '¤';
    return { TRY: '₺', USD: '$', EUR: '€', GBP: '£' }[defaultCurrency] || '$';
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-text-secondary">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'TRY', label: 'TRY (₺)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CUSTOM', label: t('settings.customCurrency') },
  ];
  const durationUnitOptions = [
    { value: 'years', label: t('settings.unitYears') },
    { value: 'months', label: t('settings.unitMonths') },
  ];
  const themeOptions = [
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary px-4 py-8 sm:py-12 select-text font-sans">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in">
        <header className="flex flex-col gap-2 select-none border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img src="icons/icon.svg" className="w-10 h-10 object-contain" alt="Cost Per Use Logo" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{t('common.appName')}</h1>
              <p className="text-xs text-text-secondary font-medium">{t('settings.subTitle')}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <section className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-4 select-none">
                <Settings className="w-4.5 h-4.5 text-accent" />
                <span>{t('settings.title')}</span>
              </h2>

              <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
                <Select label={t('settings.labelCurrency')} options={currencyOptions} value={defaultCurrency} onChange={(event) => setDefaultCurrency(event.target.value as Currency)} />
                {defaultCurrency === 'CUSTOM' && (
                  <Input label={t('settings.customCurrencySymbol')} placeholder="e.g. ¥, CHF, kr" value={customCurrencySymbol} onChange={(event) => setCustomCurrencySymbol(event.target.value)} maxLength={3} />
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Input label={t('settings.labelDuration')} type="number" value={defaultDurationValue} onChange={(event) => setDefaultDurationValue(event.target.value)} />
                  <Select label={t('settings.labelDurationUnit')} options={durationUnitOptions} value={defaultDurationUnit} onChange={(event) => setDefaultDurationUnit(event.target.value as 'months' | 'years')} />
                </div>
                <Input label={t('settings.labelUsesPerWeek')} type="number" value={defaultUsesPerWeek} onChange={(event) => setDefaultUsesPerWeek(event.target.value)} />

                <div className="border-t border-border/40 my-2 pt-2.5 flex flex-col gap-3">
                  <label className="flex justify-between items-center select-none cursor-pointer">
                    <span className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary">{t('settings.labelEnableLabor')}</span>
                      <span className="text-[10px] text-text-secondary leading-none">{t('settings.descEnableLabor')}</span>
                    </span>
                    <input type="checkbox" checked={showWorkCost} onChange={(event) => setShowWorkCost(event.target.checked)} className="w-4 h-4 text-accent border-border rounded focus:ring-accent/50 cursor-pointer" />
                  </label>

                  {showWorkCost && (
                    <div className="flex flex-col gap-3 animate-slide-in">
                      <Input label={t('settings.labelMonthlySalary')} type="number" placeholder="e.g. 5000" value={monthlySalary} onChange={(event) => setMonthlySalary(event.target.value)} prefixElement={getCurrencySymbol()} />
                      <Input label={t('settings.labelWorkHours')} type="number" placeholder="e.g. 40" value={workHoursPerWeek} onChange={(event) => setWorkHoursPerWeek(event.target.value)} />
                      {parseFloat(monthlySalary) > 0 && parseFloat(workHoursPerWeek) > 0 && (
                        <div className="bg-elevated/40 border border-border/30 rounded-xl p-2.5 text-[10px] text-text-secondary select-none">
                          {t('settings.calculatedWage')}{' '}
                          <span className="font-extrabold text-accent">{formatCurrency(parseFloat(monthlySalary) / (parseFloat(workHoursPerWeek) * 4.345), defaultCurrency, customCurrencySymbol)}</span>{' '}
                          / hr
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <label className="border-t border-border/40 my-2 pt-2.5 flex justify-between items-center select-none cursor-pointer">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-text-primary">{t('settings.labelAutoFill')}</span>
                    <span className="text-[10px] text-text-secondary leading-none">{t('settings.descAutoFill')}</span>
                  </span>
                  <input type="checkbox" checked={autoFillEnabled} onChange={(event) => setAutoFillEnabled(event.target.checked)} className="w-4 h-4 text-accent border-border rounded focus:ring-accent/50 cursor-pointer" />
                </label>

                <Select label={t('settings.labelTheme')} options={themeOptions} value={theme} onChange={(event) => setTheme(event.target.value as 'light' | 'dark')} />
                <LanguageSelector label={t('settings.labelLanguage')} value={language} onChange={setLanguage} />
                <Button type="submit" variant="primary" fullWidth className="mt-2">{t('settings.btnSave')}</Button>
              </form>
            </section>

            <section className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark select-none">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3"><ShieldAlert className="w-4.5 h-4.5 text-success" /><span>{t('settings.privacyTitle')}</span></h2>
              <p className="text-xs text-text-secondary leading-relaxed">{t('settings.privacyDesc')}</p>
              <div className="mt-3 flex gap-2 items-center">
                <Badge variant="success" className="text-[9px] py-0 px-2.5 font-bold">{t('settings.privacyBadge1')}</Badge>
                <Badge variant="primary" className="text-[9px] py-0 px-2.5 font-bold">{t('settings.privacyBadge2')}</Badge>
              </div>
            </section>

            <section className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark select-none">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3"><Heart className="w-4.5 h-4.5 text-danger" /><span>{t('support.title')}</span></h2>
              <p className="text-xs text-text-secondary leading-relaxed">{t('support.description')}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a href="https://www.patreon.com/tahsinsoyak" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF424D] hover:bg-[#e63a45] text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                  <Heart className="w-3.5 h-3.5" /><span>{t('support.patreonBtn')}</span>
                </a>
                <Badge variant="success" className="text-[9px] py-0 px-2.5 font-bold">{t('support.freeBadge')}</Badge>
                <Badge variant="primary" className="text-[9px] py-0 px-2.5 font-bold">{t('support.noAdsBadge')}</Badge>
              </div>
            </section>
          </div>

          <HistoryPanel />
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default OptionsApp;
