import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const fallbackBaseUrl = "https://laban-alasfour.s3.amazonaws.com/catalog";
const baseUrl = (process.env.VITE_ASSET_BASE_URL || process.argv[2] || fallbackBaseUrl).replace(/\/+$/, "");
const tsOutputPath = path.resolve("src/generated/catalog-links.ts");
const jsonOutputPath = path.resolve("public/catalog-asset-links.json");

function toAssetUrl(slug, relativePath) {
  if (!relativePath) {
    return null;
  }

  return `${baseUrl}/${slug}/${String(relativePath).replace(/^\/+/, "")}`;
}

function toEntry(product) {
  const gallery = Array.isArray(product.images?.gallery)
    ? product.images.gallery.map((item) => toAssetUrl(product.slug, item)).filter(Boolean)
    : [];

  const colors = Object.fromEntries(
    Object.entries(product.images?.colors || {})
      .map(([key, value]) => [key, toAssetUrl(product.slug, value)])
      .filter(([, value]) => Boolean(value)),
  );

  return {
    title: product.title || product.slug,
    productUrl: `${baseUrl}/${product.slug}/${product.slug}.json`,
    primaryImageUrl: toAssetUrl(product.slug, product.images?.primary),
    galleryImageUrls: gallery,
    colorImageUrls: colors,
    modelUrl: toAssetUrl(product.slug, product.glb),
  };
}

async function main() {
  const response = await fetch(`${baseUrl}/products-index.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch catalog index: ${response.status} ${response.statusText}`);
  }

  const catalog = await response.json();
  const entries = Object.fromEntries(
    (catalog.products || []).map((product) => [product.slug, toEntry(product)]),
  );
  const allAssetUrls = Array.from(
    new Set(
      Object.values(entries).flatMap((entry) => [
        entry.productUrl,
        entry.primaryImageUrl,
        entry.modelUrl,
        ...entry.galleryImageUrls,
        ...Object.values(entry.colorImageUrls),
      ].filter(Boolean)),
    ),
  );

  const tsFileContent = `export type CatalogLinkEntry = {
  title: string;
  productUrl: string;
  primaryImageUrl: string | null;
  galleryImageUrls: string[];
  colorImageUrls: Record<string, string>;
  modelUrl: string | null;
};

export const catalogLinks: Record<string, CatalogLinkEntry> = ${JSON.stringify(entries, null, 2)};
`;
  const jsonFileContent = JSON.stringify({
    generatedAt: new Date().toISOString(),
    baseUrl,
    productCount: Object.keys(entries).length,
    assetCount: allAssetUrls.length,
    allAssetUrls,
    assetsBySlug: entries,
  }, null, 2);

  await mkdir(path.dirname(tsOutputPath), { recursive: true });
  await mkdir(path.dirname(jsonOutputPath), { recursive: true });
  await writeFile(tsOutputPath, tsFileContent, "utf8");
  await writeFile(jsonOutputPath, jsonFileContent, "utf8");

  console.log(`Generated ${Object.keys(entries).length} catalog link entries at ${tsOutputPath}`);
  console.log(`Generated ${allAssetUrls.length} asset URLs at ${jsonOutputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
