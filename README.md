# santa-xpress

Automatización con Playwright y TypeScript para abrir AliExpress España, buscar un producto y añadirlo a la cesta, ejecutándose directamente desde GitHub Actions.

## Qué hace

- abre `https://es.aliexpress.com/`
- busca un producto
- abre un resultado por índice
- intenta seleccionar la primera variante disponible
- intenta pulsar **Añadir a la cesta**
- guarda capturas y logs como artifacts en GitHub Actions

## Uso desde GitHub

1. Sube este repo a `codesam-com/santa-xpress`.
2. Abre la pestaña **Actions**.
3. Selecciona **Add product to AliExpress cart**.
4. Pulsa **Run workflow**.
5. Rellena los inputs del formulario.
6. Al terminar, descarga los artifacts para revisar capturas y trazas.

## Secret opcional

Puedes guardar una sesión autenticada de Playwright como secret:

- `ALIEXPRESS_STATE_JSON_B64`

Ese valor debe ser un `storageState` de Playwright codificado en base64. Si la sesión caduca o AliExpress pide challenge/captcha, la ejecución puede fallar.

## Variables del workflow

- `search_term`: texto a buscar
- `product_index`: índice del resultado a abrir
- `base_url`: URL base de AliExpress
- `headless`: `true` o `false`

## Desarrollo del flujo

El workflow:

1. instala dependencias
2. instala Chromium para Playwright
3. ejecuta `npm run run:web`
4. sube a artifacts las capturas y trazas

## Limitaciones

- AliExpress cambia el DOM con frecuencia
- puede exigir login, challenge o captcha
- una sesión guardada puede dejar de valer
- no incluye bypass de captcha

## Estructura

```text
.github/workflows/aliexpress-cart.yml
src/config.ts
src/run.ts
src/pages/home.page.ts
src/pages/results.page.ts
src/pages/product.page.ts
src/utils/logger.ts
src/utils/safe-actions.ts
```
