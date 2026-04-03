import { Page } from "playwright";
import { clickFirstVisible } from "../utils/safe-actions";

export class HomePage {
  constructor(private page: Page) {}

  async open(url: string) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async acceptCookiesIfVisible() {
    await clickFirstVisible([
      this.page.getByRole("button", { name: /aceptar|accept|allow/i }),
      this.page.locator("button").filter({ hasText: /aceptar|accept|allow/i })
    ]);
  }

  async search(term: string) {
    const candidates = [
      this.page.locator('input[type="search"]').first(),
      this.page.locator('input[name*="search"]').first(),
      this.page.locator('input[placeholder*="Buscar"], input[placeholder*="search"]').first()
    ];

    for (const input of candidates) {
      try {
        await input.waitFor({ state: "visible", timeout: 3000 });
        await input.fill(term);
        await input.press("Enter");
        return;
      } catch {}
    }

    throw new Error("No se encontró el buscador.");
  }
}
