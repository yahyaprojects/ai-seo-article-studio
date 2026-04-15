"use client";

import { ArticleCard } from "@/components/blog/ArticleCard";
import { AiLinkButton } from "@/components/ui/AiButton";
import { Card } from "@/components/ui/Card";
import { ROUTES, UI_TEXT } from "@/lib/constants";
import { useArticleStore } from "@/stores/useArticleStore";

export default function PreviewPage() {
  const articles = useArticleStore((state) => state.articles);

  return (
    <section className="grid gap-6">
      <header className="grid gap-2">
        <h1 className="font-heading text-4xl font-bold text-hero-text md:text-5xl">{UI_TEXT.blogTitle}</h1>
        <p className="text-base text-muted-foreground">{UI_TEXT.blogDescription}</p>
      </header>

      {articles.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.seo.slug} article={article} href={`${ROUTES.preview}/${article.seo.slug}`} />
          ))}
        </div>
      ) : (
        <Card className="grid gap-4">
          <p className="text-base text-muted-foreground">{UI_TEXT.emptyStateTitle}</p>
          <AiLinkButton className="w-fit" href={ROUTES.admin}>
            {UI_TEXT.emptyStateCta}
          </AiLinkButton>
        </Card>
      )}
    </section>
  );
}
