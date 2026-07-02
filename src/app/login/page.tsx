import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = next?.startsWith("/") ? next : "/";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="mb-6 text-center">
        <p className="text-3xl">👋</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
          HeyEugene
        </p>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <LoginForm next={redirectTo} />
      </div>
    </main>
  );
}
