"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f7f5f0] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e8e4dc] bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-[#2d6a4f]">Create account</h1>
        <p className="mt-1 text-sm text-[#5c5c5c]">
          Save every prompt you build — just for you.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">
              Name <span className="font-normal text-[#5c5c5c]">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full min-h-12 rounded-[10px] border border-[#e8e4dc] bg-[#f7f5f0] px-4 py-3"
            />
          </div>
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full min-h-12 rounded-[10px] border border-[#e8e4dc] bg-[#f7f5f0] px-4 py-3"
            />
            <p className="mt-1 text-xs text-[#5c5c5c]">At least 8 characters</p>
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
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#5c5c5c]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2d6a4f] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
