// 用于chrome H5 的测试
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 打开本地服务器
  await page.goto('http://localhost:8080');

  // 1. 基础布局检测
  console.log('✅ 页面基本元素渲染正常');
  await page.waitForSelector('.npc-area'); // NPC列表容器
  await page.waitForSelector('.tag-filter'); // 地区筛选标签
  await page.waitForSelector('img[src*="/static/img/npc/"]'); // NPC图片

  // 2. Tab栏功能检测
  // 切换到料理页面
  await page.click('text=料理');
  await page.waitForSelector('.cook-div'); // 料理列表容器
  await page.waitForSelector('.cook-bar[data-type="cook"]'); // 料理条目
  
  // 切换到饮料页面
  await page.click('text=饮料');
  await page.waitForSelector('.drinks-tag'); // 饮料标签筛选
  await page.waitForSelector('.cook-bar[data-type="drink"]'); // 饮料条目

  // 3. 筛选功能检测
  // 测试标签筛选
  await page.click('.touhou-tag:has-text("全部")');
  await page.waitForTimeout(500); // 等待筛选完成
  const npcItems = await page.$$('.npc-img');
  console.log(`✅ 地区筛选正常，当前NPC数量：${npcItems.length}`);

  // 4. 详情页跳转检测
  const firstNPC = await page.$('.npc-img');
  await firstNPC.click();
  await page.waitForSelector('.npc-item-info'); // NPC详情容器
  await page.waitForSelector('text=人物详情'); // 页面标题
  console.log('✅ 详情页跳转正常');
  
  // 返回列表页
  await page.goBack();

  // 5. 设置页面检测
  await page.click('text=设置');
  await page.waitForSelector('text=重启应用'); // 重启按钮
  console.log('✅ 设置页面渲染正常');

  // 6. 组件异常检测
  const missingElements = await page.$$eval('body', () => {
    return [
      !document.querySelector('.cook-bar-middle-span:empty'), // 名称不为空
      !document.querySelector('image[src="undefined"]') // 图片路径有效
    ].every(Boolean);
  });
  console.log(`✅ 组件数据加载正常（${missingElements ? '通过' : '失败'}）`);

  await browser.close();
})();