# Store Catalog Integration

The catalog prepared from `F:\d\asset-factory` is intended to live in a single external bucket.

Configure the storefront with:

- `VITE_ASSET_BASE_URL=https://<bucket-or-cdn>/catalog`

Expected bucket layout:

- `<base>/products-index.json`
- `<base>/<slug>/<slug>.json`
- `<base>/<slug>/<slug>.glb`
- `<base>/<slug>/jpg/*.jpg`

Use the helper in `src/lib/store-catalog.ts`:

- `fetchStoreCatalogIndex()`
- `fetchStoreCatalogProduct(slug)`
- `getStoreCatalogAssetUrl(slug, relativePath)`

Example:

```ts
import {
  fetchStoreCatalogIndex,
  getStoreCatalogAssetUrl,
} from "@/lib/store-catalog";

const catalog = await fetchStoreCatalogIndex();
const firstProduct = catalog.products[0];
const coverImage = firstProduct.images.primary
  ? getStoreCatalogAssetUrl(firstProduct.slug, firstProduct.images.primary)
  : null;
```

Notes:

- The storefront should treat the bucket as the single source of truth for catalog assets.
- Keep heavy catalog files out of GitHub and sync them to the bucket from your local asset pipeline.
- `upload-manifest.json` can still be used later as the source manifest for upload automation.
- Catalog file and folder names should remain lowercase and use `-` instead of spaces. You can verify this locally with `npm run catalog:names`.
