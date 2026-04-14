"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { StreamingPreview, type SeoCheckItem } from "@/components/admin/StreamingPreview";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Textarea } from "@/components/ui/Textarea";
import { DEMO_LIMITS, ERROR_TEXT, ROUTES, UI_TEXT } from "@/lib/constants";
import type { ArticleFormData, ArticleImageOption, GeneratedArticle } from "@/lib/types";
import { createSlug } from "@/lib/utils";
import { useArticleStore } from "@/stores/useArticleStore";

const initialFormData: ArticleFormData = {
  title: "",
  metaDescription: "",
  observations: "",
};

type UnknownRecord = Record<string, unknown>;

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function asRecord(value: unknown): UnknownRecord {
  if (typeof value === "object" && value !== null) {
    return value as UnknownRecord;
  }
  return {};
}

function normalizeImageOption(value: unknown): ArticleImageOption | null {
  const data = asRecord(value);
  const url = typeof data.url === "string" ? data.url : "";
  const alt = typeof data.alt === "string" ? data.alt : "";
  const source = data.source === "upload" ? "upload" : "web";

  if (!url) {
    return null;
  }

  return { url, alt, source };
}

function normalizeGeneratedArticle(value: unknown, formData: ArticleFormData): GeneratedArticle {
  const root = asRecord(value);
  const seo = asRecord(root.seo);
  const article = asRecord(root.article);
  const schemaMarkup = asRecord(seo.schemaMarkup);

  const sectionsRaw = Array.isArray(article.sections) ? article.sections : [];
  const faqRaw = Array.isArray(article.faq) ? article.faq : [];
  const featuredImageRecord = asRecord(root.featuredImage);
  const featuredImageUrl =
    typeof featuredImageRecord.url === "string" ? featuredImageRecord.url : "";
  const imageOptionsRaw = Array.isArray(root.imageOptions) ? root.imageOptions : [];
  const imageOptions = imageOptionsRaw
    .map((entry) => normalizeImageOption(entry))
    .filter((entry): entry is ArticleImageOption => Boolean(entry))
    .slice(0, 4);

  const normalizedSections = sectionsRaw.map((entry) => {
    const section = asRecord(entry);
    const h3sRaw = Array.isArray(section.h3s) ? section.h3s : [];

    return {
      h2: typeof section.h2 === "string" ? section.h2 : "Sección",
      content: typeof section.content === "string" ? section.content : "<p>Contenido no disponible.</p>",
      h3s: h3sRaw.map((item) => {
        const nested = asRecord(item);
        return {
          title: typeof nested.title === "string" ? nested.title : "Subsección",
          content:
            typeof nested.content === "string" ? nested.content : "<p>Contenido no disponible.</p>",
        };
      }),
    };
  });

  const normalizedFaq = faqRaw.map((entry) => {
    const faq = asRecord(entry);
    return {
      question: typeof faq.question === "string" ? faq.question : "Pregunta",
      answer: typeof faq.answer === "string" ? faq.answer : "Respuesta no disponible.",
    };
  });

  return {
    seo: {
      title:
        typeof seo.title === "string" && seo.title.trim()
          ? seo.title
          : formData.title,
      metaDescription:
        typeof seo.metaDescription === "string" && seo.metaDescription.trim()
          ? seo.metaDescription
          : formData.metaDescription,
      slug: typeof seo.slug === "string" ? seo.slug : "",
      canonicalUrl:
        typeof seo.canonicalUrl === "string" && seo.canonicalUrl.trim()
          ? seo.canonicalUrl
          : `${window.location.origin}/preview`,
      keywords: asStringArray(seo.keywords),
      ogTitle:
        typeof seo.ogTitle === "string" && seo.ogTitle.trim()
          ? seo.ogTitle
          : (typeof seo.title === "string" ? seo.title : formData.title),
      ogDescription:
        typeof seo.ogDescription === "string" && seo.ogDescription.trim()
          ? seo.ogDescription
          : formData.metaDescription,
      schemaMarkup: {
        "@context":
          schemaMarkup["@context"] === "https://schema.org" ? "https://schema.org" : "https://schema.org",
        "@type": schemaMarkup["@type"] === "Article" ? "Article" : "Article",
        headline:
          typeof schemaMarkup.headline === "string" && schemaMarkup.headline.trim()
            ? schemaMarkup.headline
            : formData.title,
        description:
          typeof schemaMarkup.description === "string" && schemaMarkup.description.trim()
            ? schemaMarkup.description
            : formData.metaDescription,
        author: {
          "@type":
            asRecord(schemaMarkup.author)["@type"] === "Organization" ? "Organization" : "Organization",
          name:
            typeof asRecord(schemaMarkup.author).name === "string" &&
            String(asRecord(schemaMarkup.author).name).trim()
              ? String(asRecord(schemaMarkup.author).name)
              : "Bitzen Mineria",
        },
        datePublished:
          typeof schemaMarkup.datePublished === "string" && schemaMarkup.datePublished.trim()
            ? schemaMarkup.datePublished
            : new Date().toISOString(),
        keywords: asStringArray(schemaMarkup.keywords),
      },
    },
    article: {
      h1:
        typeof article.h1 === "string" && article.h1.trim()
          ? article.h1
          : formData.title,
      introduction:
        typeof article.introduction === "string" && article.introduction.trim()
          ? article.introduction
          : "<p>Introducción no disponible.</p>",
      sections: normalizedSections,
      conclusion:
        typeof article.conclusion === "string" && article.conclusion.trim()
          ? article.conclusion
          : "<p>Conclusión no disponible.</p>",
      faq: normalizedFaq,
    },
    internalLinkingSuggestions: asStringArray(root.internalLinkingSuggestions).length
      ? asStringArray(root.internalLinkingSuggestions)
      : asStringArray(root.internalLinks),
    imageAltSuggestions: asStringArray(root.imageAltSuggestions).length
      ? asStringArray(root.imageAltSuggestions)
      : asStringArray(root.imageAltTexts),
    imageSearchQuery:
      typeof root.imageSearchQuery === "string" && root.imageSearchQuery.trim()
        ? root.imageSearchQuery
        : "",
    featuredImage: featuredImageUrl
      ? {
          url: featuredImageUrl,
          alt: typeof featuredImageRecord.alt === "string" ? featuredImageRecord.alt : "",
          source: featuredImageRecord.source === "upload" ? "upload" : "web",
        }
      : undefined,
    imageOptions,
    createdAt:
      typeof root.createdAt === "string" && root.createdAt.trim()
        ? root.createdAt
        : new Date().toISOString(),
  };
}

function parseGeneratedArticleJson(raw: string, formData: ArticleFormData): GeneratedArticle {
  const normalized = raw.replace(/```json|```/gi, "").trim();

  try {
    return normalizeGeneratedArticle(JSON.parse(normalized), formData);
  } catch {
    const firstBrace = normalized.indexOf("{");
    const lastBrace = normalized.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Missing JSON boundaries");
    }

    const extracted = normalized.slice(firstBrace, lastBrace + 1).trim();
    return normalizeGeneratedArticle(JSON.parse(extracted), formData);
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Invalid file data"));
    };
    reader.onerror = () => reject(new Error("Cannot read file"));
    reader.readAsDataURL(file);
  });
}

function isValidImageUrl(url: string): boolean {
  if (!url.trim()) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function ArticleForm() {
  const articles = useArticleStore((state) => state.articles);
  const addArticle = useArticleStore((state) => state.addArticle);
  const setIsGenerating = useArticleStore((state) => state.setIsGenerating);
  const isGenerating = useArticleStore((state) => state.isGenerating);

  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState("");
  const [generatedSlug, setGeneratedSlug] = useState("");
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [pendingArticle, setPendingArticle] = useState<GeneratedArticle | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [requiresImageUpload, setRequiresImageUpload] = useState(false);
  const [showPublishToast, setShowPublishToast] = useState(false);
  const [formColumnHeight, setFormColumnHeight] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formColumnRef = useRef<HTMLDivElement | null>(null);

  const articleUrl = useMemo(
    () => (generatedSlug ? `${ROUTES.preview}/${generatedSlug}` : ""),
    [generatedSlug],
  );

  useEffect(() => {
    const target = formColumnRef.current;
    if (!target || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateHeight = () => {
      setFormColumnHeight(Math.ceil(target.getBoundingClientRect().height));
    };

    updateHeight();
    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleFieldChange =
    (field: keyof ArticleFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setUploadedImageFile(file);
  };

  async function checkTitleExists(title: string) {
    const normalized = title.trim().toLowerCase();
    const localDuplicate = articles.some((entry) => entry.seo.title.trim().toLowerCase() === normalized);
    if (localDuplicate) {
      return true;
    }

    const response = await fetch("/api/article-exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { exists: boolean };
    return Boolean(data.exists);
  }

  async function saveArticle(article: GeneratedArticle, status: "draft" | "published") {
    const response = await fetch("/api/save-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article, status }),
    });

    if (!response.ok) {
      throw new Error(ERROR_TEXT.saveFailed);
    }
  }

  async function applyUploadedImageToPendingArticle() {
    if (!pendingArticle || !uploadedImageFile) {
      setError(UI_TEXT.imageUploadRequiredError);
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(uploadedImageFile);
      const updatedArticle: GeneratedArticle = {
        ...pendingArticle,
        featuredImage: {
          url: imageDataUrl,
          alt: pendingArticle.imageAltSuggestions[0] || uploadedImageFile.name,
          source: "upload",
        },
      };

      await saveArticle(updatedArticle, "draft");
      setPendingArticle(updatedArticle);
      setRequiresImageUpload(false);
      setError("");
    } catch {
      setError(ERROR_TEXT.saveFailed);
    }
  }

  async function applyClaudeImageOption(option: ArticleImageOption) {
    if (!pendingArticle) {
      return;
    }

    const selectedOption: ArticleImageOption = {
      ...option,
      source: "web",
      alt: option.alt || pendingArticle.imageAltSuggestions[0] || pendingArticle.seo.title,
    };

    const updatedArticle: GeneratedArticle = {
      ...pendingArticle,
      featuredImage: selectedOption,
    };

    try {
      await saveArticle(updatedArticle, "draft");
      setPendingArticle(updatedArticle);
    } catch {
      setError(ERROR_TEXT.saveFailed);
    }
  }

  async function generateArticle() {
    setError("");
    setStreamedText("");
    setGeneratedSlug("");
    setPendingArticle(null);
    setIsPublished(false);
    setRequiresImageUpload(false);
    setShowPublishToast(false);

    if (!formData.title.trim() || !formData.metaDescription.trim()) {
      setError(ERROR_TEXT.requiredFields);
      return;
    }

    const duplicateTitle = await checkTitleExists(formData.title);
    if (duplicateTitle) {
      setError(UI_TEXT.duplicateTitleError);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok || !response.body) {
        throw new Error(ERROR_TEXT.generationFailed);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamedText(fullText);
      }

      let parsed: GeneratedArticle;
      try {
        parsed = parseGeneratedArticleJson(fullText, formData);
      } catch {
        throw new Error(ERROR_TEXT.invalidJson);
      }
      const fallbackSlug = createSlug(parsed.seo.slug || parsed.seo.title || formData.title);

      parsed = {
        ...parsed,
        seo: { ...parsed.seo, slug: fallbackSlug },
        createdAt: parsed.createdAt || new Date().toISOString(),
      };

      if (uploadedImageFile) {
        const imageDataUrl = await readFileAsDataUrl(uploadedImageFile);
        parsed = {
          ...parsed,
          featuredImage: {
            url: imageDataUrl,
            alt: parsed.imageAltSuggestions[0] || uploadedImageFile.name,
            source: "upload",
          },
          imageOptions: [],
        };
        setRequiresImageUpload(false);
      } else {
        const optionsFromJson = (parsed.imageOptions ?? []).filter((option) => isValidImageUrl(option.url));
        const featuredFromJson =
          parsed.featuredImage && isValidImageUrl(parsed.featuredImage.url)
            ? ({
                ...parsed.featuredImage,
                source: "web",
              } as ArticleImageOption)
            : null;

        const mergedOptions = [...optionsFromJson];
        if (featuredFromJson && !mergedOptions.some((option) => option.url === featuredFromJson.url)) {
          mergedOptions.unshift(featuredFromJson);
        }

        const limitedOptions = mergedOptions.slice(0, 4);

        if (limitedOptions.length === 0) {
          setPendingArticle(parsed);
          setRequiresImageUpload(true);
          setError(UI_TEXT.imageUploadRequiredError);
          return;
        }

        const selectedOption = limitedOptions[0];
        parsed = {
          ...parsed,
          featuredImage: {
            ...selectedOption,
            alt: selectedOption.alt || parsed.imageAltSuggestions[0] || parsed.seo.title,
            source: "web",
          },
          imageOptions: limitedOptions,
        };
        setRequiresImageUpload(false);
      }

      try {
        await saveArticle(parsed, "draft");
      } catch (saveError) {
        console.error("Draft save failed", saveError);
        setError(ERROR_TEXT.saveFailed);
      }
      setPendingArticle(parsed);
      setRequiresImageUpload(false);
    } catch (generationError) {
      if (generationError instanceof Error && generationError.message === ERROR_TEXT.invalidJson) {
        setError(ERROR_TEXT.invalidJson);
      } else {
        setError(ERROR_TEXT.generationFailed);
      }
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleApproveAndPublish() {
    if (!pendingArticle) {
      return;
    }

    if (requiresImageUpload || !pendingArticle.featuredImage?.url) {
      setError(UI_TEXT.imageRequiredForPublish);
      return;
    }

    try {
      await saveArticle(pendingArticle, "published");
      addArticle(pendingArticle);
      setGeneratedSlug(pendingArticle.seo.slug);
      setIsPublished(true);
      setShowPublishToast(true);
      setTimeout(() => {
        setShowPublishToast(false);
      }, 2600);
    } catch {
      setError(ERROR_TEXT.saveFailed);
    }
  }

  async function handleRegenerate() {
    await generateArticle();
  }

  async function handleImproveSeo(failedChecks: SeoCheckItem[]) {
    if (!pendingArticle || failedChecks.length === 0) return;

    setError("");
    setStreamedText("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/improve-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: pendingArticle, failedChecks }),
      });

      if (!response.ok || !response.body) {
        throw new Error(ERROR_TEXT.generationFailed);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setStreamedText(fullText);
      }

      let improved: GeneratedArticle;
      try {
        improved = parseGeneratedArticleJson(fullText, formData);
      } catch {
        throw new Error(ERROR_TEXT.invalidJson);
      }

      improved = {
        ...improved,
        seo: { ...improved.seo, slug: createSlug(improved.seo.slug || improved.seo.title || formData.title) },
        // Keep the existing featured image from the original article
        featuredImage: improved.featuredImage?.url ? improved.featuredImage : pendingArticle.featuredImage,
        imageOptions: improved.imageOptions?.length ? improved.imageOptions : pendingArticle.imageOptions,
      };

      try {
        await saveArticle(improved, "draft");
      } catch {
        // non-blocking
      }
      setPendingArticle(improved);
    } catch {
      setError(ERROR_TEXT.generationFailed);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await generateArticle();
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="font-heading text-4xl font-bold text-hero-text md:text-5xl">{UI_TEXT.adminTitle}</h1>
        <p className="text-base text-muted-foreground">{UI_TEXT.adminDescription}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div ref={formColumnRef}>
          <Card>
            <form className="grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">{UI_TEXT.fieldTitle}</span>
              <Input
                required
                maxLength={DEMO_LIMITS.TITLE_MAX_LENGTH}
                value={formData.title}
                onChange={handleFieldChange("title")}
                placeholder={UI_TEXT.placeholderTitle}
              />
              <p className="text-right text-xs text-muted-foreground">
                {formData.title.length}/{DEMO_LIMITS.TITLE_MAX_LENGTH}
              </p>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">{UI_TEXT.fieldMetaDescription}</span>
              <Input
                required
                maxLength={DEMO_LIMITS.META_DESC_MAX_LENGTH}
                value={formData.metaDescription}
                onChange={handleFieldChange("metaDescription")}
                placeholder={UI_TEXT.placeholderMetaDescription}
              />
              <p className="text-right text-xs text-muted-foreground">
                {formData.metaDescription.length}/{DEMO_LIMITS.META_DESC_MAX_LENGTH}
              </p>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">{UI_TEXT.fieldObservations}</span>
              <Textarea
                rows={6}
                maxLength={DEMO_LIMITS.OBSERVATIONS_MAX_LENGTH}
                value={formData.observations}
                onChange={handleFieldChange("observations")}
                placeholder={UI_TEXT.placeholderObservations}
              />
              <p className="text-right text-xs text-muted-foreground">
                {formData.observations.length}/{DEMO_LIMITS.OBSERVATIONS_MAX_LENGTH}
              </p>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">{UI_TEXT.fieldImage}</span>
              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                type="file"
              />
              <div className="grid gap-2 rounded-md border border-input bg-transparent p-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  variant="secondary"
                >
                  {UI_TEXT.imageUploadButton}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {uploadedImageFile ? uploadedImageFile.name : UI_TEXT.imageUploadEmpty}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{UI_TEXT.imageUploadHint}</p>
              <p className="text-right text-xs text-muted-foreground">
                {uploadedImageFile ? UI_TEXT.imageUploadedLabel : UI_TEXT.imageAutoSearchLabel}
              </p>
              {requiresImageUpload ? (
                <Button
                  className="mt-2"
                  disabled={!uploadedImageFile}
                  onClick={applyUploadedImageToPendingArticle}
                  type="button"
                  variant="secondary"
                >
                  {UI_TEXT.imageApplyButton}
                </Button>
              ) : null}
            </label>
            <Button className="inline-flex items-center justify-center gap-2" disabled={isGenerating} type="submit">
              {isGenerating ? (
                <>
                  <LoadingSpinner />
                  {UI_TEXT.generatingButton}
                </>
              ) : (
                UI_TEXT.generateButton
              )}
            </Button>

            {error ? <p className="text-sm text-primary">{error}</p> : null}
            {generatedSlug ? (
              <div className="flex flex-wrap gap-3">
                <Link href={articleUrl}>
                  <Button variant="secondary">{UI_TEXT.viewArticleButton}</Button>
                </Link>
                <Link href={ROUTES.preview}>
                  <Button variant="ghost">{UI_TEXT.viewBlogButton}</Button>
                </Link>
              </div>
            ) : null}
            </form>
          </Card>
        </div>

        <StreamingPreview
          containerHeight={formColumnHeight}
          streamedText={streamedText}
          parsedArticle={pendingArticle}
          isGenerationComplete={!isGenerating && Boolean(streamedText)}
          onImprove={handleImproveSeo}
        />
      </div>

      {pendingArticle ? (
        <Card className="grid gap-6">
          <div className="grid gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">{UI_TEXT.approvalTitle}</h2>
            <p className="text-sm text-muted-foreground">{UI_TEXT.approvalDescription}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <ArticleContent article={pendingArticle} />
          </div>

          {!uploadedImageFile && (pendingArticle.imageOptions?.length ?? 0) > 0 ? (
            <div className="grid gap-4">
              <div className="grid gap-1">
                <h3 className="font-heading text-xl font-semibold text-foreground">{UI_TEXT.imageOptionsTitle}</h3>
                <p className="text-sm text-muted-foreground">{UI_TEXT.imageOptionsDescription}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {pendingArticle.imageOptions?.map((option) => {
                  const isSelected = pendingArticle.featuredImage?.url === option.url;
                  return (
                    <div key={option.url} className="grid gap-2 rounded-md border border-border p-3">
                      <img
                        alt={option.alt || pendingArticle.seo.title}
                        className="h-36 w-full rounded-md border border-border object-cover"
                        src={option.url}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <Button onClick={() => applyClaudeImageOption(option)} type="button" variant="secondary">
                          {UI_TEXT.imageUseOptionButton}
                        </Button>
                        {isSelected ? <span className="text-xs text-muted-foreground">{UI_TEXT.imageSelectedLabel}</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!isPublished ? (
            <div className="flex flex-wrap gap-3">
              <Button disabled={requiresImageUpload} onClick={handleApproveAndPublish}>
                {UI_TEXT.approvePublishButton}
              </Button>
              <Button onClick={handleRegenerate} variant="ghost">
                {UI_TEXT.regenerateButton}
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      <div
        className={`fixed bottom-6 right-6 z-50 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-all duration-300 ease-in-out ${
          showPublishToast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {UI_TEXT.publishSuccessToast}
      </div>
    </section>
  );
}
