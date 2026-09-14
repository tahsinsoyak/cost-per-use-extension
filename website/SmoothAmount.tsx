import { useEffect, useRef } from 'react';

/** Retarget from the currently displayed amount when the slider moves again. */
export function SmoothAmount({value,currency,lang}:{value:number|null;currency:string;lang:'en'|'tr'}) {
  const element=useRef<HTMLSpanElement>(null);
  const current=useRef(value);
  const previousCurrency=useRef(currency);
  useEffect(()=>{
    const node=element.current;
    if(!node) return;
    const format=new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-US',{style:'currency',currency});
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    const finish=()=>{cancelAnimationFrame(frame);current.current=value;node.textContent=value===null?'—':format.format(value);};
    const start=current.current;
    const currencyChanged=previousCurrency.current!==currency;
    previousCurrency.current=currency;
    if(value===null||start===null||preference.matches||currencyChanged||start===value){finish();return;}
    const started=performance.now();
    const tick=(now:number)=>{
      const progress=Math.min(1,(now-started)/320);
      current.current=start+(value-start)*(1-Math.pow(1-progress,3));
      node.textContent=format.format(current.current);
      if(progress<1) frame=requestAnimationFrame(tick);else finish();
    };
    frame=requestAnimationFrame(tick);
    const onPreference=()=>{if(preference.matches) finish();};
    preference.addEventListener('change',onPreference);
    return()=>{cancelAnimationFrame(frame);preference.removeEventListener('change',onPreference);};
  },[value,currency,lang]);
  return <span ref={element} aria-hidden="true"/>;
}
