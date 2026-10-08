export type CartItem = {
  id: number;
  title: string;
  category: string;
  price: number; 
  image: string;
  qty: number;
};

const KEY = "cart";
export const MAX_QTY = 10;

export function getCart(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
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

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = getCart();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.qty = Math.min(MAX_QTY, existing.qty + qty);
  } else {
    items.push({ ...item, qty });
  }
  saveCart(items);
}

export function cartCount(items: CartItem[] = getCart()) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items: CartItem[] = getCart()) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});
export const formatPrice = (n: number) => money.format(n);

export function syncCartBadges() {
  const count = String(cartCount());
  document
    .querySelectorAll<HTMLElement>("[data-cart-count]")
    .forEach((el) => (el.textContent = count));
}