import type { Json } from "@/integrations/supabase/types";
import { catalogLinks } from "@/generated/catalog-links";

type ProductImage = {
  url: string;
  is_primary?: boolean;
};

export function getCatalogLinkEntry(slug: string | null | undefined) {
  if (!slug) {
    return null;
  }

  return catalogLinks[slug] ?? null;
}

export function getCatalogProductImageUrls(slug: string | null | undefined): string[] {
  const entry = getCatalogLinkEntry(slug);

  if (!entry) {
    return [];
  }

  const urls = [
    entry.primaryImageUrl,
    ...entry.galleryImageUrls,
    ...Object.values(entry.colorImageUrls),
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(urls));
}

export function getCatalogModelUrl(slug: string | null | undefined): string | null {
  return getCatalogLinkEntry(slug)?.modelUrl ?? null;
}

export function getProductImageUrls(images: Json, slug: string | null | undefined): string[] {
  const catalogImageUrls = getCatalogProductImageUrls(slug);
  if (catalogImageUrls.length > 0) {
    return catalogImageUrls;
  }

  if (!Array.isArray(images)) {
    return ["/placeholder.svg"];
  }

  const urls = (images as ProductImage[])
    .map((image) => image?.url)
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  return urls.length > 0 ? urls : ["/placeholder.svg"];
}

export function getProductPrimaryImage(images: Json, slug: string | null | undefined): string {
  return getProductImageUrls(images, slug)[0] || "/placeholder.svg";
}

export function hasCatalogModel(slug: string | null | undefined): boolean {
  return Boolean(getCatalogModelUrl(slug));
}
