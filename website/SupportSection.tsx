import { copy } from './copy';
import type { SiteLanguage } from './language';
import { ArrowUpRight, Heart, Github, MessageCircle } from 'lucide-react';
import './support-section.css';

export const PATREON='https://www.patreon.com/tahsinsoyak';
const REPO='https://github.com/tahsinsoyak/cost-per-use-extension';
export function SupportSection({lang}:{lang:SiteLanguage}) {
  const t=copy[lang].supportContent;
  return <section id="support-project" className="support-section container" aria-labelledby="support-title">
    <div className="support-panel">
      <div className="support-mark" aria-hidden="true"><span/><Heart size={38} strokeWidth={1.3}/><i/></div>
      <div className="support-copy"><p className="eyebrow">{t.tag}</p><h2 id="support-title">{t.title}</h2><p>{t.body}</p><span className="support-signature">{t.signature}</span></div>
      <div className="support-action"><a className="patreon-button" href={PATREON} target="_blank" rel="noopener noreferrer"><Heart size={17} aria-hidden="true"/>{t.button}<ArrowUpRight size={17} aria-hidden="true"/></a><p>{t.note}</p></div>
    </div>
    <div className="contribute-links">
      <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true"/><span><strong>{t.feedback}</strong><span>{t.feedbackText}</span></span><ArrowUpRight size={17} aria-hidden="true"/></a>
      <a href={REPO} target="_blank" rel="noopener noreferrer"><Github size={20} aria-hidden="true"/><span><strong>{t.source}</strong><span>{t.sourceText}</span></span><ArrowUpRight size={17} aria-hidden="true"/></a>
    </div>
  </section>;
}
