import React, { useEffect, useState } from 'react';
import { useCalculatorStore } from '../shared/store/useCalculatorStore';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import ProductComparison from './components/ProductComparison';
import SavedCalculations from './components/SavedCalculations';
import Toast from '../shared/components/Toast';
import { Sun, Moon, Scale, History, Calculator, Settings } from 'lucide-react';
import { translate } from '../shared/locales';

export const PopupApp: React.FC = () => {
  const { init, settings, updateSettings, isInitialized, comparisonList, history, triggerScrape } = useCalculatorStore();
  const [activeTab, setActiveTab] = useState<'calculator' | 'compare' | 'history'>('calculator');

  const t = (key: string) => translate(key, settings.language);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isInitialized) {
      triggerScrape(false);
    }
  }, [isInitialized, triggerScrape]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const handleOpenOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html', '_blank');
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-[390px] h-[580px] bg-background flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-text-secondary">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[390px] min-h-[580px] bg-background flex flex-col font-sans relative">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-surface border-b border-border/40 select-none">
        <div className="flex items-center gap-2.5">
          {/* Brand Logo — Custom SVG Logo */}
          <div className="w-8 h-8 flex items-center justify-center select-none overflow-hidden">
            <img src="icons/icon.svg" className="w-8 h-8 object-contain" alt="Cost Per Use Logo" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold tracking-tight text-text-primary leading-tight">
              {t('common.appName')}
            </h1>
            <span className="text-[10px] text-text-secondary font-medium leading-none">
              {t('common.appSubTitle')}
            </span>
          </div>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-text-primary rounded-xl hover:bg-elevated transition-colors"
            title={settings.theme === 'light' ? (settings.language === 'tr' ? 'Koyu Tema' : 'Dark Mode') : (settings.language === 'tr' ? 'Açık Tema' : 'Light Mode')}
          >
            {settings.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={handleOpenOptions}
            className="p-2 text-text-secondary hover:text-text-primary rounded-xl hover:bg-elevated transition-colors"
            title={settings.language === 'tr' ? 'Ayarlar' : 'Settings'}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-surface border-b border-border/40 p-1.5 gap-1 select-none">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`
            flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200
            ${activeTab === 'calculator' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{t('tabs.calculate')}</span>
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`
            flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 relative
            ${activeTab === 'compare' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{t('tabs.compare')}</span>
          {comparisonList.length > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 text-[9px] font-bold bg-accent text-white flex items-center justify-center rounded-full">
              {comparisonList.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`
            flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 relative
            ${activeTab === 'history' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          <History className="w-3.5 h-3.5" />
          <span>{t('tabs.history')}</span>
          {history.length > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 text-[9px] font-bold bg-text-secondary/20 text-text-secondary flex items-center justify-center rounded-full">
              {history.length}
            </span>
          )}
        </button>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 p-4 overflow-y-auto max-h-[470px]">
        {activeTab === 'calculator' && (
          <div className="flex flex-col gap-4">
            <CalculatorForm />
            <ResultCard />
          </div>
        )}
        {activeTab === 'compare' && <ProductComparison />}
        {activeTab === 'history' && <SavedCalculations />}
      </main>

      {/* Toast Alert */}
      <Toast />
    </div>
  );
};

export default PopupApp;
