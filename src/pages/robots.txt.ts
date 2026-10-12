import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const sitemapIndex = new URL("sitemap-index.xml", site);
  const sitemap0 = new URL("sitemap-0.xml", site);

  const body = `User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /checkout/
Disallow: /commisionsv1
Disallow: /api/
Disallow: /404

Sitemap: ${sitemapIndex.href}
Sitemap: ${sitemap0.href}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
