"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiCopy, FiDownload, FiX } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UI_TEXT } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";

/* ─── SEO Check Logic ─────────────────────────────────────────────────────── */

interface SeoCheckItem {
  label: string;
  detail: string;
  passed: boolean;
}

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
  ];
}

/* ─── Component ───────────────────────────────────────────────────────────── */

interface StreamingPreviewProps {
  streamedText: string;
  containerHeight?: number | null;
  parsedArticle?: GeneratedArticle | null;
  isGenerationComplete?: boolean;
}

export function StreamingPreview({
  streamedText,
  containerHeight,
  parsedArticle,
  isGenerationComplete,
}: StreamingPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"json" | "checklist">("json");
  const [visibleChecks, setVisibleChecks] = useState<SeoCheckItem[]>([]);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [checksComplete, setChecksComplete] = useState(false);

  const canExport = Boolean(streamedText.trim());

  // Reset checklist state when a new generation starts
  useEffect(() => {
    if (!isGenerationComplete) {
      setVisibleChecks([]);
      setChecksComplete(false);
      setIsRunningChecks(false);
      setActiveTab("json");
    }
  }, [isGenerationComplete]);

  async function handleCopyJson() {
    if (!canExport) return;
    try {
      await navigator.clipboard.writeText(streamedText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Intentionally silent
    }
  }

  function handleDownloadJson() {
    if (!canExport) return;
    const blob = new Blob([streamedText], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "article-preview.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function startSeoValidation() {
    if (!parsedArticle) return;
    setActiveTab("checklist");
    setVisibleChecks([]);
    setChecksComplete(false);
    setIsRunningChecks(true);

    const checks = runSeoChecks(parsedArticle);
    checks.forEach((check, index) => {
      setTimeout(() => {
        setVisibleChecks((prev) => [...prev, check]);
        if (index === checks.length - 1) {
          setIsRunningChecks(false);
          setChecksComplete(true);
        }
      }, index * 380);
    });
  }

  const score =
    checksComplete && visibleChecks.length > 0
      ? Math.round((visibleChecks.filter((c) => c.passed).length / visibleChecks.length) * 100)
      : null;

  const scoreColor =
    score === null
      ? ""
      : score >= 80
        ? "text-green-600"
        : score >= 60
          ? "text-yellow-500"
          : "text-primary";

  const scoreLabel =
    score === null
      ? ""
      : score >= 80
        ? "Excelente — listo para publicar"
        : score >= 60
          ? "Bien, pero hay margen de mejora"
          : "Necesita revisión antes de publicar";

  return (
    <>
      {/* Keyframe animation for checklist items */}
      <style>{`
        @keyframes checkItemIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .check-item-enter {
          animation: checkItemIn 0.3s ease forwards;
        }
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

          {activeTab === "json" && (
            <div className="flex items-center gap-2">
              <Button
                aria-label="Copy JSON to clipboard"
                className="h-10 px-3"
                disabled={!canExport}
                onClick={handleCopyJson}
                title="Copy JSON"
                type="button"
                variant="secondary"
              >
                {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
              </Button>
              <Button
                aria-label="Download JSON file"
                className="inline-flex items-center gap-2"
                disabled={!canExport}
                onClick={handleDownloadJson}
                title="Download JSON"
                type="button"
                variant="secondary"
              >
                <FiDownload className="h-4 w-4" />
                JSON
              </Button>
            </div>
          )}
        </div>

        {/* ── Tab Bar ── */}
        <div className="mb-4 flex gap-1 rounded-lg border border-border bg-secondary/40 p-1">
          <button
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "json"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("json")}
            type="button"
          >
            JSON Preview
          </button>
          <button
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "checklist"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("checklist")}
            type="button"
          >
            SEO Checklist
            {checksComplete && score !== null && (
              <span className={`font-bold ${scoreColor}`}>{score}</span>
            )}
          </button>
        </div>

        {/* ── JSON Tab ── */}
        {activeTab === "json" && (
          <>
            <pre className="h-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden whitespace-pre-wrap wrap-break-word rounded-md border border-border bg-background p-4 font-mono text-sm [scrollbar-width:thin] [scrollbar-color:var(--secondary)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary [&::-webkit-scrollbar-thumb:hover]:bg-accent">
              {streamedText || UI_TEXT.streamPreviewFallback}
            </pre>

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

        {/* ── Checklist Tab ── */}
        {activeTab === "checklist" && (
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto rounded-md border border-border bg-background p-4 [scrollbar-width:thin] [scrollbar-color:var(--secondary)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-secondary [&::-webkit-scrollbar-thumb:hover]:bg-accent">
            {visibleChecks.length === 0 && !isRunningChecks ? (
              <p className="text-sm text-muted-foreground">
                {parsedArticle
                  ? "Haz clic en «Auditar calidad SEO» para comenzar el análisis."
                  : "Genera un artículo primero para poder validar el SEO."}
              </p>
            ) : (
              <ul className="grid gap-2">
                {visibleChecks.map((check, index) => (
                  <li
                    key={index}
                    className="check-item-enter flex items-start gap-3 rounded-md border border-border p-3 text-sm"
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                        check.passed ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {check.passed ? (
                        <FiCheck className="h-3 w-3" />
                      ) : (
                        <FiX className="h-3 w-3" />
                      )}
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

            {/* ── Score Card ── */}
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
                    className={`h-full rounded-full transition-all duration-700 ${
                      score >= 80
                        ? "bg-green-500"
                        : score >= 60
                          ? "bg-yellow-400"
                          : "bg-primary"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <Button
                  className="mt-4 inline-flex items-center justify-center gap-2"
                  onClick={startSeoValidation}
                  type="button"
                  variant="secondary"
                >
                  Repetir análisis
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
}