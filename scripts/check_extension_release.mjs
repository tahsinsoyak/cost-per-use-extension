import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

// Uses an isolated Chromium profile and the actual built extension, never the user's profile.
const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
const dist = path.resolve('dist');
const fixture = createServer((_request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end('<!doctype html><title>Local product fixture</title><h1>Release test headphones</h1><meta property="product:price:amount" content="200"><meta property="product:price:currency" content="USD">');
});
await new Promise(resolve => fixture.listen(0, '127.0.0.1', resolve));
const fixtureUrl = `http://127.0.0.1:${fixture.address().port}/`;
let context;
try {
  context = await chromium.launchPersistentContext('', {
    channel: 'chromium', headless: true, viewport: {width: 1280, height: 1000},
    args: ['--enable-unsafe-extension-debugging', `--disable-extensions-except=${dist}`, `--load-extension=${dist}`],
  });
  const browserCDP = await context.browser().newBrowserCDPSession();
  const {extensions} = await browserCDP.send('Extensions.getExtensions');
  const extension = extensions.find(item => item.name === 'Cost Per Use');
  assert.ok(extension?.enabled);
  assert.equal(extension.version, manifest.version);
  const root = `chrome-extension://${extension.id}/`;
  const page = context.pages()[0];
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(root + 'index.html');
  await page.getByTestId('whats-new-dialog').waitFor();
  assert.ok((await page.getByTestId('whats-new-dialog').textContent()).includes(manifest.version));
  await page.getByTestId('dismiss-whats-new').click();
  await page.reload();
  await page.locator('form').waitFor();
  assert.equal(await page.getByTestId('whats-new-dialog').count(), 0);
  await page.getByPlaceholder('What are you buying?').fill('Financed headphones');
  await page.locator('.price-input').fill('200');
  await page.getByRole('button', {name: /Advanced/}).click();
  await page.getByLabel('Number of Payments', {exact:true}).fill('12');
  await page.locator('button[type=submit]').click();
  await page.getByText('Enter both the installment count and total paid.', {exact:true}).waitFor();
  assert.equal(await page.getByTestId('calculation-result').count(), 0);
  await page.getByLabel('Total Amount Paid', {exact:true}).fill('240');
  await page.getByLabel('Estimated Maintenance Cost', {exact:true}).fill('20.5');
  await page.getByLabel('Estimated Resale Value', {exact:true}).fill('40');
  await page.getByLabel('Net Hourly Wage', {exact:true}).fill('25');
  await page.locator('button[type=submit]').click();
  await page.getByTestId('usage-scenarios').waitFor();
  await page.getByTestId('cost-target').getByRole('spinbutton').fill('0.5');
  assert.equal(await page.getByTestId('cost-target-result').locator('dd').textContent(), '441');
  await page.getByRole('button',{name:'Save Calculation',exact:true}).click();
  await page.getByRole('button',{name:'Add to Compare',exact:true}).click();
  let data = await page.evaluate(() => chrome.storage.local.get(['history','comparisonList']));
  assert.equal(data.history.length,1);
  assert.equal(data.comparisonList.length,1);
  assert.equal(data.history[0].netCost,220.5);
  assert.equal(data.history[0].installmentCount,12);
  assert.equal(data.history[0].hourlyWageAtCalculation,25);
  assert.equal(Object.hasOwn(data.history[0], 'target'),false);
  for (const price of ['300','400','500']) {
    await page.locator('.price-input').fill(price);
    await page.locator('button[type=submit]').click();
    await page.getByRole('button',{name:'Add to Compare',exact:true}).click();
  }
  assert.equal((await page.evaluate(()=>chrome.storage.local.get('comparisonList'))).comparisonList.length,3);

  // Restoring a saved result must restore financing and wage, not stale form values.
  await page.getByLabel('Total Amount Paid', {exact:true}).fill('999');
  await page.getByRole('button',{name:/History/}).click();
  await page.locator('button[title]').filter({has:page.locator('svg.lucide-refresh-ccw')}).first().click();
  await page.getByRole('button',{name:'Calculate',exact:true}).click();
  await page.getByTestId('calculation-result').waitFor();
  await page.getByRole('button',{name:/Advanced/}).click();
  assert.equal(await page.getByLabel('Total Amount Paid',{exact:true}).inputValue(),'240');
  assert.equal(await page.getByLabel('Net Hourly Wage',{exact:true}).inputValue(),'25');

  await page.goto(root+'options.html');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export JSON',exact:true}).click();
  const download=await downloadPromise;
  const exported=JSON.parse(await readFile(await download.path(),'utf8'));
  assert.equal(exported[0].netCost,220.5);
  await page.locator('#import-json-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{...exported[0],id:'bad',price:-1}]))});
  await page.getByText('Failed to parse JSON file. Please check if the file is valid.',{exact:true}).waitFor();
  assert.equal((await page.evaluate(()=>chrome.storage.local.get('history'))).history.length,1);
  await page.locator('#import-json-file').setInputFiles({name:'roundtrip.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify([{...exported[0],id:'imported',costPerUse:-500}]))});
  await page.waitForFunction(async()=> (await chrome.storage.local.get('history')).history?.length===2);
  data=await page.evaluate(()=>chrome.storage.local.get('history'));
  assert.ok(data.history.every(item=>item.costPerUse>0));
  assert.equal(data.history.find(item=>item.id==='imported').netCost,220.5);

  // Real toolbar popup: grant activeTab by invoking the extension's actual action.
  await page.evaluate(()=>chrome.storage.local.set({settings:{language:'en',theme:'light',autoFillEnabled:false},popupFormState:{tabId:-1,inputs:null}}));
  await page.goto(fixtureUrl);
  async function openAction() {
    await page.bringToFront();
    const tabs=(await browserCDP.send('Target.getTargets',{filter:[{type:'tab'}]})).targetInfos;
    const tab=tabs.find(item=>item.url===fixtureUrl);
    await browserCDP.send('Extensions.triggerAction',{id:extension.id,targetId:tab.targetId});
    let target;
    for(let attempt=0;attempt<50&&!target;attempt++) {
      const targets=(await browserCDP.send('Target.getTargets',{filter:[{type:'other'}]})).targetInfos;
      target=targets.find(item=>item.url.startsWith(root)) ?? targets.find(item=>!item.url);
      if(!target) await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert.ok(target);
    const {sessionId}=await browserCDP.send('Target.attachToTarget',{targetId:target.targetId,flatten:false});
    let sequence=0;
    const pending=new Map();
    const receive=({sessionId: receivedSession,message})=>{
      if(receivedSession!==sessionId)return;
      const result=JSON.parse(message);
      if(result.id) { pending.get(result.id)?.(result); pending.delete(result.id); }
    };
    browserCDP.on('Target.receivedMessageFromTarget',receive);
    const send=(method,params={})=>new Promise((resolve,reject)=>{
      const id=++sequence;
      const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`Popup command timed out: ${method}`));},10000);
      pending.set(id,result=>{clearTimeout(timer);result.error?reject(new Error(result.error.message)):resolve(result.result);});
      browserCDP.send('Target.sendMessageToTarget',{sessionId,message:JSON.stringify({id,method,params})}).catch(reject);
    });
    await send('Runtime.runIfWaitingForDebugger');
    const evaluate=async expression=>{
      const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
      if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    await evaluate(`new Promise((resolve,reject)=>{let attempts=0;const tick=()=>{if(document.querySelector('.price-input'))resolve(true);else if(++attempts>100)reject('popup did not render');else setTimeout(tick,50);};tick();})`);
    return {evaluate,close:async()=>{
      await evaluate('window.close()').catch(error=>{if(!/closed|destroyed/.test(error.message))throw error;});
      for(let attempt=0;attempt<50;attempt++) {
        const remaining=(await browserCDP.send('Target.getTargets',{filter:[{type:'other'}]})).targetInfos;
        if(!remaining.some(item=>item.targetId===target.targetId))break;
        await new Promise(resolve=>setTimeout(resolve,100));
      }
      browserCDP.off('Target.receivedMessageFromTarget',receive);
    }};
  }
  let popup=await openAction();
  assert.equal(await popup.evaluate(`document.querySelector('.price-input').value`),'');
  const dimensions=await popup.evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})');
  assert.ok(dimensions.scrollWidth<=dimensions.width+1);
  await popup.evaluate(`chrome.storage.local.set({settings:{language:'en',theme:'light',autoFillEnabled:true}})`);
  await popup.close();
  // Finish the old action bubble's lifecycle before opening it on a fresh document.
  await page.reload();
  popup=await openAction();
  const scraped=await popup.evaluate(`new Promise((resolve,reject)=>{let attempts=0;const tick=()=>{const price=document.querySelector('.price-input')?.value;if(price==='200')resolve({price,title:document.querySelector('input[type=text]')?.value});else if(++attempts>100)reject('autofill failed: '+price);else setTimeout(tick,50);};tick();})`);
  assert.equal(scraped.price,'200');
  assert.equal(scraped.title,'Release test headphones');
  await popup.close();
  assert.deepEqual(pageErrors,[]);
  await mkdir('release-checks',{recursive:true});
  const {writeFile}=await import('node:fs/promises');
  await writeFile('release-checks/extension-smoke.json',JSON.stringify({version:manifest.version,checkedAt:new Date().toISOString(),checks:['real extension load','one-time update notice','financing validation','fractional maintenance','usage scenario','cost target','save','comparison storage','restore financing and wage','JSON export/import','invalid import rejection','recomputed import totals','real toolbar popup layout','autofill disabled','activeTab autofill on local product fixture']},null,2)+'\n');
  console.log(`Extension v${manifest.version}: packaged UI, storage, import/export and real activeTab autofill checks passed.`);
} finally {
  await context?.close();
  fixture.close();
}
