import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./constants";
import { sessionSecret } from "./config";

export type HeyEugeneSession = {
  email: string;
  exp: number;
};

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function createSessionToken(email: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return new SignJWT({ email, exp })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .sign(sessionSecret());
}

export function applySessionCookie(res: NextResponse, token: string) {
  res.cookies.set(SESSION_COOKIE, token, cookieOptions());
}

export async function setSession(email: string) {
  const token = await createSessionToken(email);
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions());
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<HeyEugeneSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload as unknown as HeyEugeneSession;
  } catch {
    return null;
  }
}
