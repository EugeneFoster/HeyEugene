import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session.server";

export async function POST() {
  await clearSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("heyeugene_session");
  return res;
}
