import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useCalculatorStore } from '../shared/store/useCalculatorStore';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import ProductComparison from './components/ProductComparison';
import SavedCalculations from './components/SavedCalculations';
import Toast from '../shared/components/Toast';
import { Sun, Moon, Scale, History, Calculator, Settings, Heart } from 'lucide-react';
import { translate } from '../shared/locales';

export const PopupApp: React.FC = () => {
  const {
    init, settings, updateSettings, isInitialized, comparisonList, history, triggerScrape,
    restorePopupFormState, savePopupFormState,
    currentProductName, currentPrice, currentCurrency, currentCustomCurrencySymbol,
    currentDurationValue, currentDurationUnit, currentUsesPerWeek,
    currentResaleValue, currentMaintenanceCost, currentInstallmentCount,
    currentTotalInstallmentCost, currentInlineHourlyWage,
  } = useCalculatorStore();
  const [activeTab, setActiveTab] = useState<'calculator' | 'compare' | 'history'>('calculator');
  const tabIdRef = useRef<number | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = (key: string) => translate(key, settings.language);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isInitialized) {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          const activeTab = tabs[0];
          if (activeTab?.id) {
            tabIdRef.current = activeTab.id;
            await restorePopupFormState(activeTab.id);
          }
          triggerScrape(false);
        });
      } else {
        triggerScrape(false);
      }
    }
  }, [isInitialized]);

  const persistFormState = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (tabIdRef.current !== null) {
        savePopupFormState(tabIdRef.current);
      }
    }, 400);
  }, [savePopupFormState]);

  useEffect(() => {
    if (isInitialized) {
      persistFormState();
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [
    currentProductName, currentPrice, currentCurrency, currentCustomCurrencySymbol,
    currentDurationValue, currentDurationUnit, currentUsesPerWeek,
    currentResaleValue, currentMaintenanceCost, currentInstallmentCount,
    currentTotalInstallmentCost, currentInlineHourlyWage,
    persistFormState, isInitialized,
  ]);

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
      <div className="w-[420px] h-[620px] bg-background flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-text-secondary">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-shell bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="popup-header flex justify-between items-center select-none">
        <div className="flex items-center gap-2.5">
          {/* Brand Logo — Custom SVG Logo */}
          <div className="brand-mark flex items-center justify-center select-none overflow-hidden">
            <img src="icons/icon.svg" className="w-full h-full object-contain" alt="Cost Per Use Logo" />
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
            className="toolbar-button p-2 text-text-secondary hover:text-text-primary rounded-xl transition-colors"
            title={t(settings.theme === 'light' ? 'settings.themeDark' : 'settings.themeLight')}
          >
            {settings.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={handleOpenOptions}
            className="toolbar-button p-2 text-text-secondary hover:text-text-primary rounded-xl transition-colors"
            title={t('settings.openSettings')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="popup-nav flex select-none">
        <button
          onClick={() => setActiveTab('calculator')}
          aria-selected={activeTab === 'calculator'}
          className={`
            popup-tab flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200
            ${activeTab === 'calculator' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:text-text-primary'}
          `}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{t('tabs.calculate')}</span>
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          aria-selected={activeTab === 'compare'}
          className={`
            popup-tab flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 relative
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
          aria-selected={activeTab === 'history'}
          className={`
            popup-tab flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 relative
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
      <main className="popup-main flex-1 overflow-y-auto">
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

      {/* Support Footer */}
      <footer className="popup-footer border-t border-border/50 px-4 py-3 select-none">
        <a
          href="https://www.patreon.com/tahsinsoyak"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-[10px] font-bold text-text-secondary hover:text-accent transition-colors group"
        >
          <Heart className="w-3 h-3 text-danger/60 group-hover:text-danger transition-colors" />
          <span>{t('support.title')}</span>
        </a>
      </footer>
    </div>
  );
};

export default PopupApp;
