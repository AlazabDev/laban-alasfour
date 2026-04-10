import { env } from "@/lib/env";

export type StoreCatalogImageMap = {
  primary: string | null;
  gallery: string[];
  colors: Record<string, string>;
};

export type StoreCatalogProduct = {
  slug: string;
  title: string;
  category_path: string[];
  glb: string | null;
  images: StoreCatalogImageMap;
  storage_prefix: string;
  manifest_path: string;
};

export type StoreCatalogIndex = {
  product_count: number;
  products: StoreCatalogProduct[];
};

function getCatalogBaseUrl(): string {
  return env.assetBaseUrl.replace(/\/+$/, "");
}

export async function fetchStoreCatalogIndex(): Promise<StoreCatalogIndex> {
  const response = await fetch(`${getCatalogBaseUrl()}/products-index.json`);
  if (!response.ok) {
    throw new Error(`Failed to load catalog index: ${response.status}`);
  }
  return (await response.json()) as StoreCatalogIndex;
}

export async function fetchStoreCatalogProduct(slug: string): Promise<StoreCatalogProduct> {
  const response = await fetch(`${getCatalogBaseUrl()}/${slug}/${slug}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load catalog product ${slug}: ${response.status}`);
  }
  return (await response.json()) as StoreCatalogProduct;
}

export function getStoreCatalogAssetUrl(slug: string, relativePath: string): string {
  return `${getCatalogBaseUrl()}/${slug}/${relativePath.replace(/^\/+/, "")}`;
}
