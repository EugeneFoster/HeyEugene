import { timingSafeEqual } from "node:crypto";
import { adminCredentials } from "./config";

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
