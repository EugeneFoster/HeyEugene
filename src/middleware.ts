import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { authConfigured, sessionSecret } from "@/lib/auth/config";

const PUBLIC_PREFIXES = ["/login", "/api/auth", "/api/status"];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, sessionSecret());
  return payload as { email?: string };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    if (pathname === "/login" || pathname.startsWith("/login")) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (token && authConfigured()) {
        try {
          await verifyToken(token);
          const next = request.nextUrl.searchParams.get("next");
          const dest = next?.startsWith("/") ? next : "/";
          return NextResponse.redirect(new URL(dest, request.url));
        } catch {
          /* show login */
        }
      }
    }
    return NextResponse.next();
  }

  if (!authConfigured()) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
