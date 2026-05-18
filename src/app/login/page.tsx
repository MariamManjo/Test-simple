"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f7f5f0] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e8e4dc] bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-[#2d6a4f]">Welcome back</h1>
        <p className="mt-1 text-sm text-[#5c5c5c]">Sign in to save your prompt history.</p>

        {registered && (
          <p className="mt-4 rounded-lg bg-[#d8f3dc] px-3 py-2 text-sm text-[#1b4332]">
            Account created! You can sign in now.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full min-h-12 rounded-[10px] border border-[#e8e4dc] bg-[#f7f5f0] px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full min-h-12 rounded-[10px] border border-[#e8e4dc] bg-[#f7f5f0] px-4 py-3"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-12 rounded-[10px] bg-[#2d6a4f] font-semibold text-white hover:bg-[#1b4332] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#5c5c5c]">
          No account?{" "}
          <Link href="/register" className="font-semibold text-[#2d6a4f] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
