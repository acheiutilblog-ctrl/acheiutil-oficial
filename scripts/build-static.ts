import fs from "fs";
import path from "path";

interface Product {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  slug?: string;
  price?: number;
  category?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SiteSettings {
  siteName?: string;
  tagline?: string;
}

function getProducts(): Product[] {
  const paths = [
    path.join(process.cwd(), "data", "products.json"),
    path.join(process.cwd(), "public", "data", "products.json"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch (e) {
        console.error("Error reading " + p, e);
      }
    }
  }
  return [];
}

function getSettings(): SiteSettings {
  const paths = [
    path.join(process.cwd(), "data", "settings.json"),
    path.join(process.cwd(), "public", "data", "settings.json"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch (e) {
        console.error("Error reading " + p, e);
      }
    }
  }
  return { siteName: "acheiutil.com", tagline: "Antes de comprar, descubra se vale a pena" };
}

function cleanProductDescription(raw?: string): string {
  if (!raw) return "";
  let text = String(raw).trim();
  text = text.replace(/^Transparência:[\s\S]*?(nem o veredicto da análise\.|adicional para você\.)\s*/i, "");
  text = text.replace(/^Isso não altera os critérios nem o veredicto da análise\.\s*/i, "");
  text = text.replace(/^Transparência:[\s\S]*?\.\s*/i, "");
  text = text.replace(/^Aviso:[\s\S]*?\.\s*/i, "");
  text = text.replace(/\[…\]|\[\.\.\.\]/g, "").trim();
  return text;
}

export function generateStaticFeeds() {
  const products = getProducts();
  const settings = getSettings();
  const siteDomain = settings.siteName || "acheiutil.com";
  const baseUrl = `https://${siteDomain}`;
  const pubDate = new Date().toUTCString();
  const today = new Date().toISOString().split("T")[0];

  // 1. RSS Feed XML
  const itemsXml = products
    .slice(0, 100)
    .map((p) => {
      const itemUrl = p.slug ? `${baseUrl}/${p.slug}/` : `${baseUrl}/?product=${p.id}`;
      const rawImg = p.images?.[0] || "/logo-detective.png";
      const imageUrl = rawImg.startsWith("http")
        ? rawImg
        : `${baseUrl}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
      const itemDate = p.createdAt ? new Date(p.createdAt).toUTCString() : pubDate;
      
      const rawDesc = cleanProductDescription(p.summary || p.subtitle || "");
      const priceText = p.price ? `Por R$ ${Number(p.price).toFixed(2)} no Mercado Livre.` : "";
      const bodyDesc = rawDesc || `Confira a análise completa e veredito do produto no AcheiUtil.`;

      const socialCaption = `${p.title} - ${priceText} ${bodyDesc} Antes de comprar, descubra se vale a pena.`
        .replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] || c));

      return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${itemDate}</pubDate>
      <category><![CDATA[${p.category || "Geral"}]]></category>
      <description><![CDATA[${socialCaption}]]></description>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0" />
      <media:content url="${imageUrl}" medium="image" />
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[acheiutil.com - Achados Úteis e Reviews Reais]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${settings.tagline || "Antes de comprar, descubra se vale a pena"}]]></description>
    <language>pt-BR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo-detective.png</url>
      <title><![CDATA[acheiutil.com]]></title>
      <link>${baseUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  // 2. Sitemap XML
  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/termos`, priority: "0.3", changefreq: "yearly" },
    { loc: `${baseUrl}/privacidade`, priority: "0.3", changefreq: "yearly" },
    { loc: `${baseUrl}/cookies`, priority: "0.3", changefreq: "yearly" },
    { loc: `${baseUrl}/afiliados`, priority: "0.5", changefreq: "monthly" },
    { loc: `${baseUrl}/sobre`, priority: "0.5", changefreq: "monthly" },
    { loc: `${baseUrl}/contato`, priority: "0.5", changefreq: "monthly" },
  ];

  const productUrls = products.map((p) => {
    const loc = p.slug ? `${baseUrl}/${p.slug}/` : `${baseUrl}/?product=${p.id}`;
    const lastmod = p.updatedAt ? p.updatedAt.split("T")[0] : today;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
${productUrls.join("\n")}
</urlset>`;

  // 3. Robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write to public folder
  fs.writeFileSync(path.join(publicDir, "feed.xml"), rssXml, "utf-8");
  fs.writeFileSync(path.join(publicDir, "rss.xml"), rssXml, "utf-8");
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf-8");
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf-8");

  // Write to dist folder if exists
  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, "feed.xml"), rssXml, "utf-8");
    fs.writeFileSync(path.join(distDir, "rss.xml"), rssXml, "utf-8");
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
    fs.writeFileSync(path.join(distDir, "robots.txt"), robotsTxt, "utf-8");
  }

  console.log("Successfully generated static feed.xml, rss.xml, sitemap.xml, robots.txt!");
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes("build-static")) {
  generateStaticFeeds();
}
