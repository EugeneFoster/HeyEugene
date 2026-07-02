import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="mb-6 text-center">
        <p className="text-3xl">👋</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          HeyEugene
        </p>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
