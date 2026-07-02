import { timingSafeEqual } from "node:crypto";

function readCredential(...names: string[]) {
  for (const name of names) {
    const value = String(process.env[name] || "").trim();
    if (value) return value;
  }
  return "";
}

export function authConfigured() {
  const email = readCredential("ADMIN_LOGIN_EMAIL", "ADMIN_LOGIN");
  const password = readCredential("ADMIN_LOGIN_PASSWORD", "ADMIN_PASSWORD");
  const secret = readCredential("HEYEUGENE_SESSION_SECRET", "SESSION_SECRET");
  return Boolean(email && password && secret.length >= 16);
}

export function adminCredentials() {
  return {
    email: readCredential("ADMIN_LOGIN_EMAIL", "ADMIN_LOGIN"),
    password: readCredential("ADMIN_LOGIN_PASSWORD", "ADMIN_PASSWORD"),
  };
}

export function sessionSecret() {
  const s = readCredential("HEYEUGENE_SESSION_SECRET", "SESSION_SECRET");
  if (!s || s.length < 16) {
    throw new Error("HEYEUGENE_SESSION_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(s);
}

function secureEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyAdminLogin(email: string, password: string) {
  if (!email.trim() || !password) {
    throw new Error("Email and password required");
  }

  const { email: expectedEmail, password: expectedPassword } = adminCredentials();
  if (!expectedEmail || !expectedPassword) {
    throw new Error("Login not configured on server");
  }

  const ok =
    secureEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) &&
    secureEqual(password, expectedPassword);

  if (!ok) {
    throw new Error("Invalid email or password");
  }
}
