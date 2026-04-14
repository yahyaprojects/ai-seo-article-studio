import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { APP_CONFIG, DEMO_LIMITS, ERROR_TEXT } from "@/lib/constants";
import type { GeneratedArticle } from "@/lib/types";

interface FailedCheck {
  label: string;
  detail: string;
}

interface ImprovePayload {
  article?: GeneratedArticle;
  failedChecks?: FailedCheck[];
}

function buildImprovePrompt(article: GeneratedArticle, failedChecks: FailedCheck[]): string {
  const lines = failedChecks.map((c) => `• ${c.label}: ${c.detail}`).join("\n");

  const rules: string[] = [];
  const hasTitle = failedChecks.some((c) => c.label.includes("title"));
  const hasDesc = failedChecks.some((c) => c.label.includes("description"));
  const hasSlug = failedChecks.some((c) => c.label.includes("slug") || c.label.includes("Slug"));
  const hasKw = failedChecks.some((c) => c.label.includes("keyword") || c.label.includes("Keyword"));
  const hasH1 = failedChecks.some((c) => c.label.includes("H1"));
  const hasOg = failedChecks.some((c) => c.label.includes("OG"));
  const hasSchema = failedChecks.some((c) => c.label.includes("schema") || c.label.includes("Schema"));
  const hasLinks = failedChecks.some((c) => c.label.includes("internos") || c.label.includes("enlaces"));
  const hasAlt = failedChecks.some((c) => c.label.includes("alt") || c.label.includes("Alt"));
  const hasSections = failedChecks.some((c) => c.label.includes("secciones") || c.label.includes("H2"));
  const hasFaq = failedChecks.some((c) => c.label.includes("FAQ"));

  if (hasTitle)
    rules.push(
      "• seo.title: exactamente 55-60 caracteres. Debe contener keywords[0] de forma literal.",
    );
  if (hasDesc)
    rules.push(
      "• seo.metaDescription: exactamente 150-160 caracteres. Debe contener keywords[0] de forma literal.",
    );
  if (hasSlug)
    rules.push(
      "• seo.slug: máximo 60 caracteres, máximo 5-6 palabras con guiones, sin acentos ni caracteres especiales.",
    );
  if (hasKw)
    rules.push(
      "• seo.keywords[]: mínimo 8 elementos. El primer elemento (keywords[0]) es la focus keyword.",
    );
  if (hasH1)
    rules.push("• article.h1: debe contener keywords[0] de forma literal. Puedes reescribir el h1.");
  if (hasOg)
    rules.push(
      "• seo.ogTitle y seo.ogDescription: deben estar presentes y no vacíos. Puedes usar los mismos valores que seo.title y seo.metaDescription.",
    );
  if (hasSchema)
    rules.push(
      '• seo.schemaMarkup: @type debe ser "Article". Completa headline, description, author, datePublished, keywords.',
    );
  if (hasLinks)
    rules.push("• internalLinkingSuggestions: mínimo 3 URLs internas relativas.");
  if (hasAlt)
    rules.push("• imageAltSuggestions: mínimo 3 textos alt descriptivos con la keyword.");
  if (hasSections)
    rules.push("• article.sections: añade secciones hasta tener mínimo 3.");
  if (hasFaq)
    rules.push("• article.faq: añade preguntas FAQ hasta tener mínimo 2.");

  return `Eres un experto SEO. El siguiente artículo JSON ha fallado en criterios de validación SEO automática.

TAREA: Corregir ÚNICAMENTE los campos que fallan. NO cambies article.introduction, article.sections[].content, article.conclusion ni article.faq[].answer salvo que se indique.

FALLOS DETECTADOS:
${lines}

CORRECCIONES REQUERIDAS:
${rules.join("\n")}

REGLA CRÍTICA: keywords[0] DEBE aparecer literalmente en seo.title, seo.metaDescription y article.h1.

Devuelve el JSON COMPLETO con TODAS las claves originales.
No incluyas backticks, markdown ni texto adicional. Solo el JSON.

ARTÍCULO A CORREGIR:
${JSON.stringify(article)}`;
}

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ImprovePayload;

    if (!payload.article || !Array.isArray(payload.failedChecks) || payload.failedChecks.length === 0) {
      return NextResponse.json({ error: "Missing article or failedChecks" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: ERROR_TEXT.missingApiKey }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = anthropic.messages.stream({
      model: APP_CONFIG.model,
      max_tokens: DEMO_LIMITS.MAX_TOKENS,
      messages: [
        {
          role: "user",
          content: buildImprovePrompt(payload.article, payload.failedChecks),
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch {
    return NextResponse.json({ error: ERROR_TEXT.generationFailed }, { status: 500 });
  }
}
