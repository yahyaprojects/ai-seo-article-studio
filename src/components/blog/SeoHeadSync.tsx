"use client";

import { useEffect } from "react";

import type { GeneratedArticle } from "@/lib/types";

interface SeoHeadSyncProps {
  article: GeneratedArticle;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

function upsertSchema(schema: string) {
  let element = document.head.querySelector(
    "script[data-generated='article-schema']",
  ) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.setAttribute("data-generated", "article-schema");
    document.head.appendChild(element);
  }

  element.text = schema;
}

export function SeoHeadSync({ article }: SeoHeadSyncProps) {
  useEffect(() => {
    document.title = article.seo.title;

    upsertMeta("meta[name='description']", {
      name: "description",
      content: article.seo.metaDescription,
    });
    upsertMeta("meta[property='og:title']", {
      property: "og:title",
      content: article.seo.ogTitle,
    });
    upsertMeta("meta[property='og:description']", {
      property: "og:description",
      content: article.seo.ogDescription,
    });

    if (article.featuredImage?.url) {
      upsertMeta("meta[property='og:image']", {
        property: "og:image",
        content: article.featuredImage.url,
      });
    }

    upsertCanonical(article.seo.canonicalUrl);
    upsertSchema(JSON.stringify(article.seo.schemaMarkup));
  }, [article]);

  return null;
}
