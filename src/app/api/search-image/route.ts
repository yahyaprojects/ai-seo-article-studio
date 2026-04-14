import { NextResponse } from "next/server";

interface SearchImagePayload {
  query?: string;
}

const REQUEST_HEADERS = {
  "User-Agent": "seo-demo-image-bot/1.0",
  Accept: "image/*,*/*;q=0.8",
} as const;

interface FreepikResource {
  title?: string;
  url?: string;
  image?: {
    source?: {
      url?: string;
    };
  };
}

interface FreepikSearchResponse {
  data?: FreepikResource[];
}

async function isReachableImage(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: REQUEST_HEADERS,
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get("content-type") || "";
    return contentType.startsWith("image/");
  } catch {
    return false;
  }
}

async function pickFirstWorkingImage(results: FreepikResource[]) {
  for (const item of results) {
    const candidates = [item.image?.source?.url].filter((value): value is string => Boolean(value));
    for (const candidate of candidates) {
      const works = await isReachableImage(candidate);
      if (works) {
        return {
          url: candidate,
          alt: item.title || "",
        };
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SearchImagePayload;
    const query = payload.query?.trim();

    if (!query) {
      return NextResponse.json({ error: "Missing image query" }, { status: 400 });
    }

    const freepikApiKey = process.env.FREEPIK_API_KEY;
    if (!freepikApiKey) {
      return NextResponse.json({ error: "Missing FREEPIK_API_KEY" }, { status: 500 });
    }

    const url = `https://api.freepik.com/v1/resources?term=${encodeURIComponent(query)}&limit=20&order=relevance&filters[content_type][photo]=1`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "x-freepik-api-key": freepikApiKey,
        "Accept-Language": "en-US",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Freepik search failed" }, { status: response.status });
    }

    const data = (await response.json()) as FreepikSearchResponse;
    const firstWorking = await pickFirstWorkingImage(data.data ?? []);

    if (!firstWorking) {
      return NextResponse.json({ error: "No valid image found in Freepik" }, { status: 404 });
    }

    return NextResponse.json({
      url: firstWorking.url,
      alt: firstWorking.alt || `Imagen relacionada con ${query}`,
    });
  } catch {
    return NextResponse.json({ error: "Unexpected Freepik search error" }, { status: 500 });
  }
}
