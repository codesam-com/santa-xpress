import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { config } from "./config";
import { HomePage } from "./pages/home.page";
import { ResultsPage } from "./pages/results.page";
import { ProductPage } from "./pages/product.page";
import { log } from "./utils/logger";

async function ensureDirs() {
  fs.mkdirSync("artifacts", { recursive: true });
}

function decodeStorageStateIfPresent(): string | undefined {
  if (!config.stateJsonB64) return undefined;

  const content = Buffer.from(config.stateJsonB64, "base64").toString("utf8");
  const statePath = path.join("artifacts", "state.json");
  fs.writeFileSync(statePath, content, "utf8");
  return statePath;
}

async function snap(page: import("playwright").Page, name: string) {
  try {
    await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
  } catch (error) {
    log.warn(`No se pudo guardar screenshot ${name}: ${String(error)}`);
  }
}

async function main() {
  await ensureDirs();
  const storageStatePath = decodeStorageStateIfPresent();

  const browser = await chromium.launch({
    headless: config.headless,
    slowMo: 150
  });

  const context = await browser.newContext({
    storageState: storageStatePath
  });

  const page = await context.newPage();
  page.setDefaultTimeout(25000);

  try {
    const home = new HomePage(page);
    const results = new ResultsPage(page);
    const product = new ProductPage(page);

    log.info("Abriendo AliExpress...");
    await home.open(config.baseUrl);
    await home.acceptCookiesIfVisible();
    await snap(page, "01-home");

    log.info(`Buscando: ${config.searchTerm}`);
    await home.search(config.searchTerm);
    await results.waitForResults();
    await snap(page, "02-results");

    log.info(`Abriendo resultado #${config.productIndex}`);
    await results.openResultByIndex(config.productIndex);
    await snap(page, "03-product");

    log.info("Seleccionando variante si aplica...");
    await product.chooseVariantIfNeeded();
    await snap(page, "04-variant");

    log.info("Añadiendo a la cesta...");
    await product.addToCart();
    await snap(page, "05-cart-action");

    log.info("OK: intento de añadir producto a la cesta completado");
  } catch (error) {
    await snap(page, "error");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
