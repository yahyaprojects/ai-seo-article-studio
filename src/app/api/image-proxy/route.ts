import { NextResponse } from "next/server";

const REQUEST_HEADERS = {
  "User-Agent": "seo-demo-image-proxy/1.0",
  Accept: "image/*,*/*;q=0.8",
} as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: REQUEST_HEADERS,
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok || !response.body) {
      return NextResponse.json({ error: "Image proxy fetch failed" }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    return new Response(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Unexpected image proxy error" }, { status: 500 });
  }
}
