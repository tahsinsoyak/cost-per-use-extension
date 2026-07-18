import React from 'react';
import { BellRing, ExternalLink, Heart, Maximize2, ShieldCheck, X } from 'lucide-react';
import Button from '../../shared/components/Button';
import { translate } from '../../shared/locales';
import type { Language } from '../../shared/locales';

interface WhatsNewDialogProps {
  language: Language;
  version: string;
  onDismiss: () => void;
}

export const WhatsNewDialog: React.FC<WhatsNewDialogProps> = ({ language, version, onDismiss }) => {
  const t = (key: string) => translate(key, language);
  const featureItems = [
    { icon: Maximize2, title: t('updates.layoutTitle'), description: t('updates.layoutDescription') },
    { icon: BellRing, title: t('updates.noticeTitle'), description: t('updates.noticeDescription') },
    { icon: ShieldCheck, title: t('updates.privacyTitle'), description: t('updates.privacyDescription') },
  ];

  return (
    <div className="update-dialog-backdrop absolute inset-0 z-50 flex items-center justify-center p-3">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-dialog-title"
        data-testid="whats-new-dialog"
        className="update-dialog relative w-full overflow-y-auto rounded-3xl border p-3 animate-scale-in"
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t('updates.close')}
          className="absolute right-5 top-5 z-10 rounded-xl border border-white/15 bg-black/15 p-2 text-white/70 transition-colors hover:bg-black/25 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="update-dialog-hero overflow-hidden rounded-2xl px-5 py-5 text-white">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/80">
            {t('updates.eyebrow').replace('{version}', version)}
          </span>
          <h2 id="update-dialog-title" className="mt-3 max-w-[280px] text-2xl font-black leading-[1.08] tracking-tight">
            {t('updates.title')}
          </h2>
          <p className="mt-2 max-w-[300px] text-[11px] font-medium leading-relaxed text-white/70">
            {t('updates.description')}
          </p>
        </div>

        <div className="mt-3 grid gap-2">
          {featureItems.map(({ icon: Icon, title, description }) => (
            <div key={title} className="update-feature flex items-start gap-3 rounded-2xl border border-border/55 p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <strong className="block text-xs font-extrabold text-text-primary">{title}</strong>
                <span className="mt-0.5 block text-[10px] leading-relaxed text-text-secondary">{description}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2">
          <Button
            type="button"
            fullWidth
            onClick={onDismiss}
            data-testid="dismiss-whats-new"
            className="min-h-11"
          >
            {t('updates.continue')}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://github.com/tahsinsoyak/cost-per-use-extension/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDismiss}
              data-testid="release-notes-link"
              className="app-button inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-border/70 bg-surface px-2 text-[10px] font-bold text-text-primary transition-colors hover:bg-elevated"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{t('updates.releaseNotes')}</span>
            </a>
            <a
              href="https://www.patreon.com/tahsinsoyak"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDismiss}
              data-testid="support-link"
              className="app-button inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-danger/20 bg-danger/5 px-2 text-[10px] font-bold text-danger transition-colors hover:bg-danger/10"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>{t('updates.support')}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatsNewDialog;
