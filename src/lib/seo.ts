import { Product } from "../types";

export function updatePageSEO(product?: Product, categoryTitle?: string) {
  if (typeof document === "undefined") return;

  if (product) {
    document.title = `${product.title} - Vale a Pena? Review Sincera | acheiutil.com`;
    
    const safeSummary = product.summary || product.subtitle || product.title || "";
    const summaryExcerpt = safeSummary.slice(0, 160);

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", summaryExcerpt);
    }

    // OpenGraph & Canonical
    const canonicalUrl = product.slug
      ? `https://acheiutil.com/${product.slug}/`
      : `https://acheiutil.com/?product=${product.id}`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `${product.title} - Review e Menor Preço`);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", summaryExcerpt);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Update JSON-LD structured data
    let scriptTag = document.getElementById("jsonld-structured-data") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "jsonld-structured-data";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const verdictScore = typeof product.verdict === 'object' && product.verdict?.score 
      ? (product.verdict.score / 2).toFixed(1) 
      : "4.8";

    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.title,
      image: product.images,
      description: safeSummary,
      brand: {
        "@type": "Brand",
        name: product.specifications?.find((s) => (s.label || (s as any).name || "").toLowerCase() === "marca")?.value || "Mercado Livre",
      },
      offers: {
        "@type": "Offer",
        url: product.affiliateUrl,
        priceCurrency: "BRL",
        price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0).replace(',', '.')),
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: product.officialStore || "Mercado Livre",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 100,
        bestRating: "5",
        worstRating: "1",
      },
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: verdictScore,
          bestRating: "5",
        },
        author: {
          "@type": "Organization",
          name: "acheiutil.com Equipe Editorial",
        },
        reviewBody: product.reviewContent?.slice(0, 300) || safeSummary,
      },
    };

    scriptTag.text = JSON.stringify(schemaData);
  } else {
    // General homepage or category
    const title = categoryTitle
      ? `${categoryTitle} - Melhores Achados e Reviews no Mercado Livre | acheiutil.com`
      : "acheiutil.com - Antes de comprar, descubra se vale a pena.";
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Encontre os produtos mais úteis para Casa, Utilidades, Decoração e Pet no Mercado Livre com reviews detalhadas, prós e contras e o menor preço garantido."
      );
    }

    // Remove or reset JSON-LD
    const scriptTag = document.getElementById("jsonld-structured-data");
    if (scriptTag) {
      const siteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "acheiutil.com",
        url: window.location.origin,
        potentialAction: {
          "@type": "SearchAction",
          target: `${window.location.origin}/?busca={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };
      scriptTag.textContent = JSON.stringify(siteSchema);
    }
  }
}
