import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import { copy } from './copy';
import { isSiteLanguage, siteLanguages, type SiteLanguage } from './language';

const destinations=['#calculator','#how-it-works','#extension','#support-project'];
export function SiteHeader({lang,onLanguage,store}:{lang:SiteLanguage;onLanguage:(lang:SiteLanguage)=>void;store:string}) {
  const [open,setOpen]=useState(false);
  const header=useRef<HTMLElement>(null);
  const toggle=useRef<HTMLButtonElement>(null);
  const t=copy[lang];
  useEffect(()=>{
    const media=window.matchMedia('(min-width: 1181px)');
    const resize=()=>{if(media.matches) setOpen(false);};
    media.addEventListener('change',resize);
    const outside=(event:PointerEvent)=>{if(!header.current?.contains(event.target as Node)) setOpen(false);};
    document.addEventListener('pointerdown',outside);
    return()=>{media.removeEventListener('change',resize);document.removeEventListener('pointerdown',outside);};
  },[]);
  const languages=<div className="language"><select aria-label={t.ui.language} value={lang} onChange={event=>{if(isSiteLanguage(event.target.value)) onLanguage(event.target.value);}}>{siteLanguages.map(language=><option key={language.code} value={language.code} lang={language.code}>{language.label}</option>)}</select></div>;
  return <header ref={header} className="site-header container responsive-header" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}}}>
    <a href="#" className="brand" onClick={()=>setOpen(false)}><img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="36" height="36"/><span>Cost Per Use<span className="brand-dot">.</span></span></a>
    <nav className="desktop-navigation" aria-label={t.ui.mainNavigation}>{t.nav.map((item,i)=><a key={item} href={destinations[i]}>{item}</a>)}</nav>
    <div className="header-actions">{languages}<a href={store} className="button small">{t.install}<ArrowUpRight size={16}/></a></div>
    <button ref={toggle} className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}<span>{open?t.ui.close:t.ui.menu}</span></button>
    <div id="mobile-navigation" className="mobile-menu-panel" hidden={!open}>
      <nav aria-label={t.ui.mobileNavigation}>{t.nav.map((item,i)=><a key={item} href={destinations[i]} onClick={()=>{
        setOpen(false);
        const target=document.querySelector<HTMLElement>(destinations[i]);
        target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});
      }}><span>{item}</span><ArrowRight size={18}/></a>)}</nav>
      <div className="mobile-menu-bottom"><span>{t.ui.language}</span>{languages}</div>
    </div>
  </header>;
}
