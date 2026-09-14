import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Menu, X } from 'lucide-react';
import { copy } from './copy';

const destinations=['#calculator','#how-it-works','#extension','#support-project'];
export function SiteHeader({lang,onLanguage,store}:{lang:'en'|'tr';onLanguage:(lang:'en'|'tr')=>void;store:string}) {
  const [open,setOpen]=useState(false);
  const header=useRef<HTMLElement>(null);
  const toggle=useRef<HTMLButtonElement>(null);
  const t=copy[lang];
  useEffect(()=>{
    const media=window.matchMedia('(min-width: 1001px)');
    const resize=()=>{if(media.matches) setOpen(false);};
    media.addEventListener('change',resize);
    const outside=(event:PointerEvent)=>{if(!header.current?.contains(event.target as Node)) setOpen(false);};
    document.addEventListener('pointerdown',outside);
    return()=>{media.removeEventListener('change',resize);document.removeEventListener('pointerdown',outside);};
  },[]);
  const languages=<div className="language" aria-label={lang==='en'?'Language':'Dil'}>{(['en','tr'] as const).map(l=><button key={l} aria-pressed={lang===l} onClick={()=>onLanguage(l)}>{l.toUpperCase()}</button>)}</div>;
  return <header ref={header} className="site-header container responsive-header" onKeyDown={event=>{if(event.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}}}>
    <a href="#" className="brand" onClick={()=>setOpen(false)}><img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="36" height="36"/><span>Cost Per Use<span className="brand-dot">.</span></span></a>
    <nav className="desktop-navigation" aria-label={lang==='en'?'Main navigation':'Ana gezinme'}>{t.nav.map((item,i)=><a key={item} href={destinations[i]}>{item}</a>)}</nav>
    <div className="header-actions">{languages}<a href={store} className="button small">{t.install}<ArrowUpRight size={16}/></a></div>
    <button ref={toggle} className="mobile-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}<span>{open?(lang==='en'?'Close':'Kapat'):(lang==='en'?'Menu':'Menü')}</span></button>
    <div id="mobile-navigation" className="mobile-menu-panel" hidden={!open}>
      <nav aria-label={lang==='en'?'Mobile navigation':'Mobil gezinme'}>{t.nav.map((item,i)=><a key={item} href={destinations[i]} onClick={()=>{
        setOpen(false);
        const target=document.querySelector<HTMLElement>(destinations[i]);
        target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});
      }}><span>{item}</span><ArrowRight size={18}/></a>)}</nav>
      <div className="mobile-menu-bottom"><span>{lang==='en'?'Language':'Dil'}</span>{languages}</div>
    </div>
  </header>;
}
