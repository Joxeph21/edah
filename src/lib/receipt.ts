import { animate } from "motion";
import {
  cartCount,
  cartSubtotal,
  cartCurrency,
  formatPrice,
  itemDetail,
  type CartItem,
} from "./cart";

// One receipt line: "2 x Title ........ $300.00"
function buildLine(item: CartItem) {
  const li = document.createElement("li");
  li.className = "flex items-baseline gap-2";

  const name = document.createElement("span");
  name.className = "min-w-0 truncate";
  name.textContent = `${item.qty} x ${item.title}`;
  name.title = `${item.title} (${itemDetail(item)})`;

  const leader = document.createElement("span");
  leader.className = "flex-1 border-b border-dotted border-neutral-400";

  const price = document.createElement("span");
  price.textContent = formatPrice(item.price * item.qty, item.currency);

  li.append(name, leader, price);
  return li;
}

export function renderReceipt(items: CartItem[], animateIn = false) {
  const receipt = document.querySelector<HTMLElement>("#receipt");
  const lines = document.querySelector<HTMLUListElement>("#receipt-lines");
  const date = document.querySelector<HTMLElement>("#receipt-date");
  const count = document.querySelector<HTMLElement>("#summary-count");
  const subtotal = document.querySelector<HTMLElement>("#subtotal");
  const total = document.querySelector<HTMLElement>("#total");

  if (!receipt || !lines || !date || !count || !subtotal || !total) return;

  date.textContent = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  lines.replaceChildren(...items.map(buildLine));

  const amount = formatPrice(cartSubtotal(items), cartCurrency(items));
  count.textContent = String(cartCount(items));
  subtotal.textContent = amount;
  total.textContent = amount;

  // The receipt "prints" downward
  if (animateIn) {
    animate(
      receipt,
      { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] },
      { duration: 0.9, ease: "easeOut" },
    );
  }
}