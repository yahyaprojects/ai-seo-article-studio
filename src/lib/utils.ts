import type { GeneratedArticle } from "@/lib/types";

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function createSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

export function truncate(value: string, length: number): string {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length)}...`;
}

export function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildArticleHtml(article: GeneratedArticle): string {
  const featuredImage = article.featuredImage
    ? `<figure>
<img src="${article.featuredImage.url}" alt="${article.featuredImage.alt}" />
</figure>`
    : "";

  const sections = article.article.sections
    .map((section) => {
      const nested = (section.h3s ?? [])
        .map(
          (item) =>
            `<h3>${item.title}</h3>
${item.content}`,
        )
        .join("\n");

      return `<section>
<h2>${section.h2}</h2>
${section.content}
${nested}
</section>`;
    })
    .join("\n");

  const faq = article.article.faq
    .map(
      (item) =>
        `<h3>${item.question}</h3>
<p>${item.answer}</p>`,
    )
    .join("\n");

  return `<article>
<h1>${article.article.h1}</h1>
${featuredImage}
${article.article.introduction}
${sections}
<section>
<h2>Conclusión</h2>
${article.article.conclusion}
</section>
<section>
<h2>FAQ</h2>
${faq}
</section>
</article>`;
}

export function buildMetaTags(article: GeneratedArticle): string {
  const ogImage = article.featuredImage?.url
    ? `\n<meta property="og:image" content="${article.featuredImage.url}" />`
    : "";

  return `<title>${article.seo.title}</title>
<meta name="description" content="${article.seo.metaDescription}" />
<link rel="canonical" href="${article.seo.canonicalUrl}" />
<meta property="og:title" content="${article.seo.ogTitle}" />
<meta property="og:description" content="${article.seo.ogDescription}" />${ogImage}`;
}

export function buildSitemapEntry(article: GeneratedArticle): string {
  return `<url>
  <loc>${article.seo.canonicalUrl}</loc>
  <lastmod>${article.createdAt}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>`;
}
