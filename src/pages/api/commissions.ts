// src/pages/api/commission.ts
import { serverBase } from "@/lib/supabase";
import type { APIRoute } from "astro";
import { commissionSchema } from "schemas/commissionSchema";

export const prerender = false;

const BUCKET = "commission-references";

const TYPE_MAP: Record<string, string> = {
  mask: "custom-masks",
  mural: "murals",
  sculpture: "sculptures",
  "cover-art": "cover-art",
  other: "custom",
};

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return json({ error: "Invalid data" }, 400);

  const inspiration = form
    .getAll("inspiration")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const parsed = commissionSchema.safeParse({
    type: form.get("type"),
    name: form.get("name"),
    email: form.get("email"),
    about: form.get("about"),
    details: form.get("details") ?? "",
    inspiration,
  });
  if (!parsed.success) return json({ error: "Invalid data" }, 400);

  const { type, name, about, details } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { count } = await serverBase
    .from("commission_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gt("created_at", since);

  if (count && count > 0) {
    return json(
      {
        error:
          "You've already sent a request recently. Please try again in 30 minutes.",
      },
      429,
    );
  }

  // Upload files   
  const uploadedPaths: string[] = [];
  const urls: string[] = [];

  for (const file of inspiration) {
    const ext = file.name.includes(".")
      ? file.name.split(".").pop()!.toLowerCase()
      : "bin";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await serverBase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });

    if (error) {
      if (uploadedPaths.length)
        await serverBase.storage.from(BUCKET).remove(uploadedPaths);
      return json(
        { error: "Couldn't upload your files. Please try again." },
        500,
      );
    }

    uploadedPaths.push(path);
    urls.push(serverBase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  const { error } = await serverBase.from("commission_requests").insert({
    commission_type: TYPE_MAP[type],
    commission_status: "awaiting",
    name,
    email,
    message: about,
    additional_message: details || null,
    reference_urls: urls,
  });

  if (error) {
    // Don't leave orphaned uploads behind
    if (uploadedPaths.length)
      await serverBase.storage.from(BUCKET).remove(uploadedPaths);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }

  return json({ ok: true });
};
