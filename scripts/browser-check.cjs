// Optional browser QA: node scripts/browser-check.cjs <path-to-playwright-module>
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
  fs.mkdirSync('test-results',{recursive:true});
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const errors=[];
  for(const width of [1440,768,390,360]){
    for(const theme of ['light','dark']){
      const context=await browser.newContext({viewport:{width,height:960},colorScheme:theme, reducedMotion:'reduce'});
      const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:4174/');
      await page.getByRole('heading',{name:'Rodel Ilagan',exact:true}).waitFor();
      assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),theme);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}/${theme}`);
      if(width<761){await page.getByRole('button',{name:'Menu +'}).click();await page.locator('nav').getByRole('link',{name:/Services/}).click();assert.equal(await page.getByRole('button',{name:'Menu +'}).getAttribute('aria-expanded'),'false');}
      await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)}); await page.screenshot({path:`test-results/${width}-${theme}.png`,fullPage:true});
      await context.close();
    }
  }
  const page=await browser.newPage({viewport:{width:1440,height:960}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4174/');
  await page.getByLabel('Color theme').selectOption('dark');await page.reload();
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'dark');
  await page.goto('http://127.0.0.1:4174/#/admin');
  await page.getByRole('button',{name:'Save draft',exact:true}).waitFor();
  await page.getByLabel('Name',{exact:true}).fill('QA Draft Name');
  await page.getByLabel('Contact email').fill('test@example.com');
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
  await page.getByLabel('Upload photo').setInputFiles({name:'photo.png',mimeType:'image/png',buffer:png});
  await page.getByRole('status').filter({hasText:'Photo added'}).waitFor();
  await page.getByLabel('Upload résumé').setInputFiles({name:'test.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')});
  await page.getByRole('status').filter({hasText:'CV added'}).waitFor();
  await page.getByRole('button',{name:'Save draft',exact:true}).click();
  await page.getByRole('status').filter({hasText:'Draft saved'}).waitFor();
  await page.reload();assert.equal(await page.getByLabel('Name',{exact:true}).inputValue(),'QA Draft Name');
  const exported=page.waitForEvent('download');await page.getByRole('button',{name:'Export publishing bundle ↓'}).click();
  const file=await exported;await file.saveAs('test-results/export.zip');
  await page.getByRole('button',{name:'Preview draft ↗'}).click();
  await page.getByRole('heading',{name:'QA Draft Name',exact:true}).waitFor();
  await page.locator('nav').getByRole('link',{name:/Services/}).click();
  assert.equal(await page.getByRole('heading',{name:'QA Draft Name',exact:true}).count(),1);
  assert.equal(await page.getByRole('link',{name:'Download résumé ↓'}).count(),1);
  assert.equal(await page.locator('img[alt="QA Draft Name, portrait"]').count(),1);
  await page.goto('http://127.0.0.1:4174/');
  await page.getByRole('heading',{name:'Rodel Ilagan',exact:true}).waitFor();
  await page.goto('http://127.0.0.1:4174/#/admin');
  await page.setViewportSize({width:390,height:844});
  await page.getByLabel('Name',{exact:true}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Admin mobile overflow');
  await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)}); await page.screenshot({path:'test-results/admin-mobile-dark.png',fullPage:true});
  assert.deepEqual(errors,[]);
  await browser.close();console.log('PASS: 8 responsive/theme layouts; mobile navigation; theme persistence; draft save/reload; photo/CV uploads; ZIP export; preview navigation; published content isolation; mobile editor; no browser exceptions.');
})().catch(e=>{console.error(e);process.exit(1);});
