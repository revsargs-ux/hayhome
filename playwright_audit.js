const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  const BASE = 'http://172.18.0.21:3000';
  const log = (msg) => console.log(msg);

  try {
    log('\n=== СЦЕНАРИЙ 1: Главная ===');
    await page.goto('http://172.18.0.21:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const title = await page.title();
    log('Заголовок: ' + title);
    await page.screenshot({ path: '/tmp/s1_main.png' });
    const h1 = await page.locator('h1, h2').first().textContent().catch(() => 'н/д');
    log('H1/H2: ' + h1);

    log('\n=== СЦЕНАРИЙ 2: /hosts ===');
    await page.goto('http://172.18.0.21:3000/hosts', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.screenshot({ path: '/tmp/s2_hosts.png' });
    const cards = await page.locator('a[href*="/hosts/"]').count();
    log('Карточек семей: ' + cards);

    log('\n=== СЦЕНАРИЙ 3: Events + модал ===');
    await page.goto('http://172.18.0.21:3000/events', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.screenshot({ path: '/tmp/s3_events.png' });
    const eventBtns = await page.locator('button').count();
    log('Кнопок на странице: ' + eventBtns);
    const learnBtn = page.locator('button').filter({ hasText: /подробнее|learn/i }).first();
    if (await learnBtn.count() > 0) {
      await learnBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '/tmp/s3_modal.png' });
      log('✅ Модал открылся');
      const bookBtn = page.locator('button').filter({ hasText: /забронировать/i }).first();
      if (await bookBtn.count() > 0) {
        await bookBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: '/tmp/s3_form.png' });
        log('✅ Форма бронирования открылась');
      } else {
        log('⚠️ Кнопки Забронировать нет в модале');
      }
    } else {
      log('⚠️ Кнопок событий не найдено');
    }

    log('\n=== СЦЕНАРИЙ 4: /welcome ===');
    await page.goto('http://172.18.0.21:3000/welcome', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.screenshot({ path: '/tmp/s4_welcome.png' });
    const wText = await page.locator('h1').first().textContent().catch(() => '?');
    log('H1 welcome: ' + wText);

    log('\n=== СЦЕНАРИЙ 5: Мобильный вид ===');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://172.18.0.21:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.screenshot({ path: '/tmp/s5_mobile.png' });
    const bottomBar = await page.locator('nav, [class*="bottom"]').count();
    log('Нижняя навигация элементов: ' + bottomBar);

  } catch (err) {
    log('❌ ' + err.message);
  }

  await browser.close();
  log('\n=== PLAYWRIGHT ЗАВЕРШЁН ===');
})();
