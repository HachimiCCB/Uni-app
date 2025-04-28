const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 打开你本地服务器的网址
  await page.goto('http://localhost:8080');

  // 测试页面标题是否正确出现
  const title = await page.locator('.uni-page-head__title');
  if (!(await title.isVisible())) {
    console.error('ERROR: 页面标题元素没有渲染！');
    process.exit(1);
  }

  // 测试NPC图片是否渲染
  const npcImages = await page.locator('.npc-img img');
  if ((await npcImages.count()) === 0) {
    console.error('ERROR: 没有发现任何NPC图片！');
    process.exit(1);
  }

  console.log('✅ 页面基本元素渲染正常');
  await browser.close();
})();
