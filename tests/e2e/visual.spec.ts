import { expect, test } from "@playwright/test";

for (const route of ["/", "/pacientes", "/agenda", "/plano-alimentar", "/fotografias", "/relatorios"]) {
  test(`visual sem overflow em ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasHorizontalOverflow).toBeFalsy();
    await page.screenshot({ path: testInfo.outputPath(`${route === "/" ? "inicio" : route.slice(1)}.png`), fullPage: true });
  });
}