import React, { useEffect, useState } from 'react';
import { useCalculatorStore } from '../shared/store/useCalculatorStore';
import { formatCurrency } from '../shared/lib/formatCurrency';
import Badge from '../shared/components/Badge';
import Input from '../shared/components/Input';
import Select from '../shared/components/Select';
import Button from '../shared/components/Button';
import Toast from '../shared/components/Toast';
import { Currency } from '../shared/types/calculation';
import { 
  Settings, 
  Trash2, 
  Download, 
  ShieldAlert, 
  HelpCircle, 
  Info, 
  Calendar,
  Upload,
  ChevronDown,
  Check
} from 'lucide-react';
import { translate } from '../shared/locales';

const USFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.75' }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-sm overflow-hidden flex-shrink-0 shadow-sm`} xmlns="http://www.w3.org/2000/svg">
    <path fill="#bd3d44" d="M0 0h640v480H0"/>
    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"/>
    <path fill="#192f5d" d="M0 0h364.8v258.5H0"/>
    <marker id="us-a" markerHeight="30" markerWidth="30">
      <path fill="#fff" d="m14 0 9 27L0 10h28L5 27z"/>
    </marker>
    <path fill="none" markerMid="url(#us-a)" d="m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z"/>
  </svg>
);

const TRFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.75' }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-sm overflow-hidden flex-shrink-0 shadow-sm`} xmlns="http://www.w3.org/2000/svg">
    <g fillRule="evenodd">
      <path fill="#e30a17" d="M0 0h640v480H0z"/>
      <path fill="#fff" d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9"/>
      <path fill="#e30a17" d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z"/>
      <path fill="#fff" d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z"/>
    </g>
  </svg>
);

export const OptionsApp: React.FC = () => {
  const { 
    init, 
    settings, 
    updateSettings, 
    isInitialized, 
    history, 
    deleteCalculation, 
    clearHistory,
    importHistory,
    showToast 
  } = useCalculatorStore();

  const t = (key: string) => translate(key, settings.language);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(settings.language === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const formatWorkTimeShort = (hours: number) => {
    const isTr = settings.language === 'tr';
    const dWord = isTr ? 'g' : 'd';
    const hWord = isTr ? 's' : 'h';
    const mWord = isTr ? 'dk' : 'm';

    if (hours >= 8) {
      const days = Math.floor(hours / 8);
      const remainingHours = Math.round(hours % 8);
      return remainingHours > 0 ? `${days}${dWord} ${remainingHours}${hWord}` : `${days}${dWord}`;
    }
    if (hours >= 1) {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      return minutes > 0 ? `${wholeHours}${hWord} ${minutes}${mWord}` : `${wholeHours}${hWord}`;
    }
    const minutes = Math.round(hours * 60);
    return `${minutes}${mWord}`;
  };

  const showLaborColumn = settings.showWorkCost;

  const [defaultCurrency, setDefaultCurrency] = useState<Currency>('USD');
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState('');
  const [defaultDurationValue, setDefaultDurationValue] = useState('1');
  const [defaultDurationUnit, setDefaultDurationUnit] = useState<'months' | 'years'>('years');
  const [defaultUsesPerWeek, setDefaultUsesPerWeek] = useState('5');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Work cost states
  const [showWorkCost, setShowWorkCost] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState('');
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState('40');

  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  // Sync state values when settings initialize
  useEffect(() => {
    if (isInitialized) {
      setDefaultCurrency(settings.defaultCurrency);
      setCustomCurrencySymbol(settings.customCurrencySymbol);
      setDefaultDurationValue(settings.defaultDurationValue.toString());
      setDefaultDurationUnit(settings.defaultDurationUnit);
      setDefaultUsesPerWeek(settings.defaultUsesPerWeek.toString());
      setTheme(settings.theme);
      setLanguage(settings.language || 'en');
      setShowWorkCost(settings.showWorkCost);
      setMonthlySalary(settings.monthlySalary ? settings.monthlySalary.toString() : '');
      setWorkHoursPerWeek(settings.workHoursPerWeek ? settings.workHoursPerWeek.toString() : '40');
    }
  }, [isInitialized, settings]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    const salaryNum = parseFloat(monthlySalary) || 0;
    const hoursNum = parseFloat(workHoursPerWeek) || 40;
    const calculatedHourlyWage = hoursNum > 0 ? salaryNum / (hoursNum * 4.345) : 0;

    await updateSettings({
      defaultCurrency,
      customCurrencySymbol,
      defaultDurationValue: parseInt(defaultDurationValue) || 1,
      defaultDurationUnit,
      defaultUsesPerWeek: parseInt(defaultUsesPerWeek) || 5,
      theme,
      language,
      showWorkCost,
      monthlySalary: salaryNum,
      workHoursPerWeek: hoursNum,
      hourlyWage: calculatedHourlyWage,
    });
    showToast(t('settings.saveSuccess'), 'success');
  };

  const getCurrencySymbolText = () => {
    if (defaultCurrency === 'CUSTOM') {
      return customCurrencySymbol || '¤';
    }
    const symbols: Record<string, string> = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' };
    return symbols[defaultCurrency] || '$';
  };

  const handleExportData = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `cost_per_use_export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(t('settings.saveSuccess'), 'success');
    } catch {
      showToast(t('common.saveError'), 'error');
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const result = await importHistory(text);
        if (result.success) {
          showToast(t('history.importSuccess').replace('{count}', result.count.toString()), 'success');
        } else {
          showToast(t('history.importError'), 'error');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = async () => {
    if (confirmClear) {
      await clearHistory();
      setConfirmClear(false);
      showToast(t('settings.clearDbSuccess'), 'success');
    } else {
      setConfirmClear(true);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
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
    { value: 'CUSTOM', label: settings.language === 'tr' ? 'Özel Para Birimi' : 'Custom Currency' },
  ];

  const durationUnitOptions = [
    { value: 'years', label: settings.language === 'tr' ? 'Yıl' : 'Years' },
    { value: 'months', label: settings.language === 'tr' ? 'Ay' : 'Months' },
  ];

  const themeOptions = [
    { value: 'light', label: settings.language === 'tr' ? 'Açık Tema' : 'Light Theme' },
    { value: 'dark', label: settings.language === 'tr' ? 'Koyu Tema' : 'Dark Theme' },
  ];



  return (
    <div className="min-h-screen bg-background text-text-primary px-4 py-8 sm:py-12 select-text font-sans">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in">
        
        {/* Header */}
        <header className="flex flex-col gap-2 select-none border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center select-none overflow-hidden">
              <img src="icons/icon.svg" className="w-10 h-10 object-contain" alt="Cost Per Use Logo" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{t('common.appName')}</h1>
              <p className="text-xs text-text-secondary font-medium">{t('settings.subTitle')}</p>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Preferences Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-4 select-none">
                <Settings className="w-4.5 h-4.5 text-accent" />
                <span>{t('settings.title')}</span>
              </h2>

              <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
                <Select
                  label={t('settings.labelCurrency')}
                  options={currencyOptions}
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value as Currency)}
                />

                {defaultCurrency === 'CUSTOM' && (
                  <Input
                    label={t('settings.customCurrencySymbol')}
                    placeholder="e.g. ¥, CHF, kr"
                    value={customCurrencySymbol}
                    onChange={(e) => setCustomCurrencySymbol(e.target.value)}
                    maxLength={3}
                  />
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label={t('settings.labelDuration')}
                    type="number"
                    value={defaultDurationValue}
                    onChange={(e) => setDefaultDurationValue(e.target.value)}
                  />
                  <Select
                    label={t('settings.labelDurationUnit')}
                    options={durationUnitOptions}
                    value={defaultDurationUnit}
                    onChange={(e) => setDefaultDurationUnit(e.target.value as 'months' | 'years')}
                  />
                </div>

                <Input
                  label={t('settings.labelUsesPerWeek')}
                  type="number"
                  value={defaultUsesPerWeek}
                  onChange={(e) => setDefaultUsesPerWeek(e.target.value)}
                />

                {/* Work Labor Cost Settings Card Section */}
                <div className="border-t border-border/40 my-2 pt-2.5 flex flex-col gap-3">
                  <div className="flex justify-between items-center select-none cursor-pointer" onClick={() => setShowWorkCost(!showWorkCost)}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary">{t('settings.labelEnableLabor')}</span>
                      <span className="text-[10px] text-text-secondary leading-none">{t('settings.descEnableLabor')}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={showWorkCost}
                      onChange={(e) => e.stopPropagation()} // Let card click handle toggle
                      className="w-4 h-4 text-accent border-border rounded focus:ring-accent/50 cursor-pointer"
                    />
                  </div>

                  {showWorkCost && (
                    <div className="flex flex-col gap-3 animate-slide-in">
                      <Input
                        label={t('settings.labelMonthlySalary')}
                        type="number"
                        placeholder="e.g. 5000"
                        value={monthlySalary}
                        onChange={(e) => setMonthlySalary(e.target.value)}
                        prefixElement={getCurrencySymbolText()}
                      />
                      <Input
                        label={t('settings.labelWorkHours')}
                        type="number"
                        placeholder="e.g. 40"
                        value={workHoursPerWeek}
                        onChange={(e) => setWorkHoursPerWeek(e.target.value)}
                      />
                      {parseFloat(monthlySalary) > 0 && parseFloat(workHoursPerWeek) > 0 && (
                        <div className="bg-elevated/40 border border-border/30 rounded-xl p-2.5 text-[10px] text-text-secondary select-none">
                          {t('settings.calculatedWage')}{' '}
                          <span className="font-extrabold text-accent">
                            {formatCurrency(
                              parseFloat(monthlySalary) / (parseFloat(workHoursPerWeek) * 4.345),
                              defaultCurrency,
                              customCurrencySymbol
                            )}
                          </span>{' '}
                          / hr
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Select
                  label={t('settings.labelTheme')}
                  options={themeOptions}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                />

                {/* Custom Language Dropdown Selector */}
                <div className="flex flex-col gap-1.5 relative select-none">
                  <span className="text-xs font-bold text-text-secondary select-none">
                    {t('settings.labelLanguage')}
                  </span>
                  
                  {/* Selector Button */}
                  <button
                    type="button"
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex justify-between items-center w-full px-3 py-2.5 bg-background border border-border/70 rounded-xl hover:border-accent/50 focus:border-accent text-xs font-semibold text-text-primary transition-all duration-200 outline-none"
                  >
                    <div className="flex items-center gap-2">
                      {language === 'tr' ? <TRFlag /> : <USFlag />}
                      <span>{language === 'tr' ? 'Türkçe' : 'English'}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Overlay List */}
                  {isLangDropdownOpen && (
                    <>
                      {/* Invisible backdrop to click away */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsLangDropdownOpen(false)}
                      />
                      
                      <div className="absolute top-[64px] left-0 right-0 z-50 bg-surface border border-border/70 rounded-xl shadow-premium dark:shadow-premium-dark p-1 flex flex-col gap-0.5 animate-scale-in origin-top">
                        {/* English Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage('en');
                            setIsLangDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors hover:bg-elevated/40 ${language === 'en' ? 'bg-accent/10 text-accent hover:bg-accent/15' : 'text-text-primary'}`}
                        >
                          <div className="flex items-center gap-2">
                            <USFlag />
                            <span>English</span>
                          </div>
                          {language === 'en' && <Check className="w-3.5 h-3.5 text-accent" />}
                        </button>

                        {/* Turkish Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage('tr');
                            setIsLangDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors hover:bg-elevated/40 ${language === 'tr' ? 'bg-accent/10 text-accent hover:bg-accent/15' : 'text-text-primary'}`}
                        >
                          <div className="flex items-center gap-2">
                            <TRFlag />
                            <span>Türkçe</span>
                          </div>
                          {language === 'tr' && <Check className="w-3.5 h-3.5 text-accent" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <Button type="submit" variant="primary" fullWidth className="mt-2">
                  {t('settings.btnSave')}
                </Button>
              </form>
            </div>

            {/* Privacy Card */}
            <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark select-none">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4.5 h-4.5 text-success" />
                <span>{t('settings.privacyTitle')}</span>
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                {t('settings.privacyDesc')}
              </p>
              <div className="mt-3 flex gap-2 items-center">
                <Badge variant="success" className="text-[9px] py-0 px-2.5 font-bold">{t('settings.privacyBadge1')}</Badge>
                <Badge variant="primary" className="text-[9px] py-0 px-2.5 font-bold">{t('settings.privacyBadge2')}</Badge>
              </div>
            </div>
          </div>

          {/* Calculations History Table Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark">
              <div className="flex justify-between items-center mb-6 select-none">
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-accent" />
                  <span>{settings.language === 'tr' ? `Hesaplama Kayıtları (${history.length})` : `Calculation Records (${history.length})`}</span>
                </h2>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="import-json-file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportData}
                  />
                  <Button
                    onClick={() => document.getElementById('import-json-file')?.click()}
                    variant="secondary"
                    size="sm"
                    className="flex gap-1.5 items-center text-xs font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('history.btnImport')}</span>
                  </Button>
                  {history.length > 0 && (
                    <>
                      <Button
                        onClick={handleExportData}
                        variant="secondary"
                        size="sm"
                        className="flex gap-1.5 items-center text-xs font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('history.btnExport')}</span>
                      </Button>
                      <Button
                        onClick={handleClearAll}
                        variant={confirmClear ? 'danger' : 'secondary'}
                        size="sm"
                        className="flex gap-1.5 items-center text-xs font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{confirmClear ? t('settings.btnConfirmClearDb') : t('settings.btnClearDb')}</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
                  <div className="w-14 h-14 rounded-2xl bg-elevated flex items-center justify-center text-text-secondary mb-4 border border-border/10">
                    <HelpCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">{t('history.empty')}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-[280px] mb-4">
                    {settings.language === 'tr' 
                      ? 'Uzantı penceresinde hesaplama yapıp kaydedin veya daha önce dışa aktarılmış bir yedek dosyasını içe aktarın.' 
                      : 'Create a calculation in the extension popup menu, save it, or import a previously exported JSON backup file.'}
                  </p>
                  <Button
                    onClick={() => document.getElementById('import-json-file')?.click()}
                    variant="secondary"
                    size="sm"
                    className="flex gap-1.5 items-center text-xs font-semibold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('settings.btnImport')}</span>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <table className="w-full text-left border-collapse text-xs select-text">
                    <thead>
                      <tr className="bg-elevated border-b border-border/60 text-text-secondary font-bold select-none">
                        <th className="p-3.5">{t('history.tableProduct')}</th>
                        <th className="p-3.5">{t('history.tablePrice')}</th>
                        <th className="p-3.5">{t('history.tableNetCost')}</th>
                        <th className="p-3.5">{t('history.tableDuration')}</th>
                        {showLaborColumn && <th className="p-3.5">{t('history.tableLabor')}</th>}
                        <th className="p-3.5">{t('history.tableRating')}</th>
                        <th className="p-3.5">{t('history.tableCostUse')}</th>
                        <th className="p-3.5 text-center">{t('history.tableActions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {history.map((item) => {
                        const showAdjustments = (item.resaleValue && item.resaleValue > 0) || (item.maintenanceCost && item.maintenanceCost > 0);
                        return (
                          <tr key={item.id} className="hover:bg-elevated/20 transition-colors">
                            {/* Product column */}
                            <td className="p-3.5 align-middle">
                              <div className="flex flex-col gap-0.5 max-w-[180px]">
                                <span className="font-semibold text-text-primary truncate block" title={item.productName || t('history.unnamedProduct')}>
                                  {item.productName || t('history.unnamedProduct')}
                                </span>
                                {item.createdAt && (
                                  <span className="text-[10px] text-text-secondary select-none">
                                    {formatDate(item.createdAt)}
                                  </span>
                                )}
                              </div>
                            </td>
                            {/* Sticker Price column */}
                            <td className="p-3.5 align-middle text-text-secondary font-medium">
                              <div className="flex flex-col gap-0.5">
                                <span>{formatCurrency(item.price, item.currency, item.customCurrencySymbol)}</span>
                                {item.installmentCount && item.monthlyPayment ? (
                                  <span className="text-[9px] text-text-secondary/80 select-none font-semibold">
                                    {t('history.monthsPlan').replace('{count}', item.installmentCount.toString())}
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            {/* Net Cost column */}
                            <td className="p-3.5 align-middle text-text-secondary font-semibold">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-text-primary">{formatCurrency(item.netCost, item.currency, item.customCurrencySymbol)}</span>
                                {showAdjustments ? (
                                  <div className="flex gap-1.5 text-[8px] text-text-secondary/75 select-none font-medium mt-0.5">
                                    {item.resaleValue && item.resaleValue > 0 ? (
                                      <span className="text-success font-bold">R: -{formatCurrency(item.resaleValue, item.currency, item.customCurrencySymbol)}</span>
                                    ) : null}
                                    {item.maintenanceCost && item.maintenanceCost > 0 ? (
                                      <span className="text-danger font-bold">M: +{formatCurrency(item.maintenanceCost, item.currency, item.customCurrencySymbol)}</span>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            </td>
                            {/* Ownership Duration & total uses column */}
                            <td className="p-3.5 align-middle text-text-secondary">
                              <div className="flex flex-col gap-0.5">
                                <span>
                                  {item.ownershipDurationValue} {
                                    item.ownershipDurationUnit === 'years' 
                                      ? (settings.language === 'tr' ? 'Yıl' : 'years') 
                                      : (settings.language === 'tr' ? 'Ay' : 'months')
                                  }
                                </span>
                                <span className="text-[9px] text-text-secondary/80 select-none font-medium">
                                  {t('history.usesCount').replace('{count}', item.totalEstimatedUses.toString())}
                                </span>
                              </div>
                            </td>
                            {/* Labor Equivalent column (optional) */}
                            {showLaborColumn && (
                              <td className="p-3.5 align-middle text-text-secondary">
                                {item.workHoursCost !== undefined && item.workHoursCost > 0 ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-text-primary">{formatWorkTimeShort(item.workHoursCost)}</span>
                                    {item.workHoursPerUse !== undefined && item.workHoursPerUse > 0 ? (
                                      <span className="text-[9px] text-text-secondary/75 select-none font-medium">
                                        {formatWorkTimeShort(item.workHoursPerUse)} / use
                                      </span>
                                    ) : null}
                                  </div>
                                ) : (
                                  <span className="select-none">-</span>
                                )}
                              </td>
                            )}
                            {/* Value Rating column */}
                            <td className="p-3.5 align-middle">
                              <Badge variant={
                                item.valueRating === 'excellent' ? 'success' : 
                                item.valueRating === 'good' ? 'primary' : 
                                item.valueRating === 'think_twice' ? 'warning' : 'danger'
                              } className="text-[9px] py-0.5 px-2 select-none font-bold">
                                {t('results.ratingLabels.' + item.valueRating)}
                              </Badge>
                            </td>
                            {/* Cost / Use column */}
                            <td className="p-3.5 align-middle">
                              <span className="text-sm font-black text-accent">
                                {formatCurrency(item.costPerUse, item.currency, item.customCurrencySymbol)}
                              </span>
                            </td>
                            {/* Delete button column */}
                            <td className="p-3.5 align-middle text-center select-none">
                              <button
                                onClick={() => deleteCalculation(item.id)}
                                className="text-text-secondary hover:text-danger p-1.5 rounded-lg hover:bg-elevated transition-colors"
                                title={settings.language === 'tr' ? 'Kayıt sil' : 'Delete record'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* About Card */}
            <div className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark select-none">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-3">
                <Info className="w-4.5 h-4.5 text-accent" />
                <span>{settings.language === 'tr' ? 'Kullanım Başına Maliyet Hakkında' : 'About Cost Per Use'}</span>
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                {settings.language === 'tr' 
                  ? 'Kullanım Başına Maliyet, bilinçli harcamayı teşvik etmek için tasarlanmış bir araçtır. Yalnızca etiket fiyatına odaklanmak yerine, ürün dayanıklılığı ve düzenli kullanıma dayalı tahmini değeri hesaplamak akıllı finansal kararlar almayı destekler.' 
                  : 'Cost Per Use is a utility designed to encourage mindful spending. Rather than fixating on sticker price, calculating estimated value based on product durability and routine utilization encourages smart financial decision-making.'}
              </p>
              <p className="text-[10px] text-text-secondary/70 mt-3">
                {settings.language === 'tr'
                  ? 'Versiyon 1.0.0 • MIT Lisansı • Premium Verimlilik Kullanıcı Deneyimi.'
                  : 'Version 1.0.0 • Released under MIT License • Designed with premium productivity UX.'}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Floating Toast notifications */}
      <Toast />
    </div>
  );
};

export default OptionsApp;
