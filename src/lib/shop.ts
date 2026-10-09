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
  category: string; // slug
  variants: Variant[];
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  images: string[];
  categories: string[];
  types: ProductType[];
}

export const formatPrice = (minor: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    minor / 100,
  );

export const typesIn = (p: Product, filter: string) =>
  filter === "all" ? p.types : p.types.filter((t) => t.category === filter);

export const startType = (p: Product, filter: string) =>
  typesIn(p, filter)[0] ?? p.types[0];

export const defaultVariant = (t: ProductType) =>
  t.variants.find((v) => v.stock > 0) ?? t.variants[0];

export const stockLabel = (n: number) =>
  n <= 0 ? "Sold out" : n === 1 ? "Only 1 available" : `${n} in stock`;

// What a card shows for the active filter
export function cardSummary(p: Product, filter: string) {
  const types = typesIn(p, filter);
  const list = types.length ? types : p.types;
  const variants = list.flatMap((t) => t.variants);
  if (!variants.length) return { badge: "", price: "" };

  const prices = variants.map((v) => v.price);
  const range = new Set(prices).size > 1;
  return {
    badge: list[0].category,
    price: `${range ? "From " : ""}${formatPrice(Math.min(...prices), variants[0].currency)}`,
  };
}