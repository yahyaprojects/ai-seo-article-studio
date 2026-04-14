import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { APP_CONFIG } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";
import { formatDate, stripHtml, truncate } from "@/lib/utils";

interface ArticleCardProps {
  article: GeneratedArticle;
  href: string;
}

export function ArticleCard({ article, href }: ArticleCardProps) {
  return (
    <Link href={href}>
      <Card className="grid h-full gap-4 transition-all duration-150 ease-in-out hover:bg-secondary">
        {article.featuredImage ? (
          <img
            alt={article.featuredImage.alt}
            className="h-44 w-full rounded-md border border-border object-cover"
            src={article.featuredImage.url}
          />
        ) : null}
        <h2 className="font-heading text-2xl font-semibold text-foreground">{article.seo.title}</h2>
        <p className="text-sm text-muted-foreground">
          {truncate(stripHtml(article.article.introduction), APP_CONFIG.introExcerptLength)}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDate(article.createdAt, APP_CONFIG.dateLocale)}
        </p>
        <div className="flex flex-wrap gap-2">
          {article.seo.keywords.slice(0, APP_CONFIG.previewKeywordCount).map((keyword) => (
            <Badge key={keyword}>{keyword}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
