import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const code = params?.error ?? "Unknown";

  return (
    <main className="min-h-screen bg-[#131313] text-[#e2e2e2] flex items-center justify-center px-6">
      <section className="w-full max-w-xl border border-[rgba(67,70,85,0.3)] bg-[#1b1b1b] p-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Authentication Error</h1>
        <p className="mt-3 text-sm text-[#c3c6d7]">Unable to complete sign in.</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-[#b4c5ff]">Code: {code}</p>
        <div className="mt-8 flex gap-3">
          <Link href="/auth/sign-in" className="bg-[#2563eb] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
            Go to Sign In
          </Link>
          <Link href="/auth/sign-up" className="border border-[rgba(67,70,85,0.6)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#e2e2e2]">
            Go to Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}
