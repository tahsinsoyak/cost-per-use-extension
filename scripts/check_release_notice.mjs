import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const version=JSON.parse(await readFile('public/manifest.json','utf8')).version;
const server=await createServer({server:{host:'127.0.0.1',port:0}});
let browser;
try {
  await server.listen();
  browser=await chromium.launch({headless:true});
  for(const language of ['en','tr','es','de','fr','pt-BR','ru','ar','ja','zh-CN']) {
    for(const theme of ['light','dark']) {
      const page=await browser.newPage({viewport:{width:400,height:600}});
      await page.addInitScript(({language,theme})=>localStorage.setItem('settings',JSON.stringify({language,theme,autoFillEnabled:false})),{language,theme});
      await page.goto(server.resolvedUrls.local[0]);
      const notice=page.getByTestId('whats-new-dialog');
      await notice.waitFor();
      assert.ok((await notice.textContent()).includes(version));
      assert.ok((await page.getByTestId('release-notes-link').getAttribute('href')).endsWith(`/v${version}.md`));
      assert.ok(await notice.evaluate(element=>element.scrollWidth<=element.clientWidth+1),`${language}: notice overflows`);
      await page.getByTestId('dismiss-whats-new').click();
      await page.reload();
      await page.locator('form').waitFor();
      assert.equal(await page.getByTestId('whats-new-dialog').count(),0);
      assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('lastSeenReleaseVersion'))),version);
      await page.close();
    }
  }
  console.log('Release notice: all ten languages and both themes fit and dismiss once per version.');
}finally{await browser?.close();await server.close();}
