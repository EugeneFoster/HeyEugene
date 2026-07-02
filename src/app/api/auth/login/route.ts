import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSessionToken,
} from "@/lib/auth/session.server";
import { authConfigured, verifyAdminLogin } from "@/lib/auth/login";

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { error: "Login not configured on server" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "");
  const password = String(body?.password || "");

  try {
    verifyAdminLogin(email, password);
    const token = await createSessionToken(email.trim().toLowerCase());
    const res = NextResponse.json({ ok: true });
    applySessionCookie(res, token);
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Login failed";
    const status =
      message.includes("Invalid") || message.includes("required") ? 401 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
