const { chromium } = require('playwright');

describe('npc页面渲染检查', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(3000); // 等待页面初始化
  });

  afterAll(async () => {
    await browser.close();
  });

  it('页面容器应正常渲染', async () => {
    // 检查最外层容器
    const container = await page.$('.npc');
    expect(container).toBeTruthy();

    // 检查标签过滤区域是否存在
    const tagFilter = await page.$('.tag-filter');
    expect(tagFilter).toBeTruthy();

    // 检查NPC展示区域是否存在
    const npcArea = await page.$('.npc-area');
    expect(npcArea).toBeTruthy();
  });
});
