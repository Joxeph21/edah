import supabase from "@/lib/supabase";
import type { APIRoute } from "astro";
import { newsletterSchema } from "schemas/newsletterSchema";

export const prerender = false;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return json({ error: "Invalid data" }, 400);

  // Honeypot: bots fill it, people never see it. Pretend it worked.
  if (form.get("website")) return json({ ok: true });

  const parsed = newsletterSchema.safeParse({
    email: String(form.get("email") ?? ""),
  });
  if (!parsed.success)
    return json({ error: "Enter a valid email address" }, 400);

  const email = parsed.data.email.trim().toLowerCase();

  const { error } = await supabase.from("newsletter_signee").insert({ email });

  if (error && error.code !== "23505") {
    console.error("Newsletter signup failed:", error.message);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }

  return json({ ok: true });
};
