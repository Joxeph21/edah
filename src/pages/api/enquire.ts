// src/pages/api/enquire.ts
import supabase from "@/lib/supabase";
import type { APIRoute } from "astro";
import { contactSchema } from "schemas/contactSchema";

export const prerender = false;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const parsed = contactSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return json({ error: "Invalid data" }, 400);

  const { firstName, lastName, email, subject, message } = parsed.data;

  const { error } = await supabase.from("enquires").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    subject,
    message,
  });

  if (error) {
    if (error.message.includes("rate_limited")) {
      return json(
        {
          error:
            "You've already sent a message recently. Please try again in 30 minutes.",
        },
        429,
      );
    }
    return json({ error: "Something went wrong. Please try again." }, 500);
  }

  return json({ ok: true });
};
