import { translate } from '../../shared/locales';
import { formatCurrency } from '../../shared/lib/formatCurrency';
import { getUsageScenarios } from '../../shared/lib/usageScenarios';
import { CostCalculation } from '../../shared/types/calculation';

interface Props {
  calculation: Pick<CostCalculation, 'netCost' | 'totalEstimatedUses' | 'currency' | 'customCurrencySymbol'>;
  language: Parameters<typeof translate>[1];
}

export default function UsageScenarios({ calculation, language }: Props) {
  const scenarios = getUsageScenarios(calculation.netCost, calculation.totalEstimatedUses);
  if (!scenarios) return null;
  const t = (key: string) => translate(`results.scenarios.${key}`, language);
  const format = (amount: number) => formatCurrency(amount, calculation.currency, calculation.customCurrencySymbol);

  return (
    <section aria-labelledby="usage-scenarios-title" data-testid="usage-scenarios"
      className="bg-elevated/40 border border-border/40 rounded-2xl p-4">
      <h3 id="usage-scenarios-title" className="text-sm font-bold text-text-primary">{t('title')}</h3>
      <dl className="mt-3 flex flex-col gap-3 text-xs">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-text-secondary">{t('expected')}</dt>
          <dd className="font-bold text-text-primary break-all">
            {format(scenarios.expected)} <span className="font-normal">{translate('results.perUseLabel', language)}</span>
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-text-secondary">{t('halfUsage')}</dt>
          <dd className="font-bold text-text-primary break-all">
            {format(scenarios.halfUsage)} <span className="font-normal">{translate('results.perUseLabel', language)}</span>
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-text-secondary">{t('assumption')}</p>
    </section>
  );
}
