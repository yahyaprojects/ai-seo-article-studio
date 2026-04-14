"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiCopy, FiDownload, FiStar, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UI_TEXT } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface SeoCheckItem {
  label: string;
  detail: string;
  passed: boolean;
}

/* ─── JSON syntax highlighter ─────────────────────────────────────────────── */

function highlightJson(text: string): string {
  if (!text.trim()) return "";

  // Escape HTML-dangerous chars (keep quotes intact for regex)
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Capture: (string)(optional colon) | boolean/null | number
  return safe.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (_, str, colon, keyword, num) => {
      if (str !== undefined) {
        // JSON key (string followed by colon)
        if (colon) {
          return `<span style="color:#9cdcfe">${str}</span><span style="color:#6b7280">${colon}</span>`;
        }
        // String value
        return `<span style="color:#ce9178">${str}</span>`;
      }
      if (keyword !== undefined) {
        return `<span style="color:#4fc1ff">${keyword}</span>`;
      }
      if (num !== undefined) {
        return `<span style="color:#b5cea8">${num}</span>`;
      }
      return _;
    },
  );
}

/* ─── SEO check logic ─────────────────────────────────────────────────────── */

function runSeoChecks(article: GeneratedArticle): SeoCheckItem[] {
  const focusKeyword = article.seo.keywords[0] ?? "";
  const kw = focusKeyword.toLowerCase();

  return [
    {
      label: "Meta title ≤ 60 caracteres",
      detail: `${article.seo.title.length} caracteres`,
      passed: article.seo.title.length <= 60,
    },
    {
      label: "Meta description ≤ 160 caracteres",
      detail: `${article.seo.metaDescription.length} caracteres`,
      passed: article.seo.metaDescription.length <= 160,
    },
    {
      label: "Keyword principal en el título",
      detail: focusKeyword ? `"${focusKeyword}"` : "Sin keyword definida",
      passed: Boolean(kw && article.seo.title.toLowerCase().includes(kw)),
    },
    {
      label: "Keyword principal en la meta description",
      detail: focusKeyword ? `"${focusKeyword}"` : "Sin keyword definida",
      passed: Boolean(kw && article.seo.metaDescription.toLowerCase().includes(kw)),
    },
    {
      label: "Keyword principal en el H1",
      detail: focusKeyword ? `"${focusKeyword}"` : "Sin keyword definida",
      passed: Boolean(kw && article.article.h1.toLowerCase().includes(kw)),
    },
    {
      label: "Slug optimizado (≤ 60 caracteres)",
      detail: `/${article.seo.slug}`,
      passed: article.seo.slug.length > 0 && article.seo.slug.length <= 60,
    },
    {
      label: "Al menos 3 secciones H2",
      detail: `${article.article.sections.length} secciones`,
      passed: article.article.sections.length >= 3,
    },
    {
      label: "FAQ para featured snippets",
      detail: `${article.article.faq.length} preguntas`,
      passed: article.article.faq.length > 0,
    },
    {
      label: "Mínimo 3 keywords definidas",
      detail: `${article.seo.keywords.length} keywords`,
      passed: article.seo.keywords.length >= 3,
    },
    {
      label: "OG Title y OG Description presentes",
      detail: article.seo.ogTitle ? `"${article.seo.ogTitle.slice(0, 30)}…"` : "Ausentes",
      passed: Boolean(article.seo.ogTitle && article.seo.ogDescription),
    },
    {
      label: "Schema markup JSON-LD",
      detail: article.seo.schemaMarkup?.["@type"] ? "Article schema presente" : "Ausente",
      passed: Boolean(article.seo.schemaMarkup?.["@type"]),
    },
    {
      label: "Sugerencias de enlaces internos",
      detail: `${article.internalLinkingSuggestions.length} sugerencias`,
      passed: article.internalLinkingSuggestions.length > 0,
    },
    {
      label: "Alt text sugerido para imágenes",
      detail: `${article.imageAltSuggestions.length} textos alt`,
      passed: article.imageAltSuggestions.length > 0,
    },
    {
      label: "Imagen destacada en formato WebP",
      detail: article.featuredImage
        ? article.featuredImage.url.startsWith("data:image/webp") ||
          article.featuredImage.url.toLowerCase().includes(".webp")
          ? "Formato WebP confirmado ✓"
          : "La imagen pública no está en WebP — convertir para mejor rendimiento"
        : "Sin imagen destacada asignada todavía",
      passed: Boolean(
        article.featuredImage?.url &&
          (article.featuredImage.url.startsWith("data:image/webp") ||
            article.featuredImage.url.toLowerCase().includes(".webp")),
      ),
    },
  ];
}

/* ─── Tooltip wrapper ─────────────────────────────────────────────────────── */

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      {/* Below the control: parent uses overflow-hidden, so top-positioned tips get clipped */}
      <span
        className="pointer-events-none absolute right-0 top-full z-[2147483647] mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */

interface StreamingPreviewProps {
  streamedText: string;
  containerHeight?: number | null;
  parsedArticle?: GeneratedArticle | null;
  isGenerationComplete?: boolean;
  generationDurationMs?: number | null;
  onImprove?: (failedChecks: SeoCheckItem[]) => void;
}

export function StreamingPreview({
  streamedText,
  containerHeight,
  parsedArticle,
  isGenerationComplete,
  generationDurationMs,
  onImprove,
}: StreamingPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"json" | "checklist">("json");
  const [visibleChecks, setVisibleChecks] = useState<SeoCheckItem[]>([]);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [checksComplete, setChecksComplete] = useState(false);
  const [wasImproving, setWasImproving] = useState(false);

  const canExport = Boolean(streamedText.trim());
  const canUseChecklistTab = Boolean(isGenerationComplete);

  // Memoised highlighted JSON — only recomputes when generation completes or text changes
  const highlightedJson = useMemo(() => {
    if (!isGenerationComplete || !streamedText.trim()) return null;
    return highlightJson(streamedText);
  }, [isGenerationComplete, streamedText]);

  /* ── Core checklist runner ──────────────────────────────────────────────── */

  function runChecklist(article: GeneratedArticle) {
    setActiveTab("checklist");
    setVisibleChecks([]);
    setChecksComplete(false);
    setIsRunningChecks(true);

    const checks = runSeoChecks(article);
    checks.forEach((check, i) => {
      setTimeout(() => {
        setVisibleChecks((prev) => [...prev, check]);
        if (i === checks.length - 1) {
          setIsRunningChecks(false);
          setChecksComplete(true);
        }
      }, i * 380);
    });
  }

  function startSeoValidation() {
    if (!parsedArticle) return;
    runChecklist(parsedArticle);
  }

  /* ── Reset when generation starts / detect improvement ─────────────────── */

  useEffect(() => {
    if (!isGenerationComplete) {
      // Track if we were showing a completed checklist when generation restarted
      if (checksComplete) setWasImproving(true);
      setVisibleChecks([]);
      setChecksComplete(false);
      setIsRunningChecks(false);
      setActiveTab("json");
    }
  }, [isGenerationComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Auto-rerun checklist after improvement ─────────────────────────────── */

  useEffect(() => {
    if (isGenerationComplete && wasImproving && parsedArticle) {
      setWasImproving(false);
      const t = setTimeout(() => runChecklist(parsedArticle), 700);
      return () => clearTimeout(t);
    }
  }, [isGenerationComplete, wasImproving, parsedArticle]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── JSON actions ───────────────────────────────────────────────────────── */

  async function handleCopyJson() {
    if (!canExport) return;
    try {
      await navigator.clipboard.writeText(streamedText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // silent
    }
  }

  function handleDownloadJson() {
    if (!canExport) return;
    const blob = new Blob([streamedText], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "article-seo.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ── Derived values ─────────────────────────────────────────────────────── */

  const score =
    checksComplete && visibleChecks.length > 0
      ? Math.round((visibleChecks.filter((c) => c.passed).length / visibleChecks.length) * 100)
      : null;

  const scoreColor =
    score === null ? "" : score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-500" : "text-primary";

  const scoreBarColor =
    score === null ? "" : score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-400" : "bg-primary";

  const scoreLabel =
    score === null
      ? ""
      : score >= 80
        ? "Excelente — listo para publicar"
        : score >= 60
          ? "Bien, pero hay margen de mejora"
          : "Necesita revisión antes de publicar";

  const failedChecks = visibleChecks.filter((c) => !c.passed);
  const canImprove = checksComplete && score !== null && score < 100 && Boolean(onImprove);
  const generationDurationLabel =
    typeof generationDurationMs === "number" && Number.isFinite(generationDurationMs)
      ? `${(generationDurationMs / 1000).toFixed(generationDurationMs >= 10_000 ? 1 : 2)}s`
      : null;

  /* ─────────────────────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────────────────────── */

  return (
    <>
      <style>{`
        @keyframes checkItemIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .check-item-enter { animation: checkItemIn 0.3s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      <Card
        className="flex min-h-0 flex-col overflow-hidden"
        style={containerHeight ? { height: `${containerHeight}px` } : undefined}
      >
        {/* ── Header ── */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {UI_TEXT.streamPreviewTitle}
          </h2>
        </div>

        {/* ── Tab bar ── */}
        <div className="mb-4 flex gap-1 rounded-lg border border-border bg-secondary/40 p-1">
          <button
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "json" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("json")}
            type="button"
          >
            JSON Preview
          </button>
          <button
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              activeTab === "checklist"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            disabled={!canUseChecklistTab}
            onClick={() => setActiveTab("checklist")}
            title={
              canUseChecklistTab
                ? undefined
                : "Disponible cuando termine la generación del JSON"
            }
            type="button"
          >
            SEO Checklist
            {checksComplete && score !== null && (
              <span className={`font-bold ${scoreColor}`}>{score}</span>
            )}
          </button>
        </div>

        {/* ════════════════════════════════════════════
            JSON TAB
        ════════════════════════════════════════════ */}
        {activeTab === "json" && (
          <>
            {/* Dark code container */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/6">
              {/* ── Sticky icon buttons ── */}
              <div className="absolute right-2 top-2 z-10 flex gap-1.5">
                <Tooltip label={copied ? "Copiado" : "Copiar"}>
                  <button
                    disabled={!canExport}
                    aria-label={copied ? "Copiado" : "Copiar"}
                    onClick={handleCopyJson}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-gray-400 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:opacity-30"
                    type="button"
                  >
                    {copied ? (
                      <FiCheck className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <FiCopy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </Tooltip>
                <Tooltip label="Descargar">
                  <button
                    disabled={!canExport}
                    aria-label="Descargar"
                    onClick={handleDownloadJson}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-gray-400 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:opacity-30"
                    type="button"
                  >
                    <FiDownload className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
              </div>

              {/* ── JSON content ── */}
              <div
                className="h-full overflow-y-auto overflow-x-hidden [scrollbar-color:#333_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10"
                style={{ background: "var(--background)" }}
              >
                {highlightedJson ? (
                  <pre
                    className="min-h-full p-4 pt-10 font-mono text-sm leading-relaxed"
                    style={{ color: "#d4d4d8" }}
                    dangerouslySetInnerHTML={{ __html: highlightedJson }}
                  />
                ) : (
                  <pre
                    className="min-h-full whitespace-pre-wrap p-4 pt-10 font-mono text-sm leading-relaxed"
                    style={{ color: streamedText ? "#d4d4d8" : "#6b7280" }}
                  >
                    {streamedText || UI_TEXT.streamPreviewFallback}
                  </pre>
                )}
              </div>
            </div>

            {isGenerationComplete && generationDurationLabel ? (
              <p className="mt-3 text-xs text-muted-foreground">Tiempo de generación: {generationDurationLabel}</p>
            ) : null}

            {/* Audit button below JSON */}
            {isGenerationComplete && parsedArticle ? (
              <div className="mt-4">
                <Button
                  className="w-full inline-flex items-center justify-center gap-2"
                  onClick={startSeoValidation}
                  type="button"
                  variant="secondary"
                >
                  Auditar calidad SEO
                </Button>
              </div>
            ) : null}
          </>
        )}

        {/* ════════════════════════════════════════════
            CHECKLIST TAB
        ════════════════════════════════════════════ */}
        {activeTab === "checklist" && (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-border bg-background p-4 [scrollbar-color:var(--secondary)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary">
            {visibleChecks.length === 0 && !isRunningChecks ? (
              <p className="text-sm text-muted-foreground">
                {parsedArticle
                  ? "Haz clic en «Auditar calidad SEO» para comenzar el análisis."
                  : "Genera un artículo primero para poder validar el SEO."}
              </p>
            ) : (
              <ul className="grid gap-2">
                {visibleChecks.map((check, i) => (
                  <li
                    key={i}
                    className="check-item-enter flex items-start gap-3 rounded-md border border-border p-3 text-sm"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                        check.passed ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {check.passed ? <FiCheck className="h-3 w-3" /> : <FiX className="h-3 w-3" />}
                    </span>
                    <div className="grid gap-0.5">
                      <span className="font-medium text-foreground">{check.label}</span>
                      <span className="text-xs text-muted-foreground">{check.detail}</span>
                    </div>
                  </li>
                ))}

                {isRunningChecks && (
                  <li className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                    </span>
                    <span className="text-muted-foreground">Analizando…</span>
                  </li>
                )}
              </ul>
            )}

            {/* ── Score card ── */}
            {checksComplete && score !== null && (
              <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-5 text-center">
                <p className="text-sm text-muted-foreground">Puntuación SEO</p>
                <p className={`font-heading text-5xl font-bold ${scoreColor}`}>
                  {score}
                  <span className="text-2xl font-normal">/100</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{scoreLabel}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {/* Perfeccionar SEO — only when score < 100 */}
                  {canImprove && (
                    <Button
                      className="w-full inline-flex items-center justify-center gap-2"
                      onClick={() => onImprove!(failedChecks)}
                      type="button"
                    >
                      <FiStar className="h-4 w-4" />
                      Perfeccionar SEO con IA
                    </Button>
                  )}

                  <Button
                    className="w-full inline-flex items-center justify-center gap-2"
                    onClick={startSeoValidation}
                    type="button"
                    variant="secondary"
                  >
                    Repetir análisis
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
