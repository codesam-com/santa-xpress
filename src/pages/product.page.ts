import { Page } from "playwright";
import { clickFirstVisible } from "../utils/safe-actions";

export class ProductPage {
  constructor(private page: Page) {}

  async chooseVariantIfNeeded() {
    await clickFirstVisible(
      [
        this.page.locator('button[title]'),
        this.page.locator('[role="button"][title]'),
        this.page.locator("img[alt]").locator("..")
      ],
      1500
    );
  }

  async addToCart() {
    const clicked = await clickFirstVisible(
      [
        this.page.getByRole("button", { name: /añadir a la cesta|add to cart|agregar al carrito/i }),
        this.page.locator("button").filter({ hasText: /añadir a la cesta|add to cart|agregar al carrito/i }),
        this.page.locator('[role="button"]').filter({ hasText: /añadir a la cesta|add to cart|agregar al carrito/i })
      ],
      3000
    );

    if (!clicked) {
      throw new Error("No se encontró el botón de añadir a la cesta.");
    }
  }
}
