import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site);

  const body = `User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /checkout/
Disallow: /commisionsv1
Disallow: /api/
Disallow: /404

Sitemap: ${sitemap.href}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
