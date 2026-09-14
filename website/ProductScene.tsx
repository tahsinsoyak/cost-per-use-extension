import { useState } from 'react';
import { Coffee, Headphones, Footprints, Camera, Watch, Backpack, Laptop, Bike, LampDesk, Leaf, Pause, Play } from 'lucide-react';
import './product-scene.css';
import { productExamples, exampleEstimate, type ProductExample } from './examples';

export function ProductScene({lang,onSelect}:{lang:'en'|'tr';onSelect:(example:ProductExample)=>void}) {
  const [paused,setPaused]=useState(false);
  const badge=(amount:number)=> <span className="scene-price"><strong>{new Intl.NumberFormat(lang==='tr'?'tr-TR':'en-US',{style:'currency',currency:'USD'}).format(amount)}</strong><span>{lang==='tr'?'/ kullanım':'/ use'}</span></span>;
  return <div className="product-scene" data-paused={paused}>
    <div className="scene-art" role="group" aria-label={lang==='en'?'Try a product example in US dollars':'ABD doları ile bir ürün örneği deneyin'}>
      <div className="scene-halo halo-mint"/><div className="scene-halo halo-blue"/>
      <div className="scene-orbit"/>
      <button className="scene-card card-coffee" onClick={()=>onSelect(productExamples[0])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[0][lang]}>{badge(exampleEstimate(productExamples[0]).costPerUse)}<Coffee size={48} strokeWidth={1.3}/><div className="coffee-steam"><i/><i/><i/></div><span className="scene-product-name">{productExamples[0][lang]}</span></button>
      <button className="scene-card card-headphones" onClick={()=>onSelect(productExamples[1])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[1][lang]}>{badge(exampleEstimate(productExamples[1]).costPerUse)}<Headphones size={106} strokeWidth={1.15}/><span className="scene-shadow"/><span className="scene-product-name">{productExamples[1][lang]}</span></button>
      <button className="scene-card card-shoes" onClick={()=>onSelect(productExamples[2])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[2][lang]}>{badge(exampleEstimate(productExamples[2]).costPerUse)}<Footprints size={50} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[2][lang]}</span></button>
      <button className="scene-card card-camera" onClick={()=>onSelect(productExamples[3])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[3][lang]}>{badge(exampleEstimate(productExamples[3]).costPerUse)}<Camera size={46} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[3][lang]}</span></button>
      <button className="scene-card card-watch" onClick={()=>onSelect(productExamples[4])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[4][lang]}>{badge(exampleEstimate(productExamples[4]).costPerUse)}<Watch size={43} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[4][lang]}</span></button>
      <button className="scene-card card-backpack" onClick={()=>onSelect(productExamples[5])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[5][lang]}>{badge(exampleEstimate(productExamples[5]).costPerUse)}<Backpack size={48} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[5][lang]}</span></button>
      <button className="scene-card card-laptop" onClick={()=>onSelect(productExamples[6])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[6][lang]}>{badge(exampleEstimate(productExamples[6]).costPerUse)}<Laptop size={48} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[6][lang]}</span></button>
      <button className="scene-card card-bike" onClick={()=>onSelect(productExamples[7])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[7][lang]}>{badge(exampleEstimate(productExamples[7]).costPerUse)}<Bike size={50} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[7][lang]}</span></button>
      <button className="scene-card card-lamp" onClick={()=>onSelect(productExamples[8])} aria-label={(lang==='en'?'Try ':'Dene: ')+productExamples[8][lang]}>{badge(exampleEstimate(productExamples[8]).costPerUse)}<LampDesk size={43} strokeWidth={1.3}/><span className="scene-product-name">{productExamples[8][lang]}</span></button>
      <span className="scene-leaf"><Leaf size={25} strokeWidth={1.5}/></span>
      <span className="scene-spark spark-one"/><span className="scene-spark spark-two"/>
    </div>
    <span className="scene-example">{lang==='en'?'Pick an item to try its estimate · USD examples':'Tahmini denemek için bir ürün seçin · USD örnekleri'}</span>
    <button className="scene-pause" onClick={()=>setPaused(!paused)} aria-label={paused?(lang==='en'?'Play decorative animation':'Dekoratif animasyonu oynat'):(lang==='en'?'Pause decorative animation':'Dekoratif animasyonu duraklat')}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>
  </div>;
}
