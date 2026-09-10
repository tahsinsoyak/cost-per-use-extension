import { useId, useState } from 'react';
import { translate, getLanguageConfig } from '../../shared/locales';
import { getUsesForCostTarget } from '../../shared/lib/costTarget';
import type { CostCalculation } from '../../shared/types/calculation';
import type { Language } from '../../shared/locales/catalog';

interface Props {
  calculation: Pick<CostCalculation, 'netCost' | 'totalEstimatedUses' | 'currency' | 'customCurrencySymbol'>;
  language: Language;
}

export default function CostTarget({ calculation, language }: Props) {
  const id = useId();
  const [target, setTarget] = useState('');
  const [badInput, setBadInput] = useState(false);
  const t = (key: string) => translate(`results.target.${key}`, language);
  const currency = calculation.currency === 'CUSTOM'
    ? calculation.customCurrencySymbol || '¤' : calculation.currency;
  const amount = Number(target);
  const hasTarget = target.trim() !== '';
  const invalidAmount = badInput || (hasTarget && (!Number.isFinite(amount) || amount <= 0));
  const usesNeeded = hasTarget && !invalidAmount ? getUsesForCostTarget(calculation.netCost, amount) : null;
  const error = invalidAmount ? t('invalid') : hasTarget && usesNeeded === null ? t('outOfRange') : '';
  const formatUses = (uses: number) => uses.toLocaleString(getLanguageConfig(language).dateLocale);

  return (
    <section aria-labelledby={`${id}-title`} data-testid="cost-target"
      className="bg-elevated/40 border border-border/40 rounded-2xl p-4">
      <h3 id={`${id}-title`} className="text-sm font-bold text-text-primary">{t('title')}</h3>
      <p id={`${id}-help`} className="mt-2 text-xs leading-relaxed text-text-secondary">{t('help')}</p>
      <label htmlFor={`${id}-input`} className="mt-3 block text-xs font-semibold text-text-secondary">
        {t('label').replace('{currency}', currency)}
      </label>
      <input id={`${id}-input`} type="number" inputMode="decimal" step="any" min="0"
        value={target} placeholder="0.50"
        aria-invalid={Boolean(error)} aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`}
        onChange={event => {
          setTarget(event.target.value);
          setBadInput(event.target.validity.badInput);
        }}
        className="app-input mt-2 w-full min-w-0 bg-surface text-text-primary text-sm rounded-xl border border-border/80 px-3.5 py-2.5 focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
      />
      <div aria-live="polite" aria-atomic="true">
        {error && <p id={`${id}-error`} className="mt-2 text-xs leading-relaxed text-danger">{error}</p>}
        {usesNeeded !== null && !error && (
          <div className="mt-3" data-testid="cost-target-result">
            <dl>
              <dt className="text-xs text-text-secondary">{t('usesNeeded')}</dt>
              <dd className="mt-1 text-xl font-extrabold text-text-primary break-all">{formatUses(usesNeeded)}</dd>
            </dl>
            <p className="mt-2 text-xs leading-relaxed text-text-primary">
              {usesNeeded <= calculation.totalEstimatedUses
                ? t('withinEstimate')
                : t('beyondEstimate').replace('{uses}', formatUses(usesNeeded - calculation.totalEstimatedUses))}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{t('assumption')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
