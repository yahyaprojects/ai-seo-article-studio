"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { FiCheck, FiChevronLeft, FiChevronRight, FiImage, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { MdAutoAwesome } from "react-icons/md";

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

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


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

/** Convert a File or same-origin URL to a WebP data URL via canvas. */
function convertToWebP(source: File | string): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = source instanceof File ? URL.createObjectURL(source) : null;
    const src = objectUrl ?? (source as string);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("WebP conversion failed"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve({ dataUrl: reader.result as string, size: blob.size });
          reader.onerror = () => reject(new Error("Could not read blob"));
          reader.readAsDataURL(blob);
        },
        "image/webp",
        0.85,
      );
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image"));
    };

    img.src = src;
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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadStatus, setImageUploadStatus] = useState<"idle" | "uploading" | "completed">("idle");
  const [pendingArticle, setPendingArticle] = useState<GeneratedArticle | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [requiresImageUpload, setRequiresImageUpload] = useState(false);
  const [showPublishToast, setShowPublishToast] = useState(false);
  const [activeImageOptionIndex, setActiveImageOptionIndex] = useState(0);
  const [generationDurationMs, setGenerationDurationMs] = useState<number | null>(null);
  const [formColumnHeight, setFormColumnHeight] = useState<number | null>(null);
  const [webpPhase, setWebpPhase] = useState<"idle" | "reading" | "converting" | "optimizing" | "done" | "error">("idle");
  const [originalFileSize, setOriginalFileSize] = useState<number | null>(null);
  const [convertedFileSize, setConvertedFileSize] = useState<number | null>(null);
  const [convertedWebpUrl, setConvertedWebpUrl] = useState<string | null>(null);
  const [isConvertingWebImages, setIsConvertingWebImages] = useState(false);
  // Tracks which article slugs have already had their web images queued for WebP conversion
  const processedSlugsRef = useRef<Set<string>>(new Set());
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

  const imageOptionsCount = pendingArticle?.imageOptions?.length ?? 0;

  useEffect(() => {
    if (!imageOptionsCount) {
      setActiveImageOptionIndex(0);
      return;
    }
    setActiveImageOptionIndex((current) => Math.min(current, imageOptionsCount - 1));
  }, [imageOptionsCount]);

  useEffect(() => {
    if (!uploadedImageFile) {
      setImagePreviewUrl(null);
      setImageUploadProgress(0);
      setImageUploadStatus("idle");
      setWebpPhase("idle");
      setOriginalFileSize(null);
      setConvertedFileSize(null);
      setConvertedWebpUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedImageFile);
    setImagePreviewUrl(objectUrl);
    setOriginalFileSize(uploadedImageFile.size);
    setConvertedFileSize(null);
    setConvertedWebpUrl(null);

    const isAlreadyWebP =
      uploadedImageFile.type === "image/webp" ||
      uploadedImageFile.name.toLowerCase().endsWith(".webp");

    if (isAlreadyWebP) {
      setImageUploadProgress(100);
      setImageUploadStatus("completed");
      setWebpPhase("done");
      return () => URL.revokeObjectURL(objectUrl);
    }

    // Non-WebP: run phased conversion with real canvas progress
    setImageUploadProgress(5);
    setImageUploadStatus("uploading");
    setWebpPhase("reading");

    let cancelled = false;
    const timers: number[] = [];
    const t = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => { if (!cancelled) fn(); }, delay) as unknown as number;
      timers.push(id);
    };

    t(() => { setWebpPhase("converting"); setImageUploadProgress(28); }, 220);
    t(() => setImageUploadProgress(52), 480);

    convertToWebP(uploadedImageFile)
      .then(({ dataUrl, size }) => {
        if (cancelled) return;
        setWebpPhase("optimizing");
        setImageUploadProgress(80);
        setConvertedWebpUrl(dataUrl);
        setConvertedFileSize(size);
        t(() => {
          setImageUploadProgress(100);
          setImageUploadStatus("completed");
          setWebpPhase("done");
        }, 360);
      })
      .catch(() => {
        if (!cancelled) {
          setWebpPhase("error");
          setImageUploadProgress(100);
          setImageUploadStatus("completed");
        }
      });

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedImageFile]);

  /**
   * After a new article is generated, background-convert every web image option
   * to WebP via the server proxy so the SEO checklist passes immediately.
   * Keyed on the article slug so the effect only fires once per generation.
   */
  useEffect(() => {
    if (!pendingArticle) return;
    const slug = pendingArticle.seo.slug;
    if (!slug || processedSlugsRef.current.has(slug)) return;
    processedSlugsRef.current.add(slug);

    const webOptions = (pendingArticle.imageOptions ?? []).filter((opt) =>
      isValidImageUrl(opt.url) && !opt.url.startsWith("data:"),
    );
    if (webOptions.length === 0) return;

    setIsConvertingWebImages(true);

    const conversions = webOptions.map((opt) => {
      const originalUrl = opt.url;
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
      return convertToWebP(proxyUrl)
        .then(({ dataUrl }) => {
          setPendingArticle((prev) => {
            if (!prev) return prev;
            const newOptions = [...(prev.imageOptions ?? [])];
            const i = newOptions.findIndex((o) => o.url === originalUrl);
            if (i !== -1) newOptions[i] = { ...newOptions[i], url: dataUrl, source: "upload" };
            const newFeatured =
              prev.featuredImage?.url === originalUrl
                ? { ...prev.featuredImage, url: dataUrl, source: "upload" as const }
                : prev.featuredImage;
            return { ...prev, imageOptions: newOptions, featuredImage: newFeatured };
          });
        })
        .catch(() => { /* keep original URL on proxy/conversion failure */ });
    });

    void Promise.allSettled(conversions).then(() => setIsConvertingWebImages(false));
  }, [pendingArticle?.seo.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFieldChange =
    (field: keyof ArticleFormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  function pickImageFile(file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    setUploadedImageFile(file);
  }

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    pickImageFile(event.target.files?.[0]);
  }

  function clearUploadedImage() {
    setUploadedImageFile(null);
    setImageUploadProgress(0);
    setImageUploadStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleImageDragEnter(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.types.includes("Files")) {
      setImageDragActive(true);
    }
  }

  function handleImageDragLeave(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setImageDragActive(false);
    }
  }

  function handleImageDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleImageDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    setImageDragActive(false);
    const dropped = Array.from(event.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (dropped) {
      pickImageFile(dropped);
    }
  }

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
      // Prefer the already-converted WebP blob; fall back to raw data URL
      const imageDataUrl = convertedWebpUrl ?? (await readFileAsDataUrl(uploadedImageFile));
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
    const generationStartedAt = performance.now();
    processedSlugsRef.current.clear(); // reset so the new article's images get converted
    setError("");
    setStreamedText("");
    setGeneratedSlug("");
    setPendingArticle(null);
    setIsPublished(false);
    setRequiresImageUpload(false);
    setShowPublishToast(false);
    setGenerationDurationMs(null);

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
        // Convert to WebP at generation time so the stored URL is always WebP
        let imageDataUrl: string;
        try {
          const result = await convertToWebP(uploadedImageFile);
          imageDataUrl = result.dataUrl;
        } catch {
          imageDataUrl = await readFileAsDataUrl(uploadedImageFile);
        }
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
      setGenerationDurationMs(Math.max(0, Math.round(performance.now() - generationStartedAt)));
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

    const generationStartedAt = performance.now();
    setError("");
    setStreamedText("");
    setIsGenerating(true);
    setGenerationDurationMs(null);

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
      setGenerationDurationMs(Math.max(0, Math.round(performance.now() - generationStartedAt)));
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
            <div className="grid gap-3">
              <span className="text-sm text-muted-foreground">{UI_TEXT.fieldImage}</span>
              <input
                id="article-featured-image-input"
                ref={fileInputRef}
                accept="image/*"
                className="sr-only"
                onChange={handleImageInputChange}
                type="file"
              />

              {!uploadedImageFile ? (
                /* ── Empty state drop zone ── */
                <div
                  className={`relative grid cursor-pointer place-items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
                    imageDragActive
                      ? "border-primary bg-primary/5 scale-[1.01]"
                      : "border-input hover:border-primary/40 hover:bg-secondary/40"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleImageDragEnter}
                  onDragLeave={handleImageDragLeave}
                  onDragOver={handleImageDragOver}
                  onDrop={handleImageDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                >
                  {imageDragActive ? (
                    <>
                      <span className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                        <FiUploadCloud className="h-8 w-8 text-primary" />
                      </span>
                      <p className="text-sm font-semibold text-primary">Drop to upload</p>
                    </>
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <FiUploadCloud className="h-6 w-6 text-muted-foreground" />
                      </span>
                      <div className="grid gap-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-primary">Click to upload</span> or drag &amp; drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP · max 20 MB</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* ── File selected / uploading / ready state ── */
                <div
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    imageDragActive ? "border-primary" : "border-input"
                  }`}
                  onDragEnter={handleImageDragEnter}
                  onDragLeave={handleImageDragLeave}
                  onDragOver={handleImageDragOver}
                  onDrop={handleImageDrop}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/7] bg-secondary">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FiImage className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Status badge */}
                    {imageUploadStatus === "completed" ? (
                      <span
                        className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm ${
                          webpPhase === "error" ? "bg-amber-500/90" : "bg-emerald-500/90"
                        }`}
                      >
                        <FiCheck className="h-3 w-3" />
                        {webpPhase === "error" ? "Original (WebP failed)" : "WebP ✓"}
                      </span>
                    ) : (
                      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-xs text-white/90 backdrop-blur-sm">
                        {webpPhase === "reading" && "Leyendo…"}
                        {webpPhase === "converting" && "→ WebP"}
                        {webpPhase === "optimizing" && "Optimizando…"}
                        {(webpPhase === "idle" || !webpPhase) && "Processing…"}
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label={UI_TEXT.imageRemoveFileAria}
                      title={UI_TEXT.imageRemoveFileAria}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-primary"
                      onClick={clearUploadedImage}
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* File info */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 px-3 py-2">
                      <p className="min-w-0 truncate text-xs font-medium text-white">
                        {uploadedImageFile.name}
                      </p>
                      <span className="shrink-0 text-xs text-white/60">
                        {formatFileSize(uploadedImageFile.size)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 w-full bg-secondary">
                    <div
                      className={`h-full transition-all duration-150 ease-out ${
                        imageUploadStatus === "completed" ? "bg-emerald-500" : "bg-primary"
                      }`}
                      style={{ width: `${imageUploadProgress}%` }}
                    />
                  </div>

                  {/* Drag-to-replace overlay / size-savings strip */}
                  {imageDragActive ? (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary/20 backdrop-blur-[2px]">
                      <p className="text-sm font-semibold text-primary">Drop to replace</p>
                    </div>
                  ) : webpPhase === "done" && originalFileSize && convertedFileSize && convertedFileSize < originalFileSize ? (
                    <div className="flex items-center justify-center gap-2 py-1.5 font-mono text-xs">
                      <span className="text-muted-foreground line-through">{formatFileSize(originalFileSize)}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold text-emerald-500">{formatFileSize(convertedFileSize)}</span>
                      <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-emerald-500">
                        -{Math.round((1 - convertedFileSize / originalFileSize) * 100)}%
                      </span>
                      <span className="rounded bg-primary/10 px-1 py-0.5 text-primary">WebP</span>
                    </div>
                  ) : (
                    <p className="py-1.5 text-center text-xs text-muted-foreground">
                      Drag another image to replace
                    </p>
                  )}
                </div>
              )}

              {requiresImageUpload ? (
                <Button
                  className="mt-1"
                  disabled={!uploadedImageFile}
                  onClick={applyUploadedImageToPendingArticle}
                  type="button"
                  variant="secondary"
                >
                  {UI_TEXT.imageApplyButton}
                </Button>
              ) : null}
            </div>
            <Button className="inline-flex items-center justify-center gap-2" disabled={isGenerating} type="submit">
              {isGenerating ? (
                <>
                  <LoadingSpinner />
                  {UI_TEXT.generatingButton}
                </>
              ) : (
                <>
                  <MdAutoAwesome aria-hidden className="size-5 shrink-0" />
                  {UI_TEXT.generateButton}
                </>
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
          generationDurationMs={generationDurationMs}
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
              <div className="grid gap-3 rounded-xl border border-border bg-card p-3">
                {/* WebP conversion progress banner */}
                {isConvertingWebImages && (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <span className="font-mono">Convirtiendo imágenes a WebP…</span>
                  </div>
                )}
                <div className="relative overflow-hidden rounded-lg border border-border">
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${activeImageOptionIndex * 100}%)` }}
                  >
                    {pendingArticle.imageOptions?.map((option, index) => {
                      // Use index as key so remounting doesn't occur when url changes to data URL
                      const isSelected = pendingArticle.featuredImage?.url === option.url;
                      const isActiveSlide = index === activeImageOptionIndex;
                      const isWebP =
                        option.url.startsWith("data:image/webp") ||
                        option.url.toLowerCase().includes(".webp");
                      return (
                        <div key={index} className="group relative w-full shrink-0">
                          <div className="flex h-80 w-full items-center justify-center bg-secondary/50 md:h-[26rem] lg:h-[30rem]">
                            <img
                              alt={option.alt || pendingArticle.seo.title}
                              className="max-h-full w-full object-contain object-center"
                              src={option.url}
                            />
                          </div>
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          {/* WebP badge */}
                          {isWebP && (
                            <span className="absolute right-3 top-3 rounded bg-emerald-500/90 px-1.5 py-0.5 font-mono text-xs font-semibold text-white backdrop-blur-sm">
                              WebP ✓
                            </span>
                          )}
                          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                            <Button
                              className={`transition-opacity duration-200 ${isActiveSlide ? "opacity-0 group-hover:opacity-100" : "pointer-events-none opacity-0"}`}
                              disabled={!isActiveSlide}
                              onClick={() => applyClaudeImageOption(option)}
                              type="button"
                              variant="secondary"
                            >
                              Seleccionar imagen
                            </Button>
                            {isSelected ? (
                              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white">
                                {UI_TEXT.imageSelectedLabel}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {imageOptionsCount > 1 ? (
                    <>
                      <button
                        aria-label="Imagen anterior"
                        className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                        onClick={() =>
                          setActiveImageOptionIndex((current) =>
                            current === 0 ? imageOptionsCount - 1 : current - 1,
                          )
                        }
                        type="button"
                      >
                        <FiChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Imagen siguiente"
                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                        onClick={() =>
                          setActiveImageOptionIndex((current) =>
                            current === imageOptionsCount - 1 ? 0 : current + 1,
                          )
                        }
                        type="button"
                      >
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : null}
                </div>

                {imageOptionsCount > 1 ? (
                  <div className="flex items-center justify-center gap-2">
                    {pendingArticle.imageOptions?.map((option, index) => (
                      <button
                        key={option.url}
                        aria-label={`Ver imagen ${index + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          index === activeImageOptionIndex ? "bg-primary" : "bg-border hover:bg-muted-foreground"
                        }`}
                        onClick={() => setActiveImageOptionIndex(index)}
                        type="button"
                      />
                    ))}
                  </div>
                ) : null}
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
