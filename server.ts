import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Product, SiteSettings } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.static(path.join(process.cwd(), "public")));

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const PUBLIC_DATA_DIR = path.join(process.cwd(), "public", "data");
const PUBLIC_PRODUCTS_FILE = path.join(PUBLIC_DATA_DIR, "products.json");
const PUBLIC_SETTINGS_FILE = path.join(PUBLIC_DATA_DIR, "settings.json");
const PUBLIC_PRODUCTS_IMG_DIR = path.join(process.cwd(), "public", "products");

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_DATA_DIR)) {
    fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_PRODUCTS_IMG_DIR)) {
    fs.mkdirSync(PUBLIC_PRODUCTS_IMG_DIR, { recursive: true });
  }
}

function readProducts(): Product[] {
  try {
    ensureDataFiles();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      if (fs.existsSync(PUBLIC_PRODUCTS_FILE)) {
        const fallbackData = fs.readFileSync(PUBLIC_PRODUCTS_FILE, "utf-8");
        return JSON.parse(fallbackData);
      }
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products.json:", error);
    return [];
  }
}

function writeProducts(products: Product[]): boolean {
  try {
    ensureDataFiles();
    const jsonStr = JSON.stringify(products, null, 2);
    fs.writeFileSync(PRODUCTS_FILE, jsonStr, "utf-8");
    fs.writeFileSync(PUBLIC_PRODUCTS_FILE, jsonStr, "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing products.json:", error);
    return false;
  }
}

function readSettings(): SiteSettings {
  try {
    ensureDataFiles();
    if (!fs.existsSync(SETTINGS_FILE)) {
      if (fs.existsSync(PUBLIC_SETTINGS_FILE)) {
        const fallbackData = fs.readFileSync(PUBLIC_SETTINGS_FILE, "utf-8");
        return JSON.parse(fallbackData);
      }
      return {
        siteName: "acheiutil.com",
        tagline: "Achados Úteis com Reviews Reais e os Menores Preços do Mercado Livre",
        affiliateTag: "acheiutil-20",
        contactEmail: "contato@acheiutil.com",
        bannerText: "🔥 Ofertas Exclusivas Mercado Livre: Até 40% OFF com Frete Grátis Full nos produtos selecionados!",
        bannerActive: true,
      };
    }
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {
      siteName: "acheiutil.com",
      tagline: "Achados Úteis com Reviews Reais e os Menores Preços do Mercado Livre",
      affiliateTag: "acheiutil-20",
      contactEmail: "contato@acheiutil.com",
      bannerText: "🔥 Ofertas Exclusivas Mercado Livre: Até 40% OFF com Frete Grátis Full nos produtos selecionados!",
      bannerActive: true,
    };
  }
}

function writeSettings(settings: SiteSettings): boolean {
  try {
    ensureDataFiles();
    const jsonStr = JSON.stringify(settings, null, 2);
    fs.writeFileSync(SETTINGS_FILE, jsonStr, "utf-8");
    fs.writeFileSync(PUBLIC_SETTINGS_FILE, jsonStr, "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing settings.json:", error);
    return false;
  }
}

function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Initialize Gemini safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Gemini initialization error:", err);
    return null;
  }
}

// ==================== API ROUTES ====================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Products: List & Filter
app.get("/api/products", (req, res) => {
  try {
    let products = readProducts();
    const { category, search, featured, dealOfTheDay, bestSeller, sort } = req.query;

    if (category && typeof category === "string" && category !== "todas") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === "string" && search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (featured === "true") {
      products = products.filter((p) => p.featured);
    }

    if (dealOfTheDay === "true") {
      products = products.filter((p) => p.dealOfTheDay);
    }

    if (bestSeller === "true") {
      products = products.filter((p) => p.bestSeller);
    }

    // Sorting
    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === "discount") {
      products.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else {
      // Default: recent first
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({ success: true, count: products.length, products, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product: Get by ID or Slug
app.get("/api/products/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const products = readProducts();
    const decodedParam = decodeURIComponent(idOrSlug).toLowerCase().trim();
    const cleanParam = decodedParam.replace(/^[^a-z0-9]+/i, "");

    const product = products.find(
      (p) =>
        p.id === idOrSlug ||
        p.slug === idOrSlug ||
        p.slug.toLowerCase() === idOrSlug.toLowerCase() ||
        decodeURIComponent(p.slug).toLowerCase() === decodedParam ||
        p.slug.replace(/^[^a-z0-9]+/i, "") === cleanParam
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    }

    // Related products (same category, different id, max 4)
    const related = products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);

    res.json({ success: true, product, related });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product: Create
app.post("/api/products", (req, res) => {
  try {
    const products = readProducts();
    const newProduct: Product = req.body;

    if (!newProduct.title || !newProduct.category || !newProduct.price) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios: título, categoria e preço.",
      });
    }

    // Auto-generate ID and Slug if needed
    if (!newProduct.id) {
      newProduct.id = "mlb-" + Date.now();
    }
    if (!newProduct.slug) {
      newProduct.slug = generateSlug(newProduct.title);
    }

    // Ensure slug is unique
    let finalSlug = newProduct.slug;
    let counter = 1;
    while (products.some((p) => p.slug === finalSlug && p.id !== newProduct.id)) {
      finalSlug = `${newProduct.slug}-${counter}`;
      counter++;
    }
    newProduct.slug = finalSlug;

    // Calculate discount if originalPrice provided
    if (newProduct.originalPrice && newProduct.originalPrice > newProduct.price) {
      newProduct.discountPercentage = Math.round(
        ((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100
      );
    }

    const now = new Date().toISOString();
    newProduct.createdAt = now;
    newProduct.updatedAt = now;

    // Default images array
    if (!newProduct.images || !Array.isArray(newProduct.images) || newProduct.images.length === 0) {
      newProduct.images = ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80"];
    }

    // Default pros & cons & verdict
    if (!newProduct.pros) newProduct.pros = [];
    if (!newProduct.cons) newProduct.cons = [];
    if (!newProduct.specifications) newProduct.specifications = [];
    if (!newProduct.faqs) newProduct.faqs = [];
    if (!newProduct.verdict) {
      newProduct.verdict = {
        score: 9.5,
        badge: "Recomendação Achei Útil",
        summary: "Excelente produto com alta satisfação entre os compradores do Mercado Livre.",
        recommendedFor: "Quem busca praticidade e melhor relação custo-benefício.",
        notRecommendedFor: "Quem procura modelos industriais de grande porte.",
      };
    }

    products.unshift(newProduct);
    writeProducts(products);

    res.status(201).json({ success: true, product: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product: Update
app.put("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const products = readProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    }

    const current = products[index];
    const updated: Product = {
      ...current,
      ...req.body,
      id: current.id, // prevent id change
      updatedAt: new Date().toISOString(),
    };

    if (updated.title && updated.title !== current.title && !req.body.slug) {
      updated.slug = generateSlug(updated.title);
    }

    if (updated.originalPrice && updated.originalPrice > updated.price) {
      updated.discountPercentage = Math.round(
        ((updated.originalPrice - updated.price) / updated.originalPrice) * 100
      );
    }

    products[index] = updated;
    writeProducts(products);

    res.json({ success: true, product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product: Delete
app.delete("/api/products/:id", (req, res) => {
  try {
    const { id } = req.params;
    const products = readProducts();
    const initialLen = products.length;
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === initialLen) {
      return res.status(404).json({ success: false, message: "Produto não encontrado para exclusão." });
    }

    writeProducts(filtered);
    res.json({ success: true, message: "Produto excluído com sucesso!" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Image Upload endpoint (saves uploaded base64 images directly into /public/products/)
app.post("/api/upload", (req, res) => {
  try {
    ensureDataFiles();
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
    }

    let base64Data = image;
    let ext = "jpg";

    const match = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (match) {
      ext = match[1] === "jpeg" ? "jpg" : match[1];
      base64Data = match[2];
    }

    const cleanName = (name || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const filename = `${cleanName}-${Date.now()}.${ext}`;
    const filePath = path.join(PUBLIC_PRODUCTS_IMG_DIR, filename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
    const publicUrl = `/products/${filename}`;

    res.json({ success: true, url: publicUrl, filename });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Favicon explicit endpoints
app.get("/favicon.ico", (_req, res) => {
  const icoPath = path.join(process.cwd(), "public", "favicon.ico");
  if (fs.existsSync(icoPath)) {
    res.setHeader("Content-Type", "image/x-icon");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    return res.sendFile(icoPath);
  }
  const pngPath = path.join(process.cwd(), "public", "logo-detective.png");
  res.setHeader("Content-Type", "image/png");
  res.sendFile(pngPath);
});

app.get("/favicon.svg", (_req, res) => {
  const svgPath = path.join(process.cwd(), "public", "favicon.svg");
  if (fs.existsSync(svgPath)) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    return res.sendFile(svgPath);
  }
  res.status(404).end();
});

// Logo upload endpoint (updates public/logo-detective.png directly)
app.post("/api/upload-logo", (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "Nenhuma imagem enviada." });
    }
    let base64Data = image;
    const match = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (match) {
      base64Data = match[2];
    }
    const buf = Buffer.from(base64Data, "base64");
    const pubDir = path.join(process.cwd(), "public");
    fs.writeFileSync(path.join(pubDir, "logo-detective.png"), buf);
    fs.writeFileSync(path.join(pubDir, "logo.png"), buf);
    fs.writeFileSync(path.join(pubDir, "logo-sr-detetive.png"), buf);
    fs.writeFileSync(path.join(pubDir, "logo-detetive.png"), buf);
    fs.writeFileSync(path.join(pubDir, "logo_transparent.png"), buf);
    fs.writeFileSync(path.join(pubDir, "favicon.png"), buf);
    fs.writeFileSync(path.join(pubDir, "apple-touch-icon.png"), buf);

    // Create ICO with PNG embedded
    const icoHeader = Buffer.alloc(22);
    icoHeader.writeUInt16LE(0, 0);
    icoHeader.writeUInt16LE(1, 2);
    icoHeader.writeUInt16LE(1, 4);
    icoHeader.writeUInt8(0, 6);
    icoHeader.writeUInt8(0, 7);
    icoHeader.writeUInt8(0, 8);
    icoHeader.writeUInt8(0, 9);
    icoHeader.writeUInt16LE(1, 10);
    icoHeader.writeUInt16LE(32, 12);
    icoHeader.writeUInt32LE(buf.length, 14);
    icoHeader.writeUInt32LE(22, 18);
    const icoBuf = Buffer.concat([icoHeader, buf]);
    fs.writeFileSync(path.join(pubDir, "favicon.ico"), icoBuf);

    // SVG wrapper
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024" width="1024" height="1024">\n  <image width="1024" height="1024" xlink:href="data:image/png;base64,${base64Data}" />\n</svg>`;
    fs.writeFileSync(path.join(pubDir, "logo-icon.svg"), svgContent);

    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, "logo-detective.png"), buf);
      fs.writeFileSync(path.join(distDir, "logo.png"), buf);
      fs.writeFileSync(path.join(distDir, "logo-sr-detetive.png"), buf);
      fs.writeFileSync(path.join(distDir, "logo-detetive.png"), buf);
      fs.writeFileSync(path.join(distDir, "logo_transparent.png"), buf);
      fs.writeFileSync(path.join(distDir, "favicon.png"), buf);
      fs.writeFileSync(path.join(distDir, "apple-touch-icon.png"), buf);
      fs.writeFileSync(path.join(distDir, "favicon.ico"), icoBuf);
      fs.writeFileSync(path.join(distDir, "logo-icon.svg"), svgContent);
    }

    res.json({
      success: true,
      message: "Logo original e ícone das abas atualizados com sucesso!",
      url: `/logo-detective.png?v=${Date.now()}`
    });
  } catch (error: any) {
    console.error("Upload logo error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings: Get & Update
app.get("/api/settings", (_req, res) => {
  try {
    const settings = readSettings();
    res.json({ success: true, settings, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const saveSettingsHandler = (req: express.Request, res: express.Response) => {
  try {
    const current = readSettings();
    const updated = {
      ...current,
      ...req.body,
    };
    writeSettings(updated);
    res.json({ success: true, settings: updated, data: updated, message: "Configurações salvas!" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

app.post("/api/settings", saveSettingsHandler);
app.put("/api/settings", saveSettingsHandler);

// ==================== WORDPRESS EXPORT ENDPOINTS ====================

// Export as WordPress WXR XML (compatible with WordPress Tools > Import)
app.get("/api/export/wordpress.xml", (_req, res) => {
  try {
    const products = readProducts();
    const settings = readSettings();
    const now = new Date();
    const pubDate = now.toUTCString();

    const categoryNames: Record<string, string> = {
      tecnologia: "Tecnologia & Gadgets",
      casa: "Casa & Organização",
      utilidades: "Utilidades & Cozinha",
      saude: "Saúde & Cuidados",
      fitness: "Fitness & Esportes",
      automotivo: "Automotivo & Ferramentas",
      games: "Games & Setup",
    };

    let itemsXml = "";

    products.forEach((product, idx) => {
      const postId = idx + 100;
      const catName = categoryNames[product.category] || product.category;
      const pDate = new Date(product.createdAt || now);
      const postDateStr = pDate.toISOString().replace("T", " ").substring(0, 19);

      // Build rich HTML content for WordPress post
      const prosHtml = product.pros && product.pros.length > 0
        ? `<h3>✅ Pontos Fortes (Prós)</h3><ul>${product.pros.map((p) => `<li>${p}</li>`).join("")}</ul>`
        : "";

      const consHtml = product.cons && product.cons.length > 0
        ? `<h3>⚠️ Pontos de Atenção (Contras)</h3><ul>${product.cons.map((c) => `<li>${c}</li>`).join("")}</ul>`
        : "";

      const specsHtml = product.specifications && product.specifications.length > 0
        ? `<h3>📋 Ficha Técnica</h3><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;"><tbody>${product.specifications.map((s) => `<tr><th style="text-align:left;background:#f3f4f6;">${s.label}</th><td>${s.value}</td></tr>`).join("")}</tbody></table>`
        : "";

      const faqsHtml = product.faqs && product.faqs.length > 0
        ? `<h3>❓ Perguntas Frequentes</h3>${product.faqs.map((f) => `<p><strong>${f.question}</strong><br/>${f.answer}</p>`).join("")}`
        : "";

      const verdictHtml = product.verdict
        ? `<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;margin:20px 0;"><h3>⭐ Avaliação e Veredito (Nota ${product.verdict.score || product.rating}/10)</h3><p><strong>${product.verdict.badge || ""}</strong>: ${product.verdict.summary || ""}</p><p><strong>Recomendado para:</strong> ${product.verdict.recommendedFor || ""}</p></div>`
        : "";

      const imagesHtml = product.images && product.images.length > 0
        ? `<p><img src="${product.images[0]}" alt="${product.title}" style="max-width:100%;height:auto;border-radius:8px;"/></p>`
        : "";

      const ctaHtml = `
<div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
  <p style="font-size:18px;font-weight:bold;color:#1e3a8a;margin:0 0 8px 0;">Por apenas R$ ${product.price.toFixed(2).replace(".", ",")} ${product.installments ? `(${product.installments})` : ""}</p>
  ${product.originalPrice ? `<p style="text-decoration:line-through;color:#6b7280;margin:0 0 12px 0;">De: R$ ${product.originalPrice.toFixed(2).replace(".", ",")}</p>` : ""}
  <p><a href="${product.affiliateUrl}" target="_blank" rel="nofollow noopener sponsored" style="display:inline-block;background:#ff7700;color:#ffffff;font-size:16px;font-weight:bold;padding:14px 28px;text-decoration:none;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">👉 Ver Menor Preço no Mercado Livre Oficial</a></p>
  <p style="font-size:12px;color:#4b5563;margin:8px 0 0 0;">${product.isFull ? "⚡ Envio FULL Mais Rápido do Brasil • " : ""}${product.freeShipping ? "Frete Grátis Disponível • " : ""}Compra 100% Protegida</p>
</div>`;

      const formattedContent = `
${imagesHtml}
<p><strong>${product.subtitle || product.summary}</strong></p>
${ctaHtml}
<hr/>
<h2>Guia Completo e Avaliação dos Compradores</h2>
<p>${product.reviewContent.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>
${prosHtml}
${consHtml}
${verdictHtml}
${specsHtml}
${faqsHtml}
<hr/>
${ctaHtml}
<p style="font-size:11px;color:#9ca3af;margin-top:24px;"><em>Aviso de Afiliados: O acheiutil.com pode receber uma comissão caso você compre através dos links acima, sem nenhum custo adicional para você.</em></p>
`.trim();

      itemsXml += `
	<item>
		<title><![CDATA[${product.title}]]></title>
		<link>https://${settings.siteName}/review/${product.slug}</link>
		<pubDate>${pDate.toUTCString()}</pubDate>
		<dc:creator><![CDATA[admin]]></dc:creator>
		<guid isPermaLink="false">https://${settings.siteName}/?p=${postId}</guid>
		<description></description>
		<content:encoded><![CDATA[${formattedContent}]]></content:encoded>
		<excerpt:encoded><![CDATA[${product.subtitle || product.summary}]]></excerpt:encoded>
		<wp:post_id>${postId}</wp:post_id>
		<wp:post_date><![CDATA[${postDateStr}]]></wp:post_date>
		<wp:post_date_gmt><![CDATA[${postDateStr}]]></wp:post_date_gmt>
		<wp:comment_status><![CDATA[open]]></wp:comment_status>
		<wp:ping_status><![CDATA[closed]]></wp:ping_status>
		<wp:post_name><![CDATA[${product.slug}]]></wp:post_name>
		<wp:status><![CDATA[publish]]></wp:status>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type><![CDATA[post]]></wp:post_type>
		<wp:post_password><![CDATA[]]></wp:post_password>
		<wp:is_sticky>0</wp:is_sticky>
		<category domain="category" nicename="${product.category}"><![CDATA[${catName}]]></category>
		<category domain="post_tag" nicename="mercado-livre"><![CDATA[Mercado Livre]]></category>
		<category domain="post_tag" nicename="${product.category}"><![CDATA[${catName}]]></category>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_price]]></wp:meta_key>
			<wp:meta_value><![CDATA[${product.price}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_regular_price]]></wp:meta_key>
			<wp:meta_value><![CDATA[${product.originalPrice || product.price}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_affiliate_url]]></wp:meta_key>
			<wp:meta_value><![CDATA[${product.affiliateUrl}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_product_rating]]></wp:meta_key>
			<wp:meta_value><![CDATA[${product.rating}]]></wp:meta_value>
		</wp:postmeta>
		<wp:postmeta>
			<wp:meta_key><![CDATA[_product_mlb_id]]></wp:meta_key>
			<wp:meta_value><![CDATA[${product.mlbId || ""}]]></wp:meta_value>
		</wp:postmeta>
	</item>`;
    });

    const wxrXml = `<?xml version="1.0" encoding="UTF-8" ?>
<!-- generator="WordPress/6.4.3" created="${pubDate}" -->
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
	<title>${settings.siteName}</title>
	<link>https://${settings.siteName}</link>
	<description>${settings.tagline || "Achados Úteis no Mercado Livre"}</description>
	<pubDate>${pubDate}</pubDate>
	<language>pt-BR</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>https://${settings.siteName}</wp:base_site_url>
	<wp:base_blog_url>https://${settings.siteName}</wp:base_blog_url>

	<wp:author>
		<wp:author_id>1</wp:author_id>
		<wp:author_login><![CDATA[admin]]></wp:author_login>
		<wp:author_email><![CDATA[${settings.contactEmail}]]></wp:author_email>
		<wp:author_display_name><![CDATA[Redação Achei Útil]]></wp:author_display_name>
		<wp:author_first_name><![CDATA[Achei]]></wp:author_first_name>
		<wp:author_last_name><![CDATA[Útil]]></wp:author_last_name>
	</wp:author>

	<wp:category>
		<wp:term_id>10</wp:term_id>
		<wp:category_nicename><![CDATA[utilidades]]></wp:category_nicename>
		<wp:category_parent><![CDATA[]]></wp:category_parent>
		<wp:cat_name><![CDATA[Utilidades & Cozinha]]></wp:cat_name>
	</wp:category>
	<wp:category>
		<wp:term_id>11</wp:term_id>
		<wp:category_nicename><![CDATA[tecnologia]]></wp:category_nicename>
		<wp:category_parent><![CDATA[]]></wp:category_parent>
		<wp:cat_name><![CDATA[Tecnologia & Gadgets]]></wp:cat_name>
	</wp:category>
	<wp:category>
		<wp:term_id>12</wp:term_id>
		<wp:category_nicename><![CDATA[casa]]></wp:category_nicename>
		<wp:category_parent><![CDATA[]]></wp:category_parent>
		<wp:cat_name><![CDATA[Casa & Organização]]></wp:cat_name>
	</wp:category>
	<wp:category>
		<wp:term_id>13</wp:term_id>
		<wp:category_nicename><![CDATA[saude]]></wp:category_nicename>
		<wp:category_parent><![CDATA[]]></wp:category_parent>
		<wp:cat_name><![CDATA[Saúde & Cuidados]]></wp:cat_name>
	</wp:category>
	<wp:category>
		<wp:term_id>14</wp:term_id>
		<wp:category_nicename><![CDATA[fitness]]></wp:category_nicename>
		<wp:category_parent><![CDATA[]]></wp:category_parent>
		<wp:cat_name><![CDATA[Fitness & Esportes]]></wp:cat_name>
	</wp:category>
${itemsXml}
</channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="acheiutil-wordpress-posts-${Date.now()}.xml"`);
    res.send(wxrXml);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export as WooCommerce / WP All Import CSV
app.get("/api/export/products.csv", (_req, res) => {
  try {
    const products = readProducts();
    
    // CSV Header compatible with WooCommerce & WP All Import
    const headers = [
      "ID",
      "Tipo",
      "Nome",
      "Publicado",
      "Em Destaque",
      "Descricao_Curta",
      "Descricao_Completa",
      "Preco_Normal",
      "Preco_Promocional",
      "Categorias",
      "Tags",
      "Imagens",
      "Link_Afiliado_ML",
      "Avaliacao_Nota",
      "Total_Avaliacoes",
      "Envio_Full",
      "Frete_Gratis",
      "Score_Review",
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = products.map((p) => {
      return [
        escapeCsv(p.id),
        escapeCsv("external"), // WooCommerce External/Affiliate Product
        escapeCsv(p.title),
        escapeCsv("1"),
        escapeCsv(p.featured ? "1" : "0"),
        escapeCsv(p.subtitle || p.summary),
        escapeCsv(p.reviewContent),
        escapeCsv(p.originalPrice || p.price),
        escapeCsv(p.price),
        escapeCsv(p.category),
        escapeCsv("Mercado Livre, Afiliados, Achei Util"),
        escapeCsv((p.images || []).join(", ")),
        escapeCsv(p.affiliateUrl),
        escapeCsv(p.rating),
        escapeCsv(p.reviewCount),
        escapeCsv(p.isFull ? "Sim" : "Nao"),
        escapeCsv(p.freeShipping ? "Sim" : "Nao"),
        escapeCsv(p.verdict?.score || p.rating),
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="acheiutil-produtos-woocommerce-${Date.now()}.csv"`);
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Standard RSS 2.0 / Atom feed for social auto-posting (Metricool, Zapier, Buffer, IFTTT, Publer, etc.)
const handleRssFeed = (_req: any, res: any) => {
  try {
    const products = readProducts();
    const settings = readSettings();
    const siteDomain = settings.siteName || "acheiutil.com";
    const baseUrl = `https://${siteDomain}`;
    const pubDate = new Date().toUTCString();

    const itemsXml = products
      .slice(0, 50)
      .map((p) => {
        const itemUrl = p.slug ? `${baseUrl}/${p.slug}/` : `${baseUrl}/?product=${p.id}`;
        const rawImg = p.images?.[0] || "/logo-detective.png";
        const imageUrl = rawImg.startsWith("http")
          ? rawImg
          : `${baseUrl}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
        const itemDate = p.createdAt ? new Date(p.createdAt).toUTCString() : pubDate;
        const cleanSummary = (p.summary || p.subtitle || p.title || "")
          .replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] || c));

        return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${itemDate}</pubDate>
      <category><![CDATA[${p.category || "Geral"}]]></category>
      <description><![CDATA[${cleanSummary} - Por R$ ${Number(p.price || 0).toFixed(2)} no Mercado Livre. Confira a análise do Sr. Detetive no AcheiUtil.]]></description>
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
    <description><![CDATA[${settings.tagline || "Achados Úteis com Reviews Reais e os Menores Preços do Mercado Livre"}]]></description>
    <language>pt-BR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo-detective.png</url>
      <title><![CDATA[acheiutil.com]]></title>
      <link>${baseUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=1800"); // 30 mins
    res.send(rssXml);
  } catch (error: any) {
    res.status(500).send("Erro gerando RSS feed: " + error.message);
  }
};

app.get("/rss.xml", handleRssFeed);
app.get("/feed.xml", handleRssFeed);
app.get("/feed", handleRssFeed);
app.get("/api/feed", handleRssFeed);

// ==================== SITEMAP.XML & ROBOTS.TXT ====================
app.get(["/sitemap.xml", "/sitemap_index.xml"], (_req, res) => {
  try {
    const products = readProducts();
    const settings = readSettings();
    const baseUrl = `https://${settings.siteName || "acheiutil.com"}`;
    const today = new Date().toISOString().split("T")[0];

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

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(sitemapXml);
  } catch (err: any) {
    res.status(500).send("Erro gerando sitemap: " + err.message);
  }
});

app.get("/robots.txt", (_req, res) => {
  const settings = readSettings();
  const baseUrl = `https://${settings.siteName || "acheiutil.com"}`;
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(robots);
});

// Sync / Import posts directly from WordPress (acheiutil.com)
app.post("/api/wordpress/sync", (_req, res) => {
  try {
    execSync("python3 scripts/sync_wordpress.py", { encoding: "utf-8" });
    const products = readProducts();
    res.json({
      success: true,
      message: `Sincronização concluída com sucesso! ${products.length} posts importados do acheiutil.com.`,
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error("Erro sincronizando posts do WordPress:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== MERCADO LIVRE API INTEGRATION ====================

// Search Mercado Livre via public API
app.get("/api/mercadolivre/search", async (req, res) => {
  try {
    const { q, limit = "12" } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ success: false, message: "Parâmetro 'q' (termo de busca) é obrigatório." });
    }

    const cleanQuery = q.trim();
    const apiUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(cleanQuery)}&limit=${limit}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AcheiUtilBot/1.0)",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Mercado Livre API responded with status ${response.status}`);
      }

      const data = await response.json();
      const settings = readSettings();
      const affiliateTag = settings.affiliateTag || "acheiutil-20";

      const items = (data.results || []).map((item: any) => {
        // Build high-res picture URL
        let highResThumb = item.thumbnail;
        if (highResThumb && highResThumb.includes("-I.jpg")) {
          highResThumb = highResThumb.replace("-I.jpg", "-O.jpg");
        } else if (highResThumb && highResThumb.includes("-I.webp")) {
          highResThumb = highResThumb.replace("-I.webp", "-O.webp");
        }
        // Ensure https
        if (highResThumb && highResThumb.startsWith("http://")) {
          highResThumb = highResThumb.replace("http://", "https://");
        }

        // Attach affiliate tracking param to permalink
        let affiliateUrl = item.permalink || `https://produto.mercadolivre.com.br/MLB-${item.id}`;
        if (affiliateUrl.includes("?")) {
          affiliateUrl += `&affiliate=${affiliateTag}`;
        } else {
          affiliateUrl += `?affiliate=${affiliateTag}`;
        }

        return {
          id: item.id,
          title: item.title,
          price: item.price,
          original_price: item.original_price,
          thumbnail: highResThumb,
          permalink: affiliateUrl,
          raw_permalink: item.permalink,
          condition: item.condition,
          free_shipping: item.shipping?.free_shipping || false,
          logistic_type: item.shipping?.logistic_type,
          isFull: item.shipping?.logistic_type === "fulfillment",
          official_store_name: item.official_store_name || item.seller?.nickname || "Vendedor Mercado Livre",
          installments: item.installments
            ? `${item.installments.quantity}x de R$ ${item.installments.amount?.toFixed(2).replace(".", ",")} ${
                item.installments.rate === 0 ? "sem juros" : ""
              }`
            : undefined,
          attributes: (item.attributes || []).map((attr: any) => ({
            name: attr.name,
            value_name: attr.value_name,
          })),
        };
      });

      res.json({ success: true, results: items });
    } catch (fetchError: any) {
      console.warn("Mercado Livre API fetch error (using fallback generator):", fetchError.message);
      // Generate intelligent fallback items matching user search for a smooth experience
      const mockItems = generateFallbackMLItems(cleanQuery);
      res.json({ success: true, results: mockItems, note: "Fallback simulado da API Mercado Livre" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch single Mercado Livre item details
app.get("/api/mercadolivre/item/:id", async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim().toUpperCase();

    // If user entered a full URL, extract MLB ID
    if (id.includes("MLB")) {
      const match = id.match(/MLB-?(\d+)/i);
      if (match) {
        id = `MLB${match[1]}`;
      }
    }

    const itemUrl = `https://api.mercadolibre.com/items/${id}`;
    const descUrl = `https://api.mercadolibre.com/items/${id}/description`;

    try {
      const [itemRes, descRes] = await Promise.all([
        fetch(itemUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AcheiUtilBot/1.0)", Accept: "application/json" },
        }),
        fetch(descUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AcheiUtilBot/1.0)", Accept: "application/json" },
        }),
      ]);

      if (!itemRes.ok) {
        throw new Error(`Item not found on Mercado Livre (status ${itemRes.status})`);
      }

      const itemData = await itemRes.json();
      let descriptionText = "";
      if (descRes.ok) {
        const descData = await descRes.json();
        descriptionText = descData.plain_text || descData.text || "";
      }

      const settings = readSettings();
      const affiliateTag = settings.affiliateTag || "acheiutil-20";

      let affiliateUrl = itemData.permalink || `https://produto.mercadolivre.com.br/MLB-${itemData.id}`;
      if (affiliateUrl.includes("?")) {
        affiliateUrl += `&affiliate=${affiliateTag}`;
      } else {
        affiliateUrl += `?affiliate=${affiliateTag}`;
      }

      const pictures = (itemData.pictures || []).map((p: any) => p.secure_url || p.url);

      res.json({
        success: true,
        item: {
          id: itemData.id,
          title: itemData.title,
          price: itemData.price,
          original_price: itemData.original_price,
          pictures: pictures.length > 0 ? pictures : [itemData.thumbnail],
          thumbnail: itemData.thumbnail,
          permalink: affiliateUrl,
          free_shipping: itemData.shipping?.free_shipping || false,
          isFull: itemData.shipping?.logistic_type === "fulfillment",
          official_store_name: itemData.official_store_name || "Loja Mercado Livre",
          warranty: itemData.warranty,
          description: descriptionText,
          attributes: (itemData.attributes || []).map((attr: any) => ({
            name: attr.name,
            value_name: attr.value_name,
          })),
        },
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: `Não foi possível carregar o produto ${id} diretamente da API: ${error.message}`,
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auto-generate High-Converting Review with Gemini
app.post("/api/mercadolivre/generate-review", async (req, res) => {
  try {
    const { title, category, price, rawDescription, attributes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Título é obrigatório para gerar o review." });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Você é o redator do portal acheiutil.com (curadoria independente de Casa, Utilidades, Decoração e Pets com links de afiliados do Mercado Livre).
Escreva um guia e review informativo, sincero e focado em tirar dúvidas de quem pretende comprar o produto:
Título: "${title}"
Categoria: "${category || "utilidades"}"
Preço: R$ ${price || "0.00"}
Detalhes técnicos / Descrição do Mercado Livre: ${rawDescription || JSON.stringify(attributes || "")}

IMPORTANTE: Não finja que você comprou ou testou fisicamente em laboratório. O texto deve se posicionar como uma curadoria honesta e criteriosa baseada na ficha técnica oficial e no consenso dos comentários reais de quem comprou no Mercado Livre.

Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "summary": "Um parágrafo conciso (2 a 3 frases) focado em sanar as dores do consumidor, destacando os principais benefícios e o custo-benefício.",
  "reviewContent": "3 a 4 parágrafos bem escritos em português do Brasil sintetizando as características principais, a opinião dos compradores, facilidade de uso, durabilidade e pontos fortes/fracos relatados por quem comprou.",
  "pros": [
    "ponto forte 1",
    "ponto forte 2",
    "ponto forte 3",
    "ponto forte 4"
  ],
  "cons": [
    "ponto de atenção 1 honesto",
    "ponto de atenção 2 honesto"
  ],
  "verdict": {
    "score": 9.7,
    "badge": "Mais Vendido ou Destaque Custo-Benefício ou Recomendado",
    "summary": "Resumo da avaliação em 1 frase convincente",
    "recommendedFor": "Para quem esse produto é ideal",
    "notRecommendedFor": "Para quem esse produto NÃO é indicado"
  },
  "specifications": [
    { "label": "Característica 1", "value": "Valor 1" },
    { "label": "Característica 2", "value": "Valor 2" },
    { "label": "Característica 3", "value": "Valor 3" }
  ],
  "faqs": [
    { "question": "Pergunta comum 1 sobre o produto?", "answer": "Resposta clara e tranquilizadora." },
    { "question": "Pergunta comum 2?", "answer": "Resposta clara." },
    { "question": "Pergunta comum 3?", "answer": "Resposta clara." }
  ]
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text?.trim() || "{}";
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, engine: "gemini-3.8-flash" });
      } catch (geminiError: any) {
        console.warn("Gemini generation failed, falling back to smart heuristic generator:", geminiError.message);
      }
    }

    // Heuristic fallback if Gemini API is not available or encounters error
    const fallback = generateHeuristicReview(title, category, price, rawDescription);
    res.json({ success: true, data: fallback, engine: "heuristic-fallback" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper for fallback items when ML API has rate limits
function generateFallbackMLItems(query: string) {
  const qLower = query.toLowerCase();
  const sampleImages = [
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
  ];

  return [
    {
      id: "MLB" + Math.floor(100000000 + Math.random() * 900000000),
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} Premium Edição Oficial`,
      price: 149.9,
      original_price: 219.0,
      thumbnail: sampleImages[0],
      permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(query)}&affiliate=acheiutil`,
      condition: "new",
      free_shipping: true,
      isFull: true,
      official_store_name: "Loja Oficial no Mercado Livre",
      installments: "6x de R$ 24,98 sem juros",
      attributes: [
        { name: "Condição", value_name: "Novo" },
        { name: "Garantia", value_name: "12 meses" },
      ],
    },
    {
      id: "MLB" + Math.floor(100000000 + Math.random() * 900000000),
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} Inteligente Alta Eficiência`,
      price: 89.9,
      original_price: 129.9,
      thumbnail: sampleImages[1],
      permalink: `https://www.mercadolivre.com.br/busca?q=${encodeURIComponent(query)}&affiliate=acheiutil`,
      condition: "new",
      free_shipping: true,
      isFull: true,
      official_store_name: "Mercado Líder Platinum",
      installments: "3x de R$ 29,97 sem juros",
      attributes: [
        { name: "Marca", value_name: "TopSeller" },
        { name: "Material", value_name: "Reforçado" },
      ],
    },
  ];
}

// Fallback high-conversion copy generator
function generateHeuristicReview(title: string, category: string, price: any, _desc: any) {
  const pNum = Number(price) || 99.9;
  return {
    summary: `O ${title} se destaca como uma das soluções mais inteligentes e bem avaliadas no Mercado Livre na categoria de ${category || "utilidades"}. Unindo alta durabilidade, facilidade de uso e excelente custo-benefício, é a escolha ideal para quem quer modernizar a casa sem gastar a mais.`,
    reviewContent: `Analisamos detalhadamente todos os aspectos do ${title}, desde a qualidade dos materiais até o desempenho prático nas tarefas diárias. O produto entrega exatamente o que promete nas fotos e especificações técnicas, com acabamento impecável e funcionamento intuitivo.\n\nDurante o teste de uso contínuo, a ergonomia e a praticidade chamam a atenção de imediato. A construção robusta garante longa vida útil, enquanto o design elegante harmoniza facilmente com qualquer ambiente da residência.\n\nAlém disso, o suporte e a garantia respaldada pelo programa de Compra Garantida do Mercado Livre trazem tranquilidade total para o comprador, com devolução facilitada caso o item não atenda 100% às expectativas.`,
    pros: [
      "Excelente custo-benefício comparado a alternativas mais caras do mercado",
      "Construção com materiais de alta resistência e excelente durabilidade",
      "Design moderno que combina facilmente com o ambiente",
      "Fácil utilização e manutenção simples no dia a dia",
      "Disponível com entrega rápida Full no Mercado Livre",
    ],
    cons: [
      "Manual de instruções poderia trazer letras um pouco maiores",
      "Costuma esgotar com rapidez nos períodos de promoção",
    ],
    verdict: {
      score: 9.6,
      badge: "Melhor Custo-Benefício",
      summary: `Vale muito a pena o investimento por R$ ${pNum.toFixed(2).replace(".", ",")}, entregando qualidade superior à média dos concorrentes.`,
      recommendedFor: "Quem prioriza praticidade, durabilidade e quer economizar comprando produtos aprovados por milhares de usuários.",
      notRecommendedFor: "Quem exige equipamentos industriais profissionais de porte pesado.",
    },
    specifications: [
      { label: "Categoria", value: category || "Utilidades" },
      { label: "Garantia", value: "3 meses contra defeitos de fabricação" },
      { label: "Envio", value: "Mercado Livre Full com rastreamento 24h" },
      { label: "Condição", value: "Produto 100% Novo e Lacrado" },
    ],
    faqs: [
      {
        question: "O produto vem com nota fiscal e garantia?",
        answer: "Sim! Todos os pedidos através da loja oficial ou vendedores certificados do Mercado Livre acompanham Nota Fiscal Eletrônica e garantia oficial.",
      },
      {
        question: "Quanto tempo demora a entrega com o Mercado Envios Full?",
        answer: "Produtos com o selo Full estão armazenados nos centros de distribuição do Mercado Livre e geralmente chegam no dia seguinte ou em até 48 horas úteis.",
      },
      {
        question: "Posso devolver se eu não gostar?",
        answer: "Sim. Pelo programa Compra Garantida do Mercado Livre você tem até 30 dias para devolução gratuita e reembolso total do seu dinheiro.",
      },
    ],
  };
}

function findProductFromRequest(req: any): any | null {
  try {
    const products = readProducts();
    const queryId = (req.query.product || req.query.p || req.query.prod) as string;
    if (queryId) {
      const found = products.find(
        (p) =>
          p.id === queryId ||
          p.slug === queryId ||
          p.id.toLowerCase() === queryId.toLowerCase() ||
          (p.slug && p.slug.toLowerCase() === queryId.toLowerCase())
      );
      if (found) return found;
    }

    let pathSlug = "";
    try {
      pathSlug = decodeURIComponent(req.path).replace(/^\/+|\/+$/g, "").trim().toLowerCase();
    } catch {
      pathSlug = req.path.replace(/^\/+|\/+$/g, "").trim().toLowerCase();
    }

    if (
      !pathSlug ||
      pathSlug.startsWith("api") ||
      pathSlug.startsWith("@") ||
      pathSlug.startsWith("src") ||
      pathSlug.startsWith("node_modules") ||
      pathSlug.includes(".") ||
      pathSlug === "feed" ||
      pathSlug === "rss" ||
      pathSlug === "sitemap" ||
      pathSlug === "admin"
    ) {
      return null;
    }

    const cleanSlug = pathSlug.replace(/^(produto|review|analise)\//, "");

    return (
      products.find((p) => {
        const pSlug = (p.slug || "").toLowerCase();
        const pId = (p.id || "").toLowerCase();
        return (
          pSlug === cleanSlug ||
          pId === cleanSlug ||
          pSlug === pathSlug ||
          pId === pathSlug ||
          (pSlug && pSlug.replace(/^https-acheiutil-com-/, "") === cleanSlug) ||
          (pSlug && cleanSlug.includes(pSlug)) ||
          (pSlug && pSlug.includes(cleanSlug) && cleanSlug.length > 8)
        );
      }) || null
    );
  } catch (e) {
    console.error("findProductFromRequest error:", e);
    return null;
  }
}

function renderHtmlWithProductMeta(template: string, prod: any): string {
  if (!prod) return template;
  try {
    const title = `${prod.title} - Vale a Pena? Review Sincera | acheiutil.com`;
    const desc = (prod.subtitle || prod.summary || prod.verdict?.summary || `Confira a análise sincera de ${prod.title}, prós, contras e o menor preço verificado no Mercado Livre.`)
      .replace(/"/g, "&quot;");
    const img = prod.images?.[0] || "https://acheiutil.com/logo-detective.png";
    const canonicalUrl = prod.slug ? `https://acheiutil.com/${prod.slug}/` : `https://acheiutil.com/?product=${prod.id}`;

    // Schema.org JSON-LD
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": prod.title,
      "image": prod.images,
      "description": prod.summary || prod.subtitle,
      "offers": {
        "@type": "Offer",
        "url": prod.affiliateUrl || canonicalUrl,
        "priceCurrency": "BRL",
        "price": prod.price || 0,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": prod.officialStore || "Mercado Livre"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": prod.rating || 4.8,
        "reviewCount": prod.reviewCount || 120,
        "bestRating": "5",
        "worstRating": "1"
      }
    });

    let rendered = template
      .replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`)
      .replace(/<meta property="og:title" content=".*?"/gi, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}"`)
      .replace(/<meta property="og:description" content=".*?"/gi, `<meta property="og:description" content="${desc}"`)
      .replace(/<meta property="og:image" content=".*?"/gi, `<meta property="og:image" content="${img}"`)
      .replace(/<meta property="og:url" content=".*?"/gi, `<meta property="og:url" content="${canonicalUrl}"`)
      .replace(/<meta name="twitter:title" content=".*?"/gi, `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}"`)
      .replace(/<meta name="twitter:description" content=".*?"/gi, `<meta name="twitter:description" content="${desc}"`)
      .replace(/<meta name="twitter:image" content=".*?"/gi, `<meta name="twitter:image" content="${img}"`);

    // Inserir tag canônica e schema se não existir
    if (!rendered.includes('rel="canonical"')) {
      rendered = rendered.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    } else {
      rendered = rendered.replace(/<link rel="canonical" href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
    }

    const jsonLdTag = `\n  <script type="application/ld+json" id="server-jsonld">${jsonLd}</script>\n</head>`;
    rendered = rendered.replace('</head>', jsonLdTag);

    return rendered;
  } catch (err) {
    console.error("renderHtmlWithProductMeta error:", err);
    return template;
  }
}

// ==================== VITE MIDDLEWARE / STATIC ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Intercept HTML requests for product slugs and queries so social bots, Googlebot and browsers get real metadata
    app.use(async (req, res, next) => {
      if (req.method === "GET" && !req.path.startsWith("/api") && (req.headers.accept?.includes("text/html") || !req.path.includes("."))) {
        const prod = findProductFromRequest(req);
        if (prod) {
          try {
            const indexPath = path.join(process.cwd(), "index.html");
            let template = fs.readFileSync(indexPath, "utf-8");
            template = await vite.transformIndexHtml(req.originalUrl, template);
            template = renderHtmlWithProductMeta(template, prod);
            res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).end(template);
            return;
          } catch (e) {
            next(e);
            return;
          }
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, "utf-8");
          const prod = findProductFromRequest(req);
          if (prod) {
            html = renderHtmlWithProductMeta(html, prod);
          }
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.send(html);
          return;
        }
      } catch (err) {
        console.error("Error serving index.html:", err);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 acheiutil.com server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
