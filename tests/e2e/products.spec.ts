import { expect, test, type Locator, type Page } from "@playwright/test";
import { PRODUCTS, getProduct, type ProductId } from "../../src/features/products/catalog";

const sessionKey = "cheonmyeongrok-demo-v1";
const firstBirth = { date: "1992-08-17", time: "05:43" };
const secondBirth = { date: "1996-11-23", time: "19:26" };
const flowLabels = ["정비할 때", "살펴볼 때", "준비할 때", "넓혀볼 때", "적극 활용할 때"];

function sampleId(product: ProductId, unknown = false, partnerUnknown = false) {
  const time = unknown ? "unknown" : "known";
  if (product === "basic") return `sample-${time}`;
  if (product === "compatibility") return `sample-compatibility-${time}-${partnerUnknown ? "unknown" : "known"}`;
  return `sample-${product}-${time}`;
}

async function fillPerson(scope: Page | Locator, person = firstBirth, unknown = false) {
  await scope.getByLabel("생년월일", { exact: false }).fill(person.date);
  if (unknown) await scope.getByLabel("태어난 시간을 몰라요").check();
  else await scope.getByLabel("태어난 시각", { exact: true }).fill(person.time);
}

async function fillProduct(page: Page, product: ProductId, unknown = false, partnerUnknown = false) {
  await page.goto(`/reading/new?product=${product}`);
  if (product === "compatibility") {
    await fillPerson(page.getByRole("group", { name: "나의 출생정보", exact: true }), firstBirth, unknown);
    await fillPerson(page.getByRole("group", { name: "상대방의 출생정보", exact: true }), secondBirth, partnerUnknown);
    await page.getByLabel("상대방에게 정보 입력 동의를 받았어요").check();
  } else await fillPerson(page, firstBirth, unknown);
}

async function submitPreview(page: Page, product: ProductId, unknown = false, partnerUnknown = false) {
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page).toHaveURL(`/reading/preview/${sampleId(product, unknown, partnerUnknown)}`);
  const gauge = page.getByRole("figure", { name: `${getProduct(product).title} 흐름 요약` });
  await expect(gauge).toBeVisible();
  return gauge;
}

async function buy(page: Page, product: ProductId, unknown = false, partnerUnknown = false) {
  await page.getByRole("link", { name: "상세 샘플 체험하기" }).click();
  await expect(page).toHaveURL(`/checkout/${sampleId(product, unknown, partnerUnknown)}`);
  await expect(page.getByRole("button", { name: "0원으로 모의 구매하기" })).toBeDisabled();
  await page.getByLabel("실제 결제가 없는 모의 구매임을 확인했어요").check();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page).toHaveURL(`/readings/${sampleId(product, unknown, partnerUnknown)}`);
}

async function noOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    canvas: document.querySelector("main")!.getBoundingClientRect().width,
  }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.canvas).toBeLessThanOrEqual(430);
}

async function capture(page: Page, path: string) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.screenshot({ path, fullPage: true, animations: "disabled" });
}

for (const product of PRODUCTS) {
  test(`${product.id} has an independent catalog, preview, gauge and detailed report`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.goto("/");
    await page.getByRole("link", { name: `${product.title} 상품 보기`, exact: true }).click();
    await expect(page).toHaveURL(`/products/${product.id}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(product.title);
    if (product.price === null) await expect(page.getByText("가격 미정", { exact: false })).toBeVisible();
    await page.getByRole("link", { name: `${product.title} 무료 샘플 시작하기`, exact: true }).click();
    await expect(page).toHaveURL(`/reading/new?product=${product.id}`);
    if (product.id === "compatibility") {
      await fillPerson(page.getByRole("group", { name: "나의 출생정보", exact: true }));
      await fillPerson(page.getByRole("group", { name: "상대방의 출생정보", exact: true }), secondBirth);
      await page.getByLabel("상대방에게 정보 입력 동의를 받았어요").check();
    } else await fillPerson(page);
    const previewGauge = await submitPreview(page, product.id);
    const summary = await previewGauge.innerText();
    const legend = previewGauge.getByRole("list", { name: "흐름의 다섯 단계" });
    await expect(legend.getByRole("listitem")).toHaveCount(5);
    for (const label of flowLabels) await expect(legend.getByText(label, { exact: false })).toBeVisible();
    const currentStep = legend.locator('[aria-current="step"]');
    await expect(currentStep).toHaveCount(1);
    const currentText = await currentStep.innerText();
    const currentLabel = flowLabels.find((label) => currentText.includes(label));
    expect(currentLabel).toBeDefined();
    await expect(previewGauge.getByRole("img")).toHaveAccessibleName(`${currentLabel} · 5단계 중 ${flowLabels.indexOf(currentLabel!) + 1}단계`);
    expect(summary).not.toMatch(/\d+\s*(점|%)/);
    await buy(page, product.id);
    const detailGauge = page.getByRole("figure", { name: `${product.title} 흐름 요약` });
    await expect(detailGauge).toHaveText(summary, { useInnerText: true });
    for (const title of product.sectionTitles) {
      await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    }
    if (product.periodLabel) await expect(page.getByText(product.periodLabel, { exact: false }).first()).toBeVisible();
    await page.goto(`/reading/preview/${sampleId(product.id)}`);
    await expect(page.getByRole("link", { name: "보관된 상세 기록 읽기" })).toBeVisible();
    await expect(page.getByRole("link", { name: "상세 샘플 체험하기" })).toHaveCount(0);
    expect(runtimeErrors).toEqual([]);
  });
}

test("seven purchases stay separate and restore together without changing legacy basic records", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page.evaluate((key) => sessionStorage.setItem(key, JSON.stringify({ visited: ["sample-known"], purchased: ["sample-known"] })), sessionKey);
  await page.reload();
  await page.goto("/library");
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(1);
  for (const product of PRODUCTS.filter((item) => item.id !== "basic")) {
    await fillProduct(page, product.id);
    await submitPreview(page, product.id);
    await buy(page, product.id);
  }
  await page.goto("/library");
  await page.reload();
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(7);
  for (const product of PRODUCTS) await expect(page.getByRole("heading", { name: product.title, exact: false })).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), sessionKey);
  expect(stored.purchased).toHaveLength(7);
  expect(new Set(stored.purchased).size).toBe(7);
  expect(stored.purchased).toContain("sample-known");
  await page.getByRole("button", { name: "체험 기록 초기화", exact: true }).click();
  await page.getByRole("button", { name: "초기화하기", exact: true }).click();
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(0);
});

for (const unknown of [false, true]) {
  for (const partnerUnknown of [false, true]) {
    test(`compatibility keeps both time choices independent (${unknown}/${partnerUnknown})`, async ({ page }) => {
      await fillProduct(page, "compatibility", unknown, partnerUnknown);
      await submitPreview(page, "compatibility", unknown, partnerUnknown);
      await buy(page, "compatibility", unknown, partnerUnknown);
      const stored = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), sessionKey);
      expect(stored.purchased).toEqual([sampleId("compatibility", unknown, partnerUnknown)]);
      await page.reload();
      await expect(page.getByRole("figure", { name: "궁합 흐름 요약" })).toBeVisible();
    });
  }
}

test("compatibility requires partner consent and validates the second person's input", async ({ page }) => {
  await page.goto("/reading/new?product=compatibility");
  await fillPerson(page.getByRole("group", { name: "나의 출생정보", exact: true }));
  const partner = page.getByRole("group", { name: "상대방의 출생정보", exact: true });
  await fillPerson(partner, secondBirth);
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page).toHaveURL("/reading/new?product=compatibility");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("동의");
  await page.getByLabel("상대방에게 정보 입력 동의를 받았어요").check();
  await partner.getByLabel("생년월일", { exact: false }).fill("2023-02-29");
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(partner.getByLabel("생년월일", { exact: false })).toBeFocused();
  await expect(partner.getByRole("alert")).toContainText("실제로 존재하는 양력 날짜");
  await partner.getByLabel("생년월일", { exact: false }).fill(secondBirth.date);
  await submitPreview(page, "compatibility");
});

test("both people's raw birth values never reach storage, requests, cookies, URL or console", async ({ page, context }) => {
  const emitted: string[] = [];
  page.on("request", (request) => emitted.push(request.url(), request.postData() ?? ""));
  page.on("console", (message) => emitted.push(message.text()));
  await fillProduct(page, "compatibility");
  await submitPreview(page, "compatibility");
  await buy(page, "compatibility");
  const storage = await page.evaluate(() => ({ session: Object.fromEntries(Object.entries(sessionStorage)), local: Object.fromEntries(Object.entries(localStorage)) }));
  const captured = JSON.stringify({ emitted, storage, cookies: await context.cookies(), url: page.url() });
  for (const value of [firstBirth.date, firstBirth.time, secondBirth.date, secondBirth.time]) {
    expect(captured).not.toContain(value);
    expect(captured).not.toContain(encodeURIComponent(value));
  }
  expect(Object.keys(JSON.parse(storage.session[sessionKey])).sort()).toEqual(["purchased", "visited"]);
});

test("an unrelated product purchase cannot unlock another result", async ({ page }) => {
  await fillProduct(page, "love");
  await submitPreview(page, "love");
  await buy(page, "love");
  await fillProduct(page, "career");
  await submitPreview(page, "career");
  await page.goto("/readings/sample-career-known");
  await expect(page.getByRole("heading", { name: "아직 모의 구매하지 않은 기록이에요" })).toBeVisible();
  await page.goto("/reading/preview/sample-career-known");
  await expect(page.getByRole("link", { name: "상세 샘플 체험하기" })).toBeVisible();
});

test("a purchased product reopens its existing result across different time variants", async ({ page }) => {
  await fillProduct(page, "love");
  await submitPreview(page, "love");
  await buy(page, "love");
  await page.goto("/products/love");
  const existingResult = page.locator('a[href="/readings/sample-love-known"]').first();
  await expect(existingResult).toBeVisible();
  await existingResult.click();
  await expect(page).toHaveURL("/readings/sample-love-known");
  await page.goto("/checkout/sample-love-unknown");
  await expect(page.getByRole("button", { name: "0원으로 모의 구매하기" })).toHaveCount(0);
  await expect(page.locator('a[href="/readings/sample-love-known"]').first()).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), sessionKey);
  expect(stored.purchased).toEqual(["sample-love-known"]);
  await page.goto("/library");
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(1);
});

for (const width of [320, 360, 375, 390, 414, 430, 1280]) {
  test(`product selection, pair input and every gauge fit the mobile canvas at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (const product of PRODUCTS) await expect(page.getByRole("link", { name: `${product.title} 상품 보기`, exact: true })).toBeVisible();
    await noOverflow(page);
    await fillProduct(page, "compatibility", true, true);
    await noOverflow(page);
    await page.evaluate(({ key, ids }) => sessionStorage.setItem(key, JSON.stringify({ visited: ids, purchased: ids })), { key: sessionKey, ids: PRODUCTS.map((product) => sampleId(product.id)) });
    for (const product of PRODUCTS) {
      await page.goto(`/readings/${sampleId(product.id)}`);
      await expect(page.getByRole("figure", { name: `${product.title} 흐름 요약` })).toBeVisible();
      await noOverflow(page);
    }
  });
}

test("captures catalog, pair input and categorical gauge with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await capture(page, "/tmp/saju-products-home390.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await fillProduct(page, "compatibility", false, true);
  await capture(page, "/tmp/saju-compatibility320.png");
  await submitPreview(page, "compatibility", false, true);
  await capture(page, "/tmp/saju-compatibility-preview320.png");
  await fillProduct(page, "love");
  await submitPreview(page, "love");
  await capture(page, "/tmp/saju-love320.png");
  await buy(page, "love");
  await capture(page, "/tmp/saju-love-detail320.png");
});
