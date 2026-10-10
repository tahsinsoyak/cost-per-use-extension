import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {useCalculatorStore as store} from '../../store/useCalculatorStore';

function response(value: unknown) {
  vi.stubGlobal('chrome', {runtime: {}, tabs: {
    query: (_query: unknown, callback: (tabs: unknown[]) => void) => callback([{id:1, url:'https://shop.example/product'}]),
    sendMessage: (_id: number, _message: unknown, callback: (value: unknown) => void) => callback(value),
  }});
}
beforeEach(() => {
  store.setState({...store.getInitialState(), settings:{...store.getInitialState().settings,autoFillEnabled:true}});
});
afterEach(() => { vi.unstubAllGlobals(); });
it('keeps price and currency when only the title is detected', () => {
  store.getState().setInputs({currentPrice:'200',currentCurrency:'EUR'});
  response({productName:'Shoes',price:'',currency:'USD'});
  store.getState().triggerScrape(true);
  expect(store.getState()).toMatchObject({currentPrice:'200',currentCurrency:'EUR',currentProductName:'Shoes',toast:{type:'info'}});
});
it('does not overwrite restored or typed values on automatic reads', () => {
  store.getState().setInputs({currentPrice:'200',currentProductName:'My shoes',currentCurrency:'EUR'});
  response({productName:'Page shoes',price:'90',currency:'USD'});
  store.getState().triggerScrape();
  expect(store.getState()).toMatchObject({currentPrice:'200',currentProductName:'My shoes',currentCurrency:'EUR',toast:null});
});
it('lets an explicit autofill refresh use detected values', () => {
  store.getState().setInputs({currentPrice:'200',currentCurrency:'EUR'});
  response({productName:'Shoes',price:'90',currency:'CUSTOM',customCurrencySymbol:'CAD'});
  store.getState().triggerScrape(true);
  expect(store.getState()).toMatchObject({currentPrice:'90',currentCurrency:'CUSTOM',currentCustomCurrencySymbol:'CAD',toast:{type:'success'}});
});
it('does not clear the name for a price-only result', () => {
  store.getState().setInputs({currentProductName:'My purchase'});
  response({productName:'',price:'90',currency:'USD'});
  store.getState().triggerScrape(true);
  expect(store.getState().currentProductName).toBe('My purchase');
});
it.each(['NaN','Infinity','-1','0'])('ignores invalid price %s', price => {
  store.getState().setInputs({currentPrice:'200'});
  response({productName:'Shoes',price,currency:'USD'});
  store.getState().triggerScrape(true);
  expect(store.getState().currentPrice).toBe('200');
  expect(store.getState().toast?.type).not.toBe('success');
});
