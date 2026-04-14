"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UI_TEXT } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";
import { buildArticleHtml, buildMetaTags, buildSitemapEntry } from "@/lib/utils";

interface SeoMetadataPanelProps {
  article: GeneratedArticle;
}

export function SeoMetadataPanel({ article }: SeoMetadataPanelProps) {
  const [open, setOpen] = useState(false);

  async function copyToClipboard(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <Card className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="text-left" onClick={() => setOpen((prev) => !prev)} type="button">
          <h2 className="font-heading text-2xl font-semibold text-foreground">{UI_TEXT.seoPanelTitle}</h2>
        </button>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => copyToClipboard(buildArticleHtml(article))} variant="secondary">
            {UI_TEXT.copyHtmlButton}
          </Button>
          <Button onClick={() => copyToClipboard(buildMetaTags(article))} variant="secondary">
            {UI_TEXT.copyMetaButton}
          </Button>
          <Button onClick={() => copyToClipboard(JSON.stringify(article.seo.schemaMarkup, null, 2))} variant="ghost">
            {UI_TEXT.copySchemaButton}
          </Button>
          <Button onClick={() => copyToClipboard(buildSitemapEntry(article))} variant="ghost">
            {UI_TEXT.copySitemapButton}
          </Button>
        </div>
      </div>

      {open ? (
        <section className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="font-heading text-xl font-semibold text-foreground">{UI_TEXT.seoMetaTagsTitle}</h3>
            <pre className="overflow-auto rounded-md border border-border bg-background p-4 font-mono text-sm">
              {buildMetaTags(article)}
            </pre>
          </div>
          <div className="grid gap-2">
            <h3 className="font-heading text-xl font-semibold text-foreground">{UI_TEXT.seoKeywordsTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {article.seo.keywords.map((keyword) => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <h3 className="font-heading text-xl font-semibold text-foreground">{UI_TEXT.seoSchemaTitle}</h3>
            <pre className="overflow-auto rounded-md border border-border bg-background p-4 font-mono text-sm">
              {JSON.stringify(article.seo.schemaMarkup, null, 2)}
            </pre>
          </div>
          <div className="grid gap-2">
            <h3 className="font-heading text-xl font-semibold text-foreground">{UI_TEXT.seoSitemapTitle}</h3>
            <pre className="overflow-auto rounded-md border border-border bg-background p-4 font-mono text-sm">
              {buildSitemapEntry(article)}
            </pre>
          </div>
        </section>
      ) : null}
    </Card>
  );
}
