import { NextResponse } from "next/server";

import { saveArticleToStorage } from "@/lib/server/articleStorage";
import type { GeneratedArticle } from "@/lib/types";

interface Payload {
  article?: GeneratedArticle;
  status?: "draft" | "published";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const article = payload.article;
    const status = payload.status ?? "draft";

    if (!article) {
      return NextResponse.json({ error: "Missing article payload" }, { status: 400 });
    }

    await saveArticleToStorage(article, status);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected save error" }, { status: 500 });
  }
}
