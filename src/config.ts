import "dotenv/config";

export const config = {
  baseUrl: process.env.ALIEXPRESS_BASE_URL || "https://es.aliexpress.com/",
  searchTerm: process.env.SEARCH_TERM || "auriculares bluetooth",
  productIndex: Number(process.env.PRODUCT_INDEX || 0),
  headless: process.env.HEADLESS !== "false",
  stateJsonB64: process.env.STATE_JSON_B64 || ""
};
