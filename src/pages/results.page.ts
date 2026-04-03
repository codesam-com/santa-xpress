import { Page } from "playwright";

export class ResultsPage {
  constructor(private page: Page) {}

  async waitForResults() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
  }

  async openResultByIndex(index: number) {
    const candidates = [
      this.page.locator('a[href*="/item/"]'),
      this.page.locator("a").filter({ hasText: /€|\$/ })
    ];

    for (const locator of candidates) {
      const count = await locator.count();
      if (count > index) {
        const href = await locator.nth(index).getAttribute("href");
        if (!href) continue;

        const url = href.startsWith("http") ? href : `https:${href}`;
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
        return;
      }
    }

    throw new Error(`No se pudo abrir el resultado ${index}.`);
  }
}
