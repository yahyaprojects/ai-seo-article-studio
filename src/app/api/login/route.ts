import { NextResponse } from "next/server";

const ADMIN_USERNAME = "auth@propulsa.com";
const ADMIN_PASSWORD = "propulsa.com";
const AUTH_COOKIE_NAME = "propulsa_auth";
const AUTH_COOKIE_VALUE = "authenticated";

interface LoginPayload {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoginPayload;
    const username = payload.username?.trim() ?? "";
    const password = payload.password ?? "";

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: AUTH_COOKIE_VALUE,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unexpected login error" }, { status: 500 });
  }
}
