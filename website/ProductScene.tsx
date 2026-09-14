import { copy } from './copy';
import { languageLocale, type SiteLanguage } from './language';
import { useState } from 'react';
import { Coffee, Headphones, Footprints, Camera, Watch, Backpack, Laptop, Bike, LampDesk, Leaf, Pause, Play } from 'lucide-react';
import './product-scene.css';
import { productExamples, productName, exampleEstimate, type ProductExample } from './examples';

export function ProductScene({lang,onSelect}:{lang:SiteLanguage;onSelect:(example:ProductExample)=>void}) {
  const t=copy[lang];
  const [paused,setPaused]=useState(false);
  const badge=(amount:number)=> <span className="scene-price"><strong>{new Intl.NumberFormat(languageLocale(lang),{style:'currency',currency:'USD'}).format(amount)}</strong><span>{t.perUse}</span></span>;
  return <div className="product-scene" data-paused={paused}>
    <div className="scene-art" role="group" aria-label={t.ui.sceneLabel}>
      <div className="scene-halo halo-mint"/><div className="scene-halo halo-blue"/>
      <div className="scene-orbit"/>
      <button className="scene-card card-coffee" onClick={()=>onSelect(productExamples[0])} aria-label={(t.ui.try+' ')+productName(productExamples[0],lang)}>{badge(exampleEstimate(productExamples[0]).costPerUse)}<Coffee size={48} strokeWidth={1.3}/><div className="coffee-steam"><i/><i/><i/></div><span className="scene-product-name">{productName(productExamples[0],lang)}</span></button>
      <button className="scene-card card-headphones" onClick={()=>onSelect(productExamples[1])} aria-label={(t.ui.try+' ')+productName(productExamples[1],lang)}>{badge(exampleEstimate(productExamples[1]).costPerUse)}<Headphones size={106} strokeWidth={1.15}/><span className="scene-shadow"/><span className="scene-product-name">{productName(productExamples[1],lang)}</span></button>
      <button className="scene-card card-shoes" onClick={()=>onSelect(productExamples[2])} aria-label={(t.ui.try+' ')+productName(productExamples[2],lang)}>{badge(exampleEstimate(productExamples[2]).costPerUse)}<Footprints size={50} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[2],lang)}</span></button>
      <button className="scene-card card-camera" onClick={()=>onSelect(productExamples[3])} aria-label={(t.ui.try+' ')+productName(productExamples[3],lang)}>{badge(exampleEstimate(productExamples[3]).costPerUse)}<Camera size={46} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[3],lang)}</span></button>
      <button className="scene-card card-watch" onClick={()=>onSelect(productExamples[4])} aria-label={(t.ui.try+' ')+productName(productExamples[4],lang)}>{badge(exampleEstimate(productExamples[4]).costPerUse)}<Watch size={43} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[4],lang)}</span></button>
      <button className="scene-card card-backpack" onClick={()=>onSelect(productExamples[5])} aria-label={(t.ui.try+' ')+productName(productExamples[5],lang)}>{badge(exampleEstimate(productExamples[5]).costPerUse)}<Backpack size={48} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[5],lang)}</span></button>
      <button className="scene-card card-laptop" onClick={()=>onSelect(productExamples[6])} aria-label={(t.ui.try+' ')+productName(productExamples[6],lang)}>{badge(exampleEstimate(productExamples[6]).costPerUse)}<Laptop size={48} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[6],lang)}</span></button>
      <button className="scene-card card-bike" onClick={()=>onSelect(productExamples[7])} aria-label={(t.ui.try+' ')+productName(productExamples[7],lang)}>{badge(exampleEstimate(productExamples[7]).costPerUse)}<Bike size={50} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[7],lang)}</span></button>
      <button className="scene-card card-lamp" onClick={()=>onSelect(productExamples[8])} aria-label={(t.ui.try+' ')+productName(productExamples[8],lang)}>{badge(exampleEstimate(productExamples[8]).costPerUse)}<LampDesk size={43} strokeWidth={1.3}/><span className="scene-product-name">{productName(productExamples[8],lang)}</span></button>
      <span className="scene-leaf"><Leaf size={25} strokeWidth={1.5}/></span>
      <span className="scene-spark spark-one"/><span className="scene-spark spark-two"/>
    </div>
    <span className="scene-example">{t.ui.sceneCaption}</span>
    <button className="scene-pause" onClick={()=>setPaused(!paused)} aria-label={paused?t.ui.play:t.ui.pause}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>
  </div>;
}
