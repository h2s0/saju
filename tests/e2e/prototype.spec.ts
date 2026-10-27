import { expect, test, type Page } from "@playwright/test";

const sessionKey = "cheonmyeongrok-demo-v1";
const birthDate = "1993-07-19";
const birthTime = "04:37";

async function capture(page: Page, path: string) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path, fullPage: true, animations: "disabled" });
}

async function fillBirthForm(page: Page, unknown = false) {
  await page.goto("/reading/new");
  await page.getByLabel("생년월일", { exact: false }).fill(birthDate);
  if (unknown) await page.getByLabel("태어난 시간을 몰라요").check();
  else await page.getByLabel("태어난 시각", { exact: true }).fill(birthTime);
}

async function openPreview(page: Page, unknown = false) {
  await fillBirthForm(page, unknown);
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page).toHaveURL(`/reading/preview/sample-${unknown ? "unknown" : "known"}`);
  await expect(page.getByText("개발용 샘플 · 실제 사주 계산 아님", { exact: true })).toBeVisible();
}

async function purchase(page: Page, unknown = false) {
  await page.getByRole("link", { name: "상세 샘플 체험하기" }).click();
  await expect(page).toHaveURL(`/checkout/sample-${unknown ? "unknown" : "known"}`);
  await page.getByLabel("실제 결제가 없는 모의 구매임을 확인했어요").check();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page).toHaveURL(`/readings/sample-${unknown ? "unknown" : "known"}`);
}

async function seedCompletedSample(page: Page) {
  await page.addInitScript(({ key }) => {
    sessionStorage.setItem(key, JSON.stringify({
      visited: ["sample-known"], purchased: location.pathname.startsWith("/checkout/") ? [] : ["sample-known"],
    }));
  }, { key: sessionKey });
}

async function expectNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    main: document.querySelector("main")!.getBoundingClientRect().width,
  }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
  expect(sizes.main).toBeLessThanOrEqual(430);
}

test("known-time journey purchases once, restores the library and resets only demo data", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await openPreview(page);
  await purchase(page);
  await expect(page.getByRole("heading", { name: "기질 · 나만의 속도를 알아가기" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "기질 · 나만의 속도를 알아가기" })).toBeVisible();
  await page.goto("/library");
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(1);
  await page.getByRole("link", { name: "기록 읽기" }).click();
  await expect(page).toHaveURL("/readings/sample-known");
  await page.goto("/reading/preview/sample-known");
  await expect(page.getByRole("link", { name: "보관된 상세 기록 읽기" })).toBeVisible();
  await expect(page.getByRole("link", { name: "상세 샘플 체험하기" })).toHaveCount(0);
  await page.evaluate(() => sessionStorage.setItem("unrelated-demo", "keep"));
  await page.goto("/library");
  await page.getByRole("button", { name: "체험 기록 초기화", exact: true }).click();
  await page.getByRole("button", { name: "유지하기" }).click();
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(1);
  await page.getByRole("button", { name: "체험 기록 초기화", exact: true }).click();
  await page.getByRole("button", { name: "초기화하기", exact: true }).click();
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(0);
  expect(await page.evaluate((key) => sessionStorage.getItem(key), sessionKey)).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem("unrelated-demo"))).toBe("keep");
  await page.goto("/readings/sample-known");
  await expect(page.getByRole("heading", { name: "아직 모의 구매하지 않은 기록이에요" })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("unknown birth time omits the hour pillar and supports the same purchase flow", async ({ page }) => {
  await openPreview(page, true);
  await expect(page.getByText("시간 모름: 시주와 시간에 의존한 설명은 제외했어요.", { exact: false })).toBeVisible();
  const hourPillar = page.locator("section").filter({ has: page.getByRole("heading", { name: "샘플 명식" }) }).locator("div").filter({ has: page.locator("span", { hasText: /^시주$/ }) });
  await expect(hourPillar.last()).toContainText("—");
  await purchase(page, true);
  await page.goto("/library");
  await expect(page.getByRole("link", { name: "기록 읽기" })).toHaveCount(1);
});

test("invalid solar dates focus the error, lunar range validation remains explicit", async ({ page }) => {
  await fillBirthForm(page);
  const date = page.getByLabel("생년월일", { exact: false });
  await date.fill("2023-02-29");
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(date).toBeFocused();
  await expect(date).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("main").getByRole("alert")).toContainText("실제로 존재하는 양력 날짜");
  await page.getByRole("radio", { name: "음력", exact: true }).check();
  await expect(page.getByText("음력은 형식과 날짜 범위만 확인해요.", { exact: false })).toBeVisible();
  await page.getByLabel("윤달에 태어났어요").check();
  await date.fill("2001-02-31");
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("30일까지");
  await date.fill("2001-02-30");
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page).toHaveURL("/reading/preview/sample-known");
});

test("missing time can be corrected by selecting unknown without retaining the input on reload", async ({ page }) => {
  await page.goto("/reading/new");
  await page.getByLabel("생년월일", { exact: false }).fill(birthDate);
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page.getByLabel("태어난 시각", { exact: true })).toBeFocused();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("모름을 선택");
  await page.getByLabel("태어난 시간을 몰라요").check();
  await expect(page.getByLabel("태어난 시각", { exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.getByLabel("생년월일", { exact: false })).toHaveValue("");
  await expect(page.getByLabel("태어난 시각", { exact: true })).toHaveValue("");
});

test("failure can retry and slow processing survives a reload without raw input", async ({ page }) => {
  await fillBirthForm(page);
  await page.getByText("개발용 시나리오", { exact: true }).click();
  await page.getByLabel("처리 상태 재현").selectOption("failure");
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("개발용 생성 실패");
  await page.getByRole("button", { name: "다시 시도하기" }).click();
  await expect(page).toHaveURL("/reading/preview/sample-known");
  await fillBirthForm(page, true);
  await page.getByText("개발용 시나리오", { exact: true }).click();
  await page.getByLabel("처리 상태 재현").selectOption("slow");
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page).toHaveURL("/reading/processing/sample-unknown?scenario=slow");
  await page.reload();
  await expect(page.getByRole("heading", { name: "첫 장을 준비하고 있어요" })).toBeVisible();
  await expect(page).toHaveURL("/reading/preview/sample-unknown", { timeout: 10_000 });
});

test("mock checkout requires confirmation and cancellation grants no purchase", async ({ page }) => {
  await openPreview(page);
  await page.getByRole("link", { name: "상세 샘플 체험하기" }).click();
  await expect(page.getByRole("button", { name: "0원으로 모의 구매하기" })).toBeDisabled();
  await page.getByLabel("실제 결제가 없는 모의 구매임을 확인했어요").check();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page.getByRole("button", { name: "모의 구매를 처리하고 있어요" })).toBeDisabled();
  await page.getByRole("button", { name: "모의 구매 취소" }).click();
  await expect(page.getByRole("button", { name: "다시 체험하기" })).toBeVisible();
  // The cancelled timer would grant a purchase after 700ms if it were still active.
  await page.waitForTimeout(850);
  await expect(page).toHaveURL("/checkout/sample-known");
  const data = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), sessionKey);
  expect(data.purchased).toEqual([]);
  await page.getByRole("button", { name: "다시 체험하기" }).click();
  await page.getByLabel("실제 결제가 없는 모의 구매임을 확인했어요").check();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page).toHaveURL("/readings/sample-known");
});

test("birth values never reach storage, cookies, URLs, requests, or console", async ({ page, context }) => {
  const emitted: string[] = [];
  page.on("request", (request) => emitted.push(request.url(), request.postData() ?? ""));
  page.on("console", (message) => emitted.push(message.text()));
  await openPreview(page);
  await purchase(page);
  const storage = await page.evaluate(() => ({
    session: Object.fromEntries(Object.entries(sessionStorage)),
    local: Object.fromEntries(Object.entries(localStorage)),
  }));
  const captured = JSON.stringify({ storage, cookies: await context.cookies(), url: page.url(), emitted });
  expect(captured).not.toContain(birthDate);
  expect(captured).not.toContain(birthTime);
  expect(captured).not.toContain(encodeURIComponent(birthTime));
  expect(Object.keys(JSON.parse(storage.session[sessionKey])).sort()).toEqual(["purchased", "visited"]);
});

test("mock purchase failure grants no access and can retry after correction", async ({ page }) => {
  await openPreview(page);
  await page.getByRole("link", { name: "상세 샘플 체험하기" }).click();
  await page.getByLabel("실제 결제가 없는 모의 구매임을 확인했어요").check();
  await page.getByText("개발용 구매 시나리오", { exact: true }).click();
  await page.getByLabel("모의 구매 실패 재현").check();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("모의 구매 실패를 재현했어요");
  expect(await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!).purchased, sessionKey)).toEqual([]);
  await page.getByLabel("모의 구매 실패 재현").uncheck();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page).toHaveURL("/readings/sample-known");
});

test("direct protected and invalid sample routes are safe", async ({ page }) => {
  await page.goto("/readings/sample-known");
  await expect(page.getByRole("heading", { name: "아직 모의 구매하지 않은 기록이에요" })).toBeVisible();
  await page.goto("/reading/preview/sample-known");
  await expect(page.getByRole("heading", { name: "아직 펼치지 않은 기록이에요" })).toBeVisible();
  for (const path of ["/reading/preview/not-a-sample", "/readings/not-a-sample", "/checkout/not-a-sample"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "이 기록은 찾을 수 없어요" })).toBeVisible();
  }
});

test("denied session storage falls back to memory for the current journey", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      get() { throw new DOMException("Storage denied", "SecurityError"); },
    });
  });
  await fillBirthForm(page);
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page.getByText("브라우저 저장소를 사용할 수 없어", { exact: false })).toBeVisible();
  await expect(page).toHaveURL("/reading/preview/sample-known");
  await purchase(page);
  await expect(page.getByRole("heading", { name: "기질 · 나만의 속도를 알아가기" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "아직 모의 구매하지 않은 기록이에요" })).toBeVisible();
});

test("keyboard skip link and reduced-motion navigation remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문으로 건너뛰기" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "내 운명록 찾아보기" }).click();
  await expect(page.getByLabel("생년월일", { exact: false })).toBeVisible();
});

for (const width of [320, 360, 375, 390, 414, 430, 1280]) {
  test(`mobile canvas stays within bounds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await seedCompletedSample(page);
    for (const path of ["/", "/reading/new", "/reading/preview/sample-known", "/checkout/sample-known", "/readings/sample-known", "/library", "/today"]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toBeVisible();
      await expectNoOverflow(page);
    }
  });
}

test("captures rendered evidence for the complete mobile journey", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("img", { name: "붓을 들고 반갑게 웃는 견습 신선 운몽이" }).waitFor();
  await capture(page, "/tmp/saju-home-390.png");
  await fillBirthForm(page);
  await capture(page, "/tmp/saju-form-390.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await capture(page, "/tmp/saju-form-320.png");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "무료 샘플 운명록 펼치기" }).click();
  await expect(page).toHaveURL("/reading/preview/sample-known");
  await capture(page, "/tmp/saju-preview-390.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await capture(page, "/tmp/saju-preview-320.png");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "상세 샘플 체험하기" }).click();
  await expect(page.getByRole("heading", { name: "다음 장도 펼쳐볼까요?" })).toBeVisible();
  await capture(page, "/tmp/saju-checkout-390.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await capture(page, "/tmp/saju-checkout-320.png");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("실제 결제가 없는 모의 구매임을 확인했어요").check();
  await page.getByRole("button", { name: "0원으로 모의 구매하기" }).click();
  await expect(page).toHaveURL("/readings/sample-known");
  await expect(page.getByRole("heading", { name: "기질 · 나만의 속도를 알아가기" })).toBeVisible();
  await capture(page, "/tmp/saju-reading-390.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await capture(page, "/tmp/saju-reading-320.png");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/library");
  await expect(page.getByRole("link", { name: "기록 읽기" })).toBeVisible();
  await capture(page, "/tmp/saju-library-390.png");
  await page.setViewportSize({ width: 320, height: 844 });
  await capture(page, "/tmp/saju-library-320.png");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const width of [320, 430, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await capture(page, `/tmp/saju-home-${width}.png`);
  }
});
