import { expect, test } from '@playwright/test';

test('selected fonts load from the app and display headings keep their real weight', async ({ page, baseURL }) => {
  const fontRequests: string[] = [];
  page.on('request', request => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ({
    titleWeight: getComputedStyle(document.querySelector('h1')!).fontWeight,
    loaded: [...document.fonts].filter(font => font.status === 'loaded').map(font => `${font.family}:${font.weight}`),
  }));
  expect(fonts.loaded).toContain('ssurroundAir:300');
  for (const weight of [400, 500, 600, 700]) expect(fonts.loaded).toContain(`pretendard:${weight}`);
  expect(fonts.titleWeight).toBe('300');
  expect(fontRequests.length).toBeGreaterThanOrEqual(5);
  expect(fontRequests.every(url => new URL(url).origin === new URL(baseURL!).origin)).toBe(true);
  await expect(page.getByRole('link', { name: '내 운명록 찾아보기' })).toBeInViewport();
});

test('font failure and enlarged text preserve product selection and input', async ({ page }) => {
  await page.route('**/*.woff2', route => route.abort());
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const catalog = page.getByRole('link', { name: '애정운 상품 보기' });
  await expect(catalog).toBeVisible();
  const widths = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  await catalog.click();
  await expect(page.getByRole('heading', { name: '애정운', exact: true })).toBeVisible();
  await page.getByRole('link', { name: '애정운 무료 샘플 시작하기' }).click();
  await expect(page.getByLabel('생년월일', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: '무료 샘플 운명록 펼치기' })).toBeVisible();
});
