const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 打开你本地服务器的网址
  await page.goto('http://localhost:8080');

  console.log('✅ 页面基本元素渲染正常');
  await browser.close();
})();
