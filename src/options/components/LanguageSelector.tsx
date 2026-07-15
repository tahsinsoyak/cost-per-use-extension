import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Language, getLanguageConfig, languages } from '../../shared/locales';

interface LanguageSelectorProps {
  label: string;
  value: Language;
  onChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = getLanguageConfig(value);

  return (
    <div className="flex flex-col gap-1.5 relative select-none">
      <span className="text-xs font-bold text-text-secondary">{label}</span>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
        className="flex justify-between items-center w-full px-3 py-2.5 bg-background border border-border/70 rounded-xl hover:border-accent/50 focus:border-accent text-xs font-semibold text-text-primary transition-all duration-200 outline-none"
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">{selected.flag}</span>
          <span>{selected.nativeName}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close language menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="listbox"
            className="absolute top-[64px] left-0 right-0 z-50 max-h-64 overflow-y-auto bg-surface border border-border/70 rounded-xl shadow-premium dark:shadow-premium-dark p-1 flex flex-col gap-0.5 animate-scale-in origin-top"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={language.code === value}
                onClick={() => {
                  onChange(language.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors hover:bg-elevated/40 ${language.code === value ? 'bg-accent/10 text-accent hover:bg-accent/15' : 'text-text-primary'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none" aria-hidden="true">{language.flag}</span>
                  <span>{language.nativeName}</span>
                </span>
                {language.code === value && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
