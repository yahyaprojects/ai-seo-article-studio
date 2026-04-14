import { NextResponse } from "next/server";

import { titleExistsInStorage } from "@/lib/server/articleStorage";

interface Payload {
  title?: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const title = payload.title?.trim();

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const exists = await titleExistsInStorage(title);
    return NextResponse.json({ exists });
  } catch {
    return NextResponse.json({ error: "Unexpected exists check error" }, { status: 500 });
  }
}
