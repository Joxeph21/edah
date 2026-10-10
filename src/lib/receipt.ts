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

export function renderReceipt(
  items: CartItem[],
  animateIn = false,
  shippingFee?: number,
) {
  const receipt = document.querySelector<HTMLElement>("#receipt");
  const lines = document.querySelector<HTMLUListElement>("#receipt-lines");
  const date = document.querySelector<HTMLElement>("#receipt-date");
  const count = document.querySelector<HTMLElement>("#summary-count");
  const subtotal = document.querySelector<HTMLElement>("#subtotal");
  const shipping = document.querySelector<HTMLElement>("#shipping");
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

  const currency = cartCurrency(items);
  const subtotalValue = cartSubtotal(items);
  const hasShipping = shippingFee !== undefined;

  count.textContent = String(cartCount(items));
  subtotal.textContent = formatPrice(subtotalValue, currency);

  // Shipping row: keeps the "to be confirmed" label until a country is picked
    // Shipping row: "to be confirmed" until a country is picked, FREE when 0
  if (shipping) {
    if (!hasShipping) {
      shipping.textContent = "to be confirmed";
      shipping.classList.add("text-neutral-500");
    } else if (shippingFee === 0) {
      shipping.textContent = "FREE";
      shipping.classList.remove("text-neutral-500");
    } else {
      shipping.textContent = formatPrice(shippingFee, currency);
      shipping.classList.remove("text-neutral-500");
    }
  }

  total.textContent = formatPrice(subtotalValue + (shippingFee ?? 0), currency);

  // The receipt "prints" downward
  if (animateIn) {
    animate(
      receipt,
      { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] },
      { duration: 0.9, ease: "easeOut" },
    );
  }
}