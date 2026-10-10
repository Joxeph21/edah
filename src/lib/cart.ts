import { formatPrice } from "./shop";

export { formatPrice }; // one formatter for shop and cart (prices are in usd)

export type CartItem = {
  variantId: number; // the cart's key: one line per variant
  sku: string;
  productId: number;
  title: string;
  typeLabel: string; // "Original", "Print"
  variantLabel: string; // "A3", "24 × 36 in"
  category: string; // slug, e.g. "prints"
  price: number; 
  currency: string;
  image: string;
  stock: number; // stock when added, caps the quantity
  qty: number;
};

export type NewCartItem = Omit<CartItem, "qty">;

const KEY = "cart:v2";
export const MAX_QTY = 10;

// An original with stock 1 can only ever be in the cart once
export const maxQtyFor = (item: Pick<CartItem, "stock">) =>
  Math.max(1, Math.min(MAX_QTY, item.stock));

const isItem = (x: any): x is CartItem =>
  !!x &&
  typeof x.variantId === "number" &&
  typeof x.sku === "string" &&
  typeof x.price === "number" &&
  typeof x.qty === "number" &&
  typeof x.stock === "number";

export function getCart(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isItem)
      .map((i) => ({ ...i, qty: Math.min(maxQtyFor(i), Math.max(1, i.qty)) }));
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode, quota) */
  }
  syncCartBadges();
}

/** How many of this variant are in the cart (0 if none). */
export const getQty = (variantId: number) =>
  getCart().find((i) => i.variantId === variantId)?.qty ?? 0;

/** Returns how many were actually added (0 if the item is already at its limit). */
export function addToCart(item: NewCartItem, qty = 1): number {
  const items = getCart();
  const existing = items.find((i) => i.variantId === item.variantId);
  let added: number;

  if (existing) {
    const next = Math.min(maxQtyFor(item), existing.qty + qty);
    added = next - existing.qty;
    Object.assign(existing, item, { qty: next }); // refresh price/stock snapshot
  } else {
    added = Math.min(maxQtyFor(item), qty);
    items.push({ ...item, qty: added });
  }

  saveCart(items);
  return added;
}

/** Sets a variant's quantity, clamped to its stock. 0 or less removes it. Returns the new qty. */
export function setQty(variantId: number, qty: number): number {
  const items = getCart();
  const item = items.find((i) => i.variantId === variantId);
  if (!item) return 0;

  if (qty <= 0) {
    saveCart(items.filter((i) => i.variantId !== variantId));
    return 0;
  }

  item.qty = Math.min(maxQtyFor(item), qty);
  saveCart(items);
  return item.qty;
}

export const removeFromCart = (variantId: number) => setQty(variantId, 0);

export const cartCount = (items: CartItem[] = getCart()) =>
  items.reduce((n, i) => n + i.qty, 0);

export const cartSubtotal = (items: CartItem[] = getCart()) =>
  items.reduce((sum, i) => sum + i.price * i.qty, 0);

export const cartCurrency = (items: CartItem[] = getCart()) =>
  items[0]?.currency ?? "USD";

/** "Print · A3", or just "Standard" when type and option match */
export const itemDetail = (i: CartItem) =>
  i.typeLabel === i.variantLabel
    ? i.typeLabel
    : `${i.typeLabel} · ${i.variantLabel}`;

export function syncCartBadges() {
  const count = String(cartCount());
  document
    .querySelectorAll<HTMLElement>("[data-cart-count]")
    .forEach((el) => (el.textContent = count));
}



