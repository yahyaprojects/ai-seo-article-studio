"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiFileText, FiTag, FiZap } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { useArticleStore } from "@/stores/useArticleStore";

export default function AdminArticlesPage() {
  const articles = useArticleStore((state) => state.articles);

  if (articles.length === 0) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl font-bold text-foreground">Artículos</h1>
          <p className="text-sm text-muted-foreground">
            Artículos generados durante esta sesión.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <FiFileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Sin artículos todavía
          </h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Genera tu primer artículo SEO y aparecerá aquí.
          </p>
          <Link href={ROUTES.admin} className="mt-6">
            <Button className="inline-flex items-center gap-2">
              <FiZap className="h-4 w-4" />
              Generar artículo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl font-bold text-foreground">Artículos</h1>
          <p className="text-sm text-muted-foreground">
            {articles.length} {articles.length === 1 ? "artículo generado" : "artículos generados"} en esta sesión.
          </p>
        </div>
        <Link href={ROUTES.admin}>
          <Button className="inline-flex items-center gap-2">
            <FiZap className="h-4 w-4" />
            Nuevo artículo
          </Button>
        </Link>
      </div>

      {/* Articles grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => {
          const slug = article.seo.slug;
          const articleUrl = `${ROUTES.preview}/${slug}`;
          const date = new Date(article.createdAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <article
              key={slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
            >
              {/* Featured image */}
              {article.featuredImage?.url && (
                <div className="relative h-40 w-full overflow-hidden bg-secondary">
                  <Image
                    src={article.featuredImage.url}
                    alt={article.featuredImage.alt || article.seo.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              )}

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="font-heading text-base font-semibold leading-snug text-foreground line-clamp-2">
                  {article.seo.title}
                </h2>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {article.seo.metaDescription}
                </p>

                {/* Keywords */}
                {article.seo.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {article.seo.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        <FiTag className="h-2.5 w-2.5" />
                        {kw}
                      </span>
                    ))}
                    {article.seo.keywords.length > 3 && (
                      <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                        +{article.seo.keywords.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FiCalendar className="h-3.5 w-3.5" />
                    {date}
                  </span>
                  <Link href={articleUrl}>
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      Ver artículo
                      <FiArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
