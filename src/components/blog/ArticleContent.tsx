import { FaqSection } from "@/components/blog/FaqSection";
import { APP_CONFIG, UI_TEXT } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ArticleContentProps {
  article: GeneratedArticle;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="mx-auto grid w-full max-w-3xl gap-10">
      <header className="grid gap-5 border-b border-border pb-8">
        <h1 className="font-heading text-4xl font-bold text-hero-text md:text-5xl">{article.article.h1}</h1>
        <p className="text-sm text-muted-foreground">{formatDate(article.createdAt, APP_CONFIG.dateLocale)}</p>
        {article.featuredImage ? (
          <figure className="grid gap-2">
            <img
              alt={article.featuredImage.alt}
              className="h-auto max-h-[460px] w-full rounded-lg border border-border object-cover"
              src={article.featuredImage.url}
            />
            <figcaption className="text-xs text-muted-foreground">{article.featuredImage.alt}</figcaption>
          </figure>
        ) : null}
        <div
          className="grid gap-4 text-lg leading-8 text-foreground [&>p]:text-[1.03rem] [&>p]:leading-8 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6 [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: article.article.introduction }}
        />
      </header>

      {article.article.sections.map((section) => (
        <section key={section.h2} className="grid gap-5">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">{section.h2}</h2>
          <div
            className="grid gap-4 text-base leading-8 text-foreground [&>p]:leading-8 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          {(section.h3s ?? []).map((item) => (
            <div key={item.title} className="grid gap-3 border-l border-border pl-4">
              <h3 className="font-heading text-xl font-semibold text-foreground">{item.title}</h3>
              <div
                className="grid gap-4 text-base leading-8 text-foreground [&>p]:leading-8 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))}
        </section>
      ))}

      <section className="grid gap-4">
        <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
          {UI_TEXT.conclusionTitle}
        </h2>
        <div
          className="grid gap-4 text-base leading-8 text-foreground [&>p]:leading-8 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6 [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: article.article.conclusion }}
        />
      </section>

      <FaqSection items={article.article.faq} />
    </article>
  );
}
