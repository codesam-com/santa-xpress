import { Locator } from "playwright";

export async function clickFirstVisible(locators: Locator[], timeout = 2500) {
  for (const locator of locators) {
    try {
      const first = locator.first();
      await first.waitFor({ state: "visible", timeout });
      await first.click();
      return true;
    } catch {}
  }
  return false;
}
