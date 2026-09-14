import { estimatePurchase } from './model';
import { copy } from './copy';
import type { SiteLanguage } from './language';
export const productExamples = [
  {id:'coffee',en:'Coffee machine',tr:'Kahve makinesi',price:450,years:5,uses:7},
  {id:'headphones',en:'Headphones',tr:'Kulaklık',price:200,years:3,uses:5},
  {id:'shoes',en:'Everyday shoes',tr:'Günlük ayakkabı',price:120,years:2,uses:4},
  {id:'camera',en:'Camera',tr:'Kamera',price:800,years:5,uses:2},
  {id:'watch',en:'Watch',tr:'Saat',price:150,years:4,uses:7},
  {id:'backpack',en:'Backpack',tr:'Sırt çantası',price:80,years:3,uses:5},
  {id:'laptop',en:'Laptop',tr:'Dizüstü bilgisayar',price:1200,years:4,uses:6},
  {id:'bike',en:'Bicycle',tr:'Bisiklet',price:600,years:5,uses:3},
  {id:'lamp',en:'Reading lamp',tr:'Okuma lambası',price:40,years:5,uses:7},
] as const;
export type ProductExample = typeof productExamples[number];
export function productName(example: ProductExample, language: SiteLanguage): string {
  return copy[language].ui.products[productExamples.findIndex(item => item.id === example.id)];
}
export function exampleEstimate(example:ProductExample) {
  return estimatePurchase({...example,currency:'USD',resale:0,maintenance:0,payments:0,totalPaid:0})!;
}
