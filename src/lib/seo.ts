export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  price?: number;
  currency?: string;
  availability?: "in_stock" | "out_of_stock" | "pre_order";
  noIndex?: boolean;
  noFollow?: boolean;
}

const SITE = {
  name: "Edah Art",
  url: "https://edah-drab.vercel.app",
  artist: "Edah",
  location: "Lagos, Nigeria",
  twitter: "@edahart",
} as const;

export function getSEOMeta(props: SEOProps = {}) {
  const {
    title,
    description = "Edah is a multidisciplinary fine artist based in Lagos, Nigeria. Fusing magical realism with Afro-surrealism to create a rich fictional world through oil, acrylics, sculptures, and 3D masks.",
    image = "/og-image.png",
    url = "/",
    type = "website",
    publishedTime,
    modifiedTime,
    author = SITE.artist,
    section,
    tags = [],
    price,
    currency = "USD",
    availability = "in_stock",
    noIndex = false,
    noFollow = false,
  } = props;

  const canonicalURL = new URL(url, SITE.url);
  const socialImageURL = new URL(image, SITE.url);
  const fullTitle = title ? `${title} - ${SITE.name}` : SITE.name;

  const robots = `${noIndex ? "noindex" : "index"},${noFollow ? "nofollow" : "follow"}`;

  const metaTags = [
    { name: "title", content: fullTitle },
    { name: "description", content: description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#0d1b1f" },
    { name: "robots", content: robots },
    { property: "og:type", content: type },
    { property: "og:url", content: canonicalURL.toString() },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: socialImageURL.toString() },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: canonicalURL.toString() },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: socialImageURL.toString() },
    { name: "twitter:site", content: SITE.twitter },
    { name: "author", content: author },
    { property: "article:author", content: author },
    { name: "generator", content: "Astro" },
  ];

  if (publishedTime) {
    metaTags.push({ property: "article:published_time", content: publishedTime });
  }
  if (modifiedTime) {
    metaTags.push({ property: "article:modified_time", content: modifiedTime });
  }
  if (section) {
    metaTags.push({ property: "article:section", content: section });
  }
  if (tags.length) {
    tags.forEach((tag) => metaTags.push({ property: "article:tag", content: tag }));
  }
  if (price !== undefined) {
    metaTags.push({ property: "product:price:amount", content: (price / 100).toFixed(2) });
    metaTags.push({ property: "product:price:currency", content: currency });
    metaTags.push({ property: "product:availability", content: availability });
  }

  return { fullTitle, canonicalURL, socialImageURL, metaTags };
}

export function getStructuredData(props: SEOProps = {}) {
  const { url = "/", type = "website", description, image = "/og-image.png", title } = props;
  const canonicalURL = new URL(url, SITE.url);
  const socialImageURL = new URL(image, SITE.url);

  const base = {
    "@context": "https://schema.org",
    "@graph": [] as object[],
  };

  base["@graph"].push({
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/logo.png`,
      width: 200,
      height: 200,
    },
    sameAs: [
      `https://instagram.com/${SITE.twitter.replace("@", "")}`,
      `https://twitter.com/${SITE.twitter.replace("@", "")}`,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    founder: {
      "@type": "Person",
      name: SITE.artist,
    },
  });

  base["@graph"].push({
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });

  if (type === "product" && title) {
    base["@graph"].push({
      "@type": "Product",
      "@id": `${canonicalURL}#product`,
      name: title,
      description,
      image: socialImageURL.toString(),
      brand: { "@id": `${SITE.url}/#organization` },
      offers: {
        "@type": "Offer",
        url: canonicalURL.toString(),
        priceCurrency: props.currency ?? "USD",
        price: props.price ? (props.price / 100).toFixed(2) : undefined,
        availability: `https://schema.org/${props.availability?.replace("_", "In") ?? "InStock"}`,
        seller: { "@id": `${SITE.url}/#organization` },
      },
    });
  } else if (type === "article") {
    base["@graph"].push({
      "@type": "Article",
      "@id": `${canonicalURL}#article`,
      headline: title,
      description,
      image: [socialImageURL.toString()],
      author: {
        "@type": "Person",
        name: SITE.artist,
        url: SITE.url,
      },
      publisher: { "@id": `${SITE.url}/#organization` },
      datePublished: props.publishedTime,
      dateModified: props.modifiedTime,
      articleSection: props.section,
      keywords: props.tags?.join(", "),
    });
  } else {
    base["@graph"].push({
      "@type": "WebPage",
      "@id": `${canonicalURL}#webpage`,
      url: canonicalURL.toString(),
      name: title ?? SITE.name,
      description,
      isPartOf: { "@id": `${SITE.url}/#website` },
      author: { "@id": `${SITE.url}/#organization` },
      image: socialImageURL.toString(),
    });
  }

  return base;
}

export function renderMetaTags(props: SEOProps) {
  const { metaTags, fullTitle, canonicalURL, socialImageURL } = getSEOMeta(props);
  return { metaTags, fullTitle, canonicalURL, socialImageURL };
}