import { importCalculation } from '../lib/importCalculation';
import { create } from 'zustand';
import { CostCalculation, Currency, AppSettings } from '../types/calculation';
import { storage } from '../lib/storage';
import { calculateCostPerUse } from '../lib/calculateCostPerUse';
import { validateCalculationInput } from '../lib/validation';
import { applyDocumentLanguage, resolveLanguage, translate } from '../locales';

interface CalculatorState {
  settings: AppSettings;
  isInitialized: boolean;
  history: CostCalculation[];
  comparisonList: CostCalculation[];

  // Current Calculation Inputs
  currentProductName: string;
  currentPrice: string;
  currentCurrency: Currency;
  currentCustomCurrencySymbol: string;
  currentDurationValue: string;
  currentDurationUnit: 'months' | 'years';
  currentUsesPerWeek: string;
  currentResaleValue: string;
  currentMaintenanceCost: string;
  currentInstallmentCount: string;
  currentTotalInstallmentCost: string;
  currentInlineHourlyWage: string;

  // Active calculated result
  currentResult: CostCalculation | null;
  formErrors: Record<string, string>;
  formWarnings: Record<string, string>;

  // Actions
  init: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  setInputs: (inputs: Partial<{
    currentProductName: string;
    currentPrice: string;
    currentCurrency: Currency;
    currentCustomCurrencySymbol: string;
    currentDurationValue: string;
    currentDurationUnit: 'months' | 'years';
    currentUsesPerWeek: string;
    currentResaleValue: string;
    currentMaintenanceCost: string;
    currentInstallmentCount: string;
    currentTotalInstallmentCost: string;
    currentInlineHourlyWage: string;
  }>) => void;
  calculate: () => boolean;
  saveCalculation: () => Promise<boolean>;
  deleteCalculation: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  importHistory: (jsonString: string) => Promise<{ success: boolean; count: number; message: string }>;
  
  // Comparison
  addToComparison: (calc: CostCalculation) => boolean;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  // Auto-fill Product Scraper
  triggerScrape: (showFeedback?: boolean) => void;

  // Popup form persistence
  restorePopupFormState: (currentTabId: number) => Promise<void>;
  savePopupFormState: (currentTabId: number) => Promise<void>;
}

const getInitialLanguage = () => {
  if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
    return resolveLanguage(chrome.i18n.getUILanguage());
  } else if (typeof navigator !== 'undefined') {
    return resolveLanguage(navigator.language);
  }
  return 'en';
};

const DEFAULT_SETTINGS: AppSettings = {
  defaultCurrency: 'USD',
  customCurrencySymbol: '',
  defaultDurationValue: 1,
  defaultDurationUnit: 'years',
  defaultUsesPerWeek: 5,
  theme: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  onboardingCompleted: false,
  showWorkCost: false,
  monthlySalary: 0,
  workHoursPerWeek: 40,
  hourlyWage: 0,
  language: getInitialLanguage(),
  autoFillEnabled: false,
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isInitialized: false,
  history: [],
  comparisonList: [],

  // Inputs
  currentProductName: '',
  currentPrice: '',
  currentCurrency: 'USD',
  currentCustomCurrencySymbol: '',
  currentDurationValue: '1',
  currentDurationUnit: 'years',
  currentUsesPerWeek: '5',
  currentResaleValue: '',
  currentMaintenanceCost: '',
  currentInstallmentCount: '',
  currentTotalInstallmentCost: '',
  currentInlineHourlyWage: '',

  currentResult: null,
  formErrors: {},
  formWarnings: {},
  toast: null,

  init: async () => {
    if (get().isInitialized) return;

    const storedSettings = await storage.get<AppSettings>('settings', DEFAULT_SETTINGS);
    const savedSettings = {
      ...DEFAULT_SETTINGS,
      ...storedSettings,
      language: resolveLanguage(storedSettings.language),
    };
    const savedHistory = await storage.get<CostCalculation[]>('history', []);
    const savedComparison = await storage.get<CostCalculation[]>('comparisonList', []);

    // Apply loaded theme to document
    if (savedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    applyDocumentLanguage(savedSettings.language);

    set({
      settings: savedSettings,
      history: savedHistory,
      comparisonList: savedComparison,
      currentCurrency: savedSettings.defaultCurrency,
      currentCustomCurrencySymbol: savedSettings.customCurrencySymbol,
      currentDurationValue: savedSettings.defaultDurationValue.toString(),
      currentDurationUnit: savedSettings.defaultDurationUnit,
      currentUsesPerWeek: savedSettings.defaultUsesPerWeek.toString(),
      isInitialized: true,
    });
  },

  updateSettings: async (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    await storage.set('settings', updated);
    
    // Apply theme changes dynamically
    if (newSettings.theme) {
      if (newSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    if (newSettings.language) {
      applyDocumentLanguage(newSettings.language);
    }

    set({ settings: updated });
  },

  setInputs: (inputs) => {
    set(inputs);
  },

  calculate: () => {
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
      settings,
    } = get();

    const price = Number(currentPrice);
    const duration = Number(currentDurationValue);
    const uses = Number(currentUsesPerWeek);
    const resale = Number(currentResaleValue);
    const maintenance = Number(currentMaintenanceCost);
    const installments = Number(currentInstallmentCount);
    const totalInstallment = Number(currentTotalInstallmentCost);
    const inlineWage = Number(currentInlineHourlyWage);

    const { errors, warnings, isValid } = validateCalculationInput({
      price,
      ownershipDurationValue: duration,
      ownershipDurationUnit: currentDurationUnit,
      installmentCount: installments,
      totalInstallmentCost: totalInstallment,
      hourlyWage: inlineWage,
      usesPerWeek: uses,
      resaleValue: resale,
      maintenanceCost: maintenance,
    });

    set({ formErrors: errors as Record<string, string>, formWarnings: warnings as Record<string, string> });

    if (!isValid) {
      set({ currentResult: null });
      return false;
    }

    // Use inline wage if provided, otherwise fall back to settings wage
    const effectiveWage = inlineWage > 0 ? inlineWage : (settings.showWorkCost ? settings.hourlyWage : 0);

    const calculated = calculateCostPerUse({
      productName: currentProductName,
      price,
      currency: currentCurrency,
      customCurrencySymbol: currentCustomCurrencySymbol,
      ownershipDurationValue: duration,
      ownershipDurationUnit: currentDurationUnit,
      usesPerWeek: uses,
      resaleValue: resale,
      maintenanceCost: maintenance,
      hourlyWage: effectiveWage,
      installmentCount: installments > 0 ? installments : undefined,
      totalInstallmentCost: totalInstallment > 0 ? totalInstallment : undefined,
    });

    if (Object.values(calculated).some(value => typeof value === 'number' && !Number.isFinite(value))) {
      set({currentResult: null, formErrors: {ownershipDurationValue: 'validation.usageRange'}});
      return false;
    }

    const resultWithMeta: CostCalculation = {
      ...calculated,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    set({ currentResult: resultWithMeta });
    return true;
  },

  saveCalculation: async () => {
    const { currentResult, history } = get();
    const t = (key: string) => translate(key, get().settings.language);
    if (!currentResult) {
      get().showToast(t('calculator.errors.calculateFirst'), 'error');
      return false;
    }

    // Check if it already exists or if we should add it
    const updatedHistory = [currentResult, ...history.filter(item => item.id !== currentResult.id)];
    
    // Save to storage
    await storage.set('history', updatedHistory);
    set({ history: updatedHistory });
    
    get().showToast(t('history.saveSuccess'), 'success');
    return true;
  },

  deleteCalculation: async (id) => {
    const t = (key: string) => translate(key, get().settings.language);
    const updatedHistory = get().history.filter((item) => item.id !== id);
    await storage.set('history', updatedHistory);
    set({ history: updatedHistory });
    get().showToast(t('history.deleteConfirm'), 'info');
  },

  clearHistory: async () => {
    const t = (key: string) => translate(key, get().settings.language);
    await storage.set('history', []);
    set({ history: [] });
    get().showToast(t('history.clearConfirm'), 'info');
  },

  importHistory: async (jsonString) => {
    const t = (key: string) => translate(key, get().settings.language);
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, message: t('history.importFormatError') };
      }

      const validCalculations = parsed.map(importCalculation).filter((item): item is CostCalculation => item !== null);

      if (validCalculations.length === 0) {
        return { success: false, count: 0, message: t('history.importNoValid') };
      }

      const currentHistory = get().history;
      const mergedMap = new Map<string, CostCalculation>();
      currentHistory.forEach((item) => mergedMap.set(item.id, item));
      validCalculations.forEach((item) => mergedMap.set(item.id, item));

      const mergedHistory = Array.from(mergedMap.values());
      mergedHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      await storage.set('history', mergedHistory);
      set({ history: mergedHistory });

      return {
        success: true,
        count: validCalculations.length,
        message: t('history.importSuccess').replace('{count}', validCalculations.length.toString()),
      };
    } catch (e) {
      return { success: false, count: 0, message: t('history.importError') };
    }
  },

  addToComparison: (calc) => {
    const { comparisonList } = get();
    const t = (key: string) => translate(key, get().settings.language);
    
    if (comparisonList.some((item) => item.id === calc.id)) {
      get().showToast(t('compare.alreadyAdded'), 'info');
      return false;
    }

    if (comparisonList.length >= 3) {
      get().showToast(t('compare.limitHelp'), 'error');
      return false;
    }

    const updatedComparison = [...comparisonList, calc];
    storage.set('comparisonList', updatedComparison);
    set({ comparisonList: updatedComparison });
    
    const productLabel = calc.productName || t('common.productDefault');
    get().showToast(t('compare.addedSuccess').replace('{product}', productLabel), 'success');
    return true;
  },

  removeFromComparison: (id) => {
    const t = (key: string) => translate(key, get().settings.language);
    const updatedComparison = get().comparisonList.filter((item) => item.id !== id);
    storage.set('comparisonList', updatedComparison);
    set({ comparisonList: updatedComparison });
    get().showToast(t('compare.removed'), 'info');
  },

  clearComparison: () => {
    storage.set('comparisonList', []);
    set({ comparisonList: [] });
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
  },

  clearToast: () => {
    set({ toast: null });
  },

  triggerScrape: (showFeedback = false) => {
    if (!get().settings.autoFillEnabled) return;

    if (typeof chrome === 'undefined' || !chrome.tabs || !chrome.tabs.query) {
      return;
    }

    const t = (key: string) => translate(key, get().settings.language);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.id || !activeTab.url) return;

      const url = activeTab.url;
      const isSystemPage =
        url.startsWith('chrome://') ||
        url.startsWith('chrome-extension://') ||
        url.startsWith('edge://') ||
        url.startsWith('about:');

      if (isSystemPage) {
        if (showFeedback) {
          get().showToast(t('scraper.systemPage'), 'error');
        }
        return;
      }

      const activeTabId = activeTab.id;

      // Helper to attempt injecting content script first
      const injectAndMessage = () => {
        if (!chrome.scripting) {
          if (showFeedback) {
            get().showToast(t('scraper.permissionMissing'), 'error');
          }
          return;
        }

        chrome.scripting.executeScript(
          {
            target: { tabId: activeTabId },
            files: ['assets/content.js'],
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error('Failed to inject content script:', chrome.runtime.lastError.message);
              if (showFeedback) {
                get().showToast(t('scraper.injectFailed'), 'error');
              }
              return;
            }

            // Successfully injected, send message now
            chrome.tabs.sendMessage(activeTabId, { action: 'scrapeProduct' }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Failed to communicate after injection:', chrome.runtime.lastError.message);
                if (showFeedback) {
                  get().showToast(t('scraper.connectFailed'), 'error');
                }
                return;
              }

              if (response && (response.productName || response.price)) {
                get().setInputs({
                  currentProductName: response.productName || '',
                  currentPrice: response.price || '',
                  currentCurrency: response.currency || 'USD',
                  currentCustomCurrencySymbol: response.customCurrencySymbol || '',
                });
                get().showToast(t('scraper.autofillSuccess'), 'success');
              } else {
                if (showFeedback) {
                  get().showToast(t('scraper.noProductDetails'), 'error');
                }
              }
            });
          }
        );
      };

      // Try sending the message directly first
      chrome.tabs.sendMessage(activeTabId, { action: 'scrapeProduct' }, (response) => {
        if (chrome.runtime.lastError) {
          console.log('Direct message failed, injecting content script:', chrome.runtime.lastError.message);
          injectAndMessage();
          return;
        }

        if (response && (response.productName || response.price)) {
          get().setInputs({
            currentProductName: response.productName || '',
            currentPrice: response.price || '',
            currentCurrency: response.currency || 'USD',
            currentCustomCurrencySymbol: response.customCurrencySymbol || '',
          });
          get().showToast(t('scraper.autofillSuccess'), 'success');
        } else {
          if (showFeedback) {
            get().showToast(t('scraper.noProductDetails'), 'error');
          }
        }
      });
    });
  },

  restorePopupFormState: async (currentTabId: number) => {
    const saved = await storage.get<{ tabId: number; inputs: Record<string, string> | null }>('popupFormState', { tabId: -1, inputs: null });
    if (saved.tabId === currentTabId && saved.inputs) {
      set(saved.inputs);
    }
  },

  savePopupFormState: async (currentTabId: number) => {
    const state = get();
    const inputs = {
      currentProductName: state.currentProductName,
      currentPrice: state.currentPrice,
      currentCurrency: state.currentCurrency,
      currentCustomCurrencySymbol: state.currentCustomCurrencySymbol,
      currentDurationValue: state.currentDurationValue,
      currentDurationUnit: state.currentDurationUnit,
      currentUsesPerWeek: state.currentUsesPerWeek,
      currentResaleValue: state.currentResaleValue,
      currentMaintenanceCost: state.currentMaintenanceCost,
      currentInstallmentCount: state.currentInstallmentCount,
      currentTotalInstallmentCost: state.currentTotalInstallmentCost,
      currentInlineHourlyWage: state.currentInlineHourlyWage,
    };
    await storage.set('popupFormState', { tabId: currentTabId, inputs });
  },
}));
