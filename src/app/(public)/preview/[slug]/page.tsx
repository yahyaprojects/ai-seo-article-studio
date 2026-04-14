"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArticleContent } from "@/components/blog/ArticleContent";
import { SeoHeadSync } from "@/components/blog/SeoHeadSync";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ROUTES, UI_TEXT } from "@/lib/constants";
import { useArticleStore } from "@/stores/useArticleStore";

export default function ArticlePreviewPage() {
  const params = useParams<{ slug: string }>();
  const article = useArticleStore((state) => state.articles.find((entry) => entry.seo.slug === params.slug));

  if (!article) {
    return (
      <Card className="grid gap-4">
        <p className="text-base text-muted-foreground">{UI_TEXT.articleNotFound}</p>
        <Link href={ROUTES.preview}>
          <Button variant="ghost">{UI_TEXT.backToBlog}</Button>
        </Link>
      </Card>
    );
  }

  return (
    <section className="grid gap-8">
      <SeoHeadSync article={article} />
      <ArticleContent article={article} />
    </section>
  );
}
