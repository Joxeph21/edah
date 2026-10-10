

export interface Category {
  id: number;
  label: string;
}

export interface Variant {
  id: number;
  sku: string;
  label: string;
  price: number; // minor units
  currency: string;
  stock: number;
}

export interface ProductType {
  id: number;
  label: string;
  description: string | null;
  category: Category | null;
  variants: Variant[];
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  images: string[];
  isFeatured: boolean;
  categories: Category[]; 
  types: ProductType[];
}

// Single source of truth for the query, so the DB shape and mapper can't drift
export const PRODUCT_SELECT = `
  id, slug, title, description, images, is_featured,
  artwork_types (
    id, label, description, sort_order,
    category:category_id ( id, label ),
    artwork_variants ( id, sku, label, price, currency, stock, sort_order )
  )
`;

export function toProduct(row: any): Product {
  const types: ProductType[] = (row.artwork_types ?? []).map(
    (t: any): ProductType => ({
      id: t.id,
      label: t.label,
      description: t.description ?? null,
      category: t.category ?? null,
      variants: (t.artwork_variants ?? []).map(
        (v: any): Variant => ({
          id: v.id,
          sku: v.sku,
          label: v.label,
          price: v.price,
          currency: v.currency,
          stock: v.stock,
        }),
      ),
    }),
  );

  const cats = new Map<number, Category>();
  for (const t of types) if (t.category) cats.set(t.category.id, t.category);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? null,
    images: row.images ?? [],
    isFeatured: row.is_featured,
    categories: [...cats.values()],
    types,
  };
}

// ---------- Helpers ----------

// Filter key derived from the category label (e.g. "Cover Art" -> "cover art")
export const catKey = (c: Category | null | undefined) =>
  c?.label.toLowerCase() ?? "";

export const formatPrice = (minor: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    minor,
  );

export const typesIn = (p: Product, filter: string) =>
  filter === "all"
    ? p.types
    : p.types.filter((t) => catKey(t.category) === filter);

export const startType = (
  p: Product,
  filter: string,
): ProductType | undefined => typesIn(p, filter)[0] ?? p.types[0];

export const defaultVariant = (t: ProductType): Variant | undefined =>
  t.variants.find((v) => v.stock > 0) ?? t.variants[0];

export const stockLabel = (n: number) =>
  n <= 0 ? "Sold out" : n === 1 ? "Only 1 available" : `${n} in stock`;

// What a card shows for the active filter
export function cardSummary(p: Product, filter: string) {
  const types = typesIn(p, filter);
  const list = types.length ? types : p.types;
  const variants = list.flatMap((t) => t.variants);
  const badge = list[0]?.category?.label ?? "";

  if (!variants.length) return { badge, price: "Enquire" };

  const prices = variants.map((v) => v.price);
  const range = new Set(prices).size > 1;
  return {
    badge,
    price: `${range ? "From " : ""}${formatPrice(Math.min(...prices), variants[0].currency)}`,
  };
}