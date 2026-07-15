import React, { useState } from 'react';
import { Calendar, Download, HelpCircle, Info, Trash2, Upload } from 'lucide-react';
import Badge from '../../shared/components/Badge';
import Button from '../../shared/components/Button';
import { formatCurrency } from '../../shared/lib/formatCurrency';
import { getLanguageConfig, translate } from '../../shared/locales';
import { useCalculatorStore } from '../../shared/store/useCalculatorStore';

export const HistoryPanel: React.FC = () => {
  const {
    settings,
    history,
    deleteCalculation,
    clearHistory,
    importHistory,
    showToast,
  } = useCalculatorStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const t = (key: string) => translate(key, settings.language);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(getLanguageConfig(settings.language).dateLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const formatWorkTimeShort = (hours: number) => {
    if (hours >= 8) {
      const days = Math.floor(hours / 8);
      const remainingHours = Math.round(hours % 8);
      return remainingHours > 0
        ? `${days}${t('common.dayShort')} ${remainingHours}${t('common.hourShort')}`
        : `${days}${t('common.dayShort')}`;
    }
    if (hours >= 1) {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      return minutes > 0
        ? `${wholeHours}${t('common.hourShort')} ${minutes}${t('common.minuteShort')}`
        : `${wholeHours}${t('common.hourShort')}`;
    }
    return `${Math.round(hours * 60)}${t('common.minuteShort')}`;
  };

  const handleExportData = () => {
    try {
      const data = encodeURIComponent(JSON.stringify(history, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = `data:text/json;charset=utf-8,${data}`;
      downloadAnchor.download = `cost_per_use_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(t('common.saveSuccess'), 'success');
    } catch {
      showToast(t('common.saveError'), 'error');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      const contents = loadEvent.target?.result;
      if (typeof contents !== 'string') return;
      const result = await importHistory(contents);
      showToast(
        result.success
          ? t('history.importSuccess').replace('{count}', result.count.toString())
          : t('history.importError'),
        result.success ? 'success' : 'error',
      );
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearAll = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    await clearHistory();
    setConfirmClear(false);
    showToast(t('settings.clearDbSuccess'), 'success');
  };

  return (
    <div className="lg:col-span-8 flex flex-col gap-6">
      <section className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 select-none">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-accent" />
            <span>{t('history.title')} ({history.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <input type="file" id="import-json-file" accept=".json" className="hidden" onChange={handleImportData} />
            <Button onClick={() => document.getElementById('import-json-file')?.click()} variant="secondary" size="sm" className="flex gap-1.5 items-center text-xs font-semibold">
              <Upload className="w-3.5 h-3.5" />
              <span>{t('history.btnImport')}</span>
            </Button>
            {history.length > 0 && (
              <>
                <Button onClick={handleExportData} variant="secondary" size="sm" className="flex gap-1.5 items-center text-xs font-semibold">
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('history.btnExport')}</span>
                </Button>
                <Button onClick={handleClearAll} variant={confirmClear ? 'danger' : 'secondary'} size="sm" className="flex gap-1.5 items-center text-xs font-semibold">
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
            <p className="text-xs text-text-secondary leading-relaxed max-w-[320px] mb-4">{t('history.emptySub')}</p>
            <Button onClick={() => document.getElementById('import-json-file')?.click()} variant="secondary" size="sm" className="flex gap-1.5 items-center text-xs font-semibold">
              <Upload className="w-3.5 h-3.5" />
              <span>{t('history.btnImport')}</span>
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
                  {settings.showWorkCost && <th className="p-3.5">{t('history.tableLabor')}</th>}
                  <th className="p-3.5">{t('history.tableRating')}</th>
                  <th className="p-3.5">{t('history.tableCostUse')}</th>
                  <th className="p-3.5 text-center">{t('history.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {history.map((item) => {
                  const hasAdjustments = Boolean((item.resaleValue && item.resaleValue > 0) || (item.maintenanceCost && item.maintenanceCost > 0));
                  return (
                    <tr key={item.id} className="hover:bg-elevated/20 transition-colors">
                      <td className="p-3.5 align-middle">
                        <div className="flex flex-col gap-0.5 max-w-[180px]">
                          <span className="font-semibold text-text-primary truncate" title={item.productName || t('history.unnamedProduct')}>{item.productName || t('history.unnamedProduct')}</span>
                          {item.createdAt && <span className="text-[10px] text-text-secondary select-none">{formatDate(item.createdAt)}</span>}
                        </div>
                      </td>
                      <td className="p-3.5 align-middle text-text-secondary font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span>{formatCurrency(item.price, item.currency, item.customCurrencySymbol)}</span>
                          {item.installmentCount && item.monthlyPayment ? <span className="text-[9px] text-text-secondary/80 font-semibold">{t('history.monthsPlan').replace('{count}', item.installmentCount.toString())}</span> : null}
                        </div>
                      </td>
                      <td className="p-3.5 align-middle text-text-secondary font-semibold">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text-primary">{formatCurrency(item.netCost, item.currency, item.customCurrencySymbol)}</span>
                          {hasAdjustments && (
                            <div className="flex gap-1.5 text-[8px] text-text-secondary/75 mt-0.5">
                              {item.resaleValue && item.resaleValue > 0 ? <span className="text-success font-bold">R: -{formatCurrency(item.resaleValue, item.currency, item.customCurrencySymbol)}</span> : null}
                              {item.maintenanceCost && item.maintenanceCost > 0 ? <span className="text-danger font-bold">M: +{formatCurrency(item.maintenanceCost, item.currency, item.customCurrencySymbol)}</span> : null}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 align-middle text-text-secondary">
                        <div className="flex flex-col gap-0.5">
                          <span>{item.ownershipDurationValue} {t(item.ownershipDurationUnit === 'years' ? 'common.yrShort' : 'common.moShort')}</span>
                          <span className="text-[9px] text-text-secondary/80 font-medium">{t('history.usesCount').replace('{count}', item.totalEstimatedUses.toString())}</span>
                        </div>
                      </td>
                      {settings.showWorkCost && (
                        <td className="p-3.5 align-middle text-text-secondary">
                          {item.workHoursCost !== undefined && item.workHoursCost > 0 ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-text-primary">{formatWorkTimeShort(item.workHoursCost)}</span>
                              {item.workHoursPerUse !== undefined && item.workHoursPerUse > 0 ? <span className="text-[9px] text-text-secondary/75 font-medium">{formatWorkTimeShort(item.workHoursPerUse)} {t('common.perUseShort')}</span> : null}
                            </div>
                          ) : <span>-</span>}
                        </td>
                      )}
                      <td className="p-3.5 align-middle">
                        <Badge variant={item.valueRating === 'excellent' ? 'success' : item.valueRating === 'good' ? 'primary' : item.valueRating === 'think_twice' ? 'warning' : 'danger'} className="text-[9px] py-0.5 px-2 font-bold">
                          {t(`results.ratingLabels.${item.valueRating}`)}
                        </Badge>
                      </td>
                      <td className="p-3.5 align-middle"><span className="text-sm font-black text-accent">{formatCurrency(item.costPerUse, item.currency, item.customCurrencySymbol)}</span></td>
                      <td className="p-3.5 align-middle text-center select-none">
                        <button onClick={() => deleteCalculation(item.id)} className="text-text-secondary hover:text-danger p-1.5 rounded-lg hover:bg-elevated transition-colors" title={t('history.deleteTooltip')}>
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
      </section>

      <section className="bg-surface border border-border/50 rounded-2xl p-5 shadow-premium dark:shadow-premium-dark select-none">
        <h2 className="text-sm font-bold flex items-center gap-2 mb-3"><Info className="w-4.5 h-4.5 text-accent" /><span>{t('history.aboutTitle')}</span></h2>
        <p className="text-xs text-text-secondary leading-relaxed">{t('history.aboutDescription')}</p>
        <p className="text-[10px] text-text-secondary/70 mt-3">{t('history.aboutMeta')}</p>
      </section>
    </div>
  );
};

export default HistoryPanel;
