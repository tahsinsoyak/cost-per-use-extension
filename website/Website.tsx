import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, ArrowRight, Check, ShieldCheck, Github, Headphones, Footprints, Coffee, Plus, Minus } from 'lucide-react';
import { estimatePurchase, validatePurchase } from './model';
import { getUsesForCostTarget } from '../src/shared/lib/costTarget';
import { getUsageScenarios } from '../src/shared/lib/usageScenarios';
import type { Currency } from '../src/shared/types/calculation';
import { copy } from './copy';
import { useSiteMotion } from './useSiteMotion';
import { ProductScene } from './ProductScene';
import { SmoothAmount } from './SmoothAmount';
import { productName, type ProductExample } from './examples';
import { SupportSection, PATREON } from './SupportSection';
import { SiteHeader } from './SiteHeader';
import { initialLanguage, rememberLanguage, languageLocale, yearUnit, type SiteLanguage } from './language';

const STORE = 'https://chromewebstore.google.com/detail/cost-per-use/kchaaggejdclkmjgfjbdjimmmjibllmd';
const REPO = 'https://github.com/tahsinsoyak/cost-per-use-extension';
const presets = [{price:'200',years:'3',uses:'5'}, {price:'120',years:'2',uses:'4'}, {price:'450',years:'5',uses:'7'}];
const icons = [Headphones, Footprints, Coffee];
export default function Website() {
  useSiteMotion();
  const [lang,setLang] = useState<SiteLanguage>(initialLanguage);
  const changeLanguage = (language: SiteLanguage) => {
    setLang(language);
    rememberLanguage(language);
  };
  const t = copy[lang];
  const [preset,setPreset] = useState(0);
  const [name,setName] = useState<string|null>(null);
  const [selectedExample,setSelectedExample] = useState<ProductExample|null>(null);
  const [inputs,setInputs] = useState({...presets[0],resale:'',maintenance:'',payments:'',totalPaid:''});
  const [currency,setCurrency] = useState<Currency>('USD');
  const [target,setTarget] = useState('');
  const [advanced,setAdvanced] = useState(false);
  const update = (key:keyof typeof inputs,value:string) => setInputs(old=>({...old,[key]:value}));
  const money = (amount:number) => new Intl.NumberFormat(languageLocale(lang), {style:'currency',currency,maximumFractionDigits:2}).format(amount);
  const number = (amount:number) => amount.toLocaleString(languageLocale(lang));
  const price=Number(inputs.price), years=Number(inputs.years), uses=Number(inputs.uses);
  const resale=Number(inputs.resale), maintenance=Number(inputs.maintenance), payments=Number(inputs.payments), totalPaid=Number(inputs.totalPaid);
  const purchase={price,currency,years,uses,resale,maintenance,payments,totalPaid};
  const errors=validatePurchase(purchase);
  const usable=estimatePurchase(purchase);
  const messages=t.ui.errors;
  const fieldError=(key:keyof typeof inputs)=>errors[key]?<span className="field-error" id={`${key}-error`}>{messages[errors[key]!]}</span>:null;
  const errorProps=(key:keyof typeof inputs)=>({'aria-invalid':Boolean(errors[key]),'aria-describedby':errors[key]?`${key}-error`:undefined});
  const advancedErrors=['resale','maintenance','payments','totalPaid'].some(key=>errors[key as keyof typeof inputs]);
  const scenarios=usable?getUsageScenarios(usable.netCost,usable.totalEstimatedUses):null;
  const targetUses=usable&&target!==''?getUsesForCostTarget(usable.netCost,Number(target)):null;
  const displayedCost = usable ? money(usable.costPerUse) : '—';
  useEffect(()=>{document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr'; document.title=t.ui.pageTitle;},[lang,t.ui.pageTitle]);
  useEffect(()=>{
    type Context={registerTool:(tool: {name:string;title:string;description:string;inputSchema:object;annotations:object;execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>void|Promise<void>};
    const context=(document as Document & {modelContext?:Context}).modelContext;
    if (!context?.registerTool) return;
    const lifecycle=new AbortController();
    const tool={
      name:'set_purchase_estimate',title:'Calculate a purchase',
      description:'Set the visible calculator to a purchase and return its estimated cost per use. This replaces current inputs; it does not save or transmit them.',
      inputSchema:{type:'object',properties:{price:{type:'number',exclusiveMinimum:0},years:{type:'number',exclusiveMinimum:0},uses:{type:'number',exclusiveMinimum:0},currency:{type:'string',enum:['USD','TRY','EUR','GBP']}},required:['price','years','uses','currency'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input:unknown) {
        if(!input||typeof input!=='object') throw new Error('Expected a purchase object.');
        const p=input as Record<string,unknown>;
        if(Object.keys(p).some(k=>!['price','years','uses','currency'].includes(k))||
          !['price','years','uses'].every(k=>typeof p[k]==='number')||
          typeof p.currency!=='string'||!['USD','TRY','EUR','GBP'].includes(p.currency)) throw new Error('Invalid purchase fields.');
        const estimate=estimatePurchase({price:p.price as number,years:p.years as number,uses:p.uses as number,currency:p.currency as Currency,resale:0,maintenance:0,payments:0,totalPaid:0});
        if(!estimate) throw new Error('Enter positive finite amounts and at least one estimated use.');
        flushSync(()=>{setInputs({price:String(p.price),years:String(p.years),uses:String(p.uses),resale:'',maintenance:'',payments:'',totalPaid:''});setCurrency(p.currency as Currency);setTarget('');setName(null);setSelectedExample(null);setPreset(0);});
        return {costPerUse:estimate.costPerUse,totalEstimatedUses:estimate.totalEstimatedUses,netCost:estimate.netCost,currency:estimate.currency};
      }
    };
    try {void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});} catch { /* Optional browser capability. */ }
    return ()=>lifecycle.abort();
  },[]);
  function choose(index:number) {setPreset(index);setName(null);setSelectedExample(null);setInputs({...presets[index],resale:'',maintenance:'',payments:'',totalPaid:''});setTarget('');}
  function chooseProduct(example:ProductExample) {
    setInputs({price:String(example.price),years:String(example.years),uses:String(example.uses),resale:'',maintenance:'',payments:'',totalPaid:''});
    setCurrency('USD');setTarget('');setName(null);setSelectedExample(example);setPreset(-1);setAdvanced(false);
    requestAnimationFrame(()=>{
      const calculator=document.getElementById('calculator');
      calculator?.focus({preventScroll:true});
      calculator?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    });
  }
  const inputField=(key:keyof typeof inputs,label:string) => <label className="field"><span>{label}</span><input aria-label={label} {...errorProps(key)} type="number" min="0" step={key==='payments'?'1':'any'} value={inputs[key]} onChange={e=>update(key,e.target.value)} placeholder="0" />{fieldError(key)}</label>;
  return <>
    <a className="skip-link" href="#calculator">{t.nav[0]}</a>
    <SiteHeader lang={lang} onLanguage={changeLanguage} store={STORE}/>
    <main>
      <section className="hero container">
        <div className="hero-copy"><p className="eyebrow"><span/>{t.eyebrow}</p><h1>{t.title}<br/><em>{t.titleAccent}</em></h1><p className="intro">{t.intro}</p><div className="trust"><span><ShieldCheck size={17}/>{t.local}</span><span><Check size={17}/>{t.open}</span></div><a href="#calculator" className="hero-cue">{t.cue}<ArrowRight size={19}/></a></div>
        <ProductScene lang={lang} onSelect={chooseProduct}/>
      </section>
      <section id="calculator" tabIndex={-1} aria-label={t.nav[0]} className="calculator container">

        <div className="calculator-inputs">
          <div className="section-heading"><div><h2>{t.calc}</h2></div><span className="live-dot">{t.ui.live}</span></div>
          <div className="presets" aria-label={t.ui.examplePurchases}>{t.examples.map((label,i)=>{const Icon=icons[i];return <button key={label} onClick={()=>choose(i)} aria-pressed={preset===i}><Icon size={18}/>{label}</button>;})}</div>
          <div className="purchase-fields"><label className="field product-field"><span>{t.product}</span><input value={name??(selectedExample?productName(selectedExample,lang):t.examples[preset]??'')} maxLength={100} onChange={e=>setName(e.target.value)} /></label>
          <div className="price-row">{inputField('price',t.price)}<label className="field"><span>{t.currency}</span><select value={currency} onChange={e=>{setCurrency(e.target.value as Currency);setTarget('');}}>{['USD','TRY','EUR','GBP'].map(c=><option key={c}>{c}</option>)}</select></label></div>
          </div><div className="habit-fields"><div className="duration-control"><div className="duration-row"><span>{t.duration}</span><div className="stepper"><button aria-label={t.ui.decrease} disabled={years<=1} onClick={()=>update('years',String(Math.max(1,years-1)))}><Minus size={16}/></button><label><input {...errorProps('years')} aria-label={t.duration} type="number" min="0.1" step="any" value={inputs.years} onChange={e=>update('years',e.target.value)}/><span>{yearUnit(lang,years)||t.years}</span></label><button aria-label={t.ui.increase} onClick={()=>update('years',String(years+1))}><Plus size={16}/></button></div></div>
          {fieldError('years')}</div><div className="usage-control">
          <div className="usage-label"><label htmlFor="usage-range">{t.frequency}</label><input {...errorProps('uses')} aria-label={t.frequency} type="number" min="0.1" step="any" value={inputs.uses} onChange={e=>update('uses',e.target.value)}/></div>
          {fieldError('uses')}
          <input id="usage-range" className="usage-range" type="range" min="1" max="14" value={Math.min(14,uses)} onChange={e=>update('uses',e.target.value)} style={{'--fill':`${Math.max(0,(Math.min(14,uses)-1)/13)*100}%`} as React.CSSProperties}/>
          <div className="range-ticks"><span>1</span><span>7</span><span>14+</span></div></div></div>
          <button className="advanced-toggle" aria-expanded={advanced} aria-controls="advanced-fields" onClick={()=>setAdvanced(!advanced)}>{advanced?<Minus size={16}/>:<Plus size={16}/>} {t.advanced}{advancedErrors&&<span className="validation-badge">{t.ui.checkFields}</span>}</button>
          <div id="advanced-fields" className="advanced-panel" data-open={advanced} aria-hidden={!advanced}><div className="advanced-clip"><fieldset className="advanced-fields" disabled={!advanced}><div className="two-col">{inputField('resale',t.resale)}{inputField('maintenance',t.maintenance)}{inputField('payments',t.payments)}{inputField('totalPaid',t.totalPaid)}</div><p className="help">{t.advancedHelp}</p></fieldset></div></div>
          {!usable&&<p className="error" role="alert">{t.ui.checkEstimate}</p>}
        </div>
        <div id="estimate-details" className="calculator-result">
          <div className="receipt-top"><span>{t.result}</span><ShieldCheck size={17} aria-hidden="true"/></div>
          <div className="result-main" aria-live="polite"><p>{name??(selectedExample?productName(selectedExample,lang):t.examples[preset]??'')}</p><div className="result-amount"><span className="sr-only">{displayedCost}</span><SmoothAmount value={usable?.costPerUse??null} currency={currency} lang={lang}/></div><span>{t.perUse}</span></div>
          <div className="result-metrics"><div><strong>{usable?number(usable.totalEstimatedUses):'—'}</strong><span>{t.uses}</span></div><div><strong>{usable?money(usable.netCost):'—'}</strong><span>{t.net}</span></div></div>
          <details className="estimate-extras"><summary>{t.ui.compare}<Plus size={16}/></summary><div className="scenario"><h3>{t.less}</h3><div className="scenario-row"><span>{t.expected}</span><div className="bar expected"/><strong>{usable?money(usable.costPerUse):'—'}</strong></div><div className="scenario-row"><span>{t.half}</span><div className="bar half"/><strong>{scenarios?money(scenarios.halfUsage):'—'}</strong></div><p>{t.scenario}</p></div>
          <div className="target"><h3>{t.target}</h3><label htmlFor="target">{t.targetLabel} · {currency}</label><input id="target" type="number" step="any" min="0" placeholder="0.50" value={target} onChange={e=>setTarget(e.target.value)} aria-describedby="target-feedback" aria-invalid={target!==''&&targetUses===null}/><div id="target-feedback" aria-live="polite">{target!==''&&(targetUses!==null&&usable?<p><strong>{t.targetResult.replace('{uses}',number(targetUses))}</strong><br/>{targetUses<=usable.totalEstimatedUses?t.enough:t.more.replace('{uses}',number(targetUses-usable.totalEstimatedUses))}</p>:<p>{t.targetInvalid}</p>)}</div></div>
          </details><p className="result-disclaimer">{t.disclaimer}</p>
        </div>
      </section>
      <section id="how-it-works" className="method container"><div className="method-heading"><p className="eyebrow">{t.methodTag}</p><h2>{t.methodTitle}</h2></div><div className="steps">{t.steps.map(([num,title,body])=><article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
      <section id="extension" className="extension-section"><div className="container extension-grid"><div><p className="eyebrow">{t.extensionTag}</p><h2>{t.extensionTitle}</h2><p>{t.extensionText}</p><ul>{t.bullets.map(b=><li key={b}><Check size={18}/>{b}</li>)}</ul><a className="button" href={STORE}>{t.install}<ArrowUpRight size={18}/></a><p className="extension-note">{t.extensionNote}</p></div><div className="extension-preview"><img src={`${import.meta.env.BASE_URL}extension.png`} alt={t.ui.extensionAlt} width="1280" height="800" loading="lazy"/><span><span className="status-dot"/>{t.free}</span></div></div></section>
      <section className="faq container"><h2>{t.faqTitle}</h2><div>{t.faqs.map(([q,a])=><details key={q}><summary>{q}<Plus size={18}/></summary><p>{a}</p></details>)}</div></section>
      <SupportSection lang={lang}/>
    </main>
    <footer className="container"><div><a href="#" className="brand"><img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="30" height="30"/>Cost Per Use.</a><p>{t.footer}</p></div><div className="footer-links"><a href={PATREON} target="_blank" rel="noopener noreferrer">Patreon<ArrowUpRight size={14}/></a><a href={REPO}><Github size={16}/>{t.source}</a><a href={`${REPO}/issues`}>{t.support}</a><a href={`${REPO}/blob/main/docs/privacy-policy.md`}>{t.privacy}</a></div></footer>
  </>;
}
