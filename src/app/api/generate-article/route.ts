import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { APP_CONFIG, DEMO_LIMITS, ERROR_TEXT } from "@/lib/constants";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import type { ArticleFormData } from "@/lib/types";

export const maxDuration = 60;

function isValidPayload(value: Partial<ArticleFormData>): value is ArticleFormData {
  return Boolean(value.title?.trim()) && Boolean(value.metaDescription?.trim());
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ArticleFormData>;

    if (!isValidPayload(payload)) {
      return NextResponse.json({ error: ERROR_TEXT.requiredFields }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: ERROR_TEXT.missingApiKey }, { status: 500 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = anthropic.messages.stream({
      model: APP_CONFIG.model,
      max_tokens: DEMO_LIMITS.MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt({
            title: payload.title,
            metaDescription: payload.metaDescription,
            observations: payload.observations ?? "",
          }),
        },
      ],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Anthropic stream failed", error);
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Generate article route failed", error);
    return NextResponse.json({ error: ERROR_TEXT.generationFailed }, { status: 500 });
  }
}
