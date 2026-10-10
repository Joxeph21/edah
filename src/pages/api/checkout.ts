// src/pages/api/checkout.ts
import type { APIRoute } from "astro";
import supabase from "@/lib/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";

export const prerender = false;

export interface CheckoutItem {
  variant_id: number;
  quantity: number;
}

export interface CheckoutAddress {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  country_code: string;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  customer: {
    name: string;
    email: string;
    phone: string | null; 
  };
  shipping_address: CheckoutAddress;
  billing_address: CheckoutAddress | null;
  notes: string | null;
}

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: CheckoutRequest;
  try {
    body = (await request.json()) as CheckoutRequest;
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  try {
    const { data, error } = await supabase.functions.invoke("create-pending-order", {
      body,
    });

    if (error) {
      if (error instanceof FunctionsHttpError) {
        const status = error.context.status;
        const payload = await error.context.json().catch(() => null);
        return json(
          { error: payload?.error ?? "Could not start checkout" },
          status,
        );
      }
      console.error("create-checkout invoke failed:", error);
      return json({ error: "Could not reach the payment service" }, 502);
    }

    if (!data?.checkout_url) {
      console.error("create-checkout returned no checkout_url:", data);
      return json({ error: "Could not start payment" }, 502);
    }

    return json({
      order_number: data.order_number,
      checkout_url: data.checkout_url,
    });
  } catch (err) {
    console.error("api/checkout error:", err);
    return json({ error: "Failed to create checkout" }, 500);
  }
};
