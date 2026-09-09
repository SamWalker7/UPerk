"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/portal/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, next }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Sign in failed.");
        return;
      }
      router.replace(body.next || "/portal");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <div>
        <label className="mb-2 block text-[13px] font-semibold text-[var(--p-text)]">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          placeholder="you@company.com"
          className="w-full rounded-lg border border-[var(--p-border)] bg-white px-3.5 py-3 text-[14px] text-[var(--p-text)] outline-none transition focus:border-[var(--p-accent)] focus:ring-4 focus:ring-[var(--p-accent)]/10"
        />
      </div>
      <div>
        <label className="mb-2 block text-[13px] font-semibold text-[var(--p-text)]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          className="w-full rounded-lg border border-[var(--p-border)] bg-white px-3.5 py-3 text-[14px] text-[var(--p-text)] outline-none transition focus:border-[var(--p-accent)] focus:ring-4 focus:ring-[var(--p-accent)]/10"
        />
      </div>
      {error && <p className="rounded-lg bg-[var(--p-risk-bg)] px-3 py-2.5 text-[13px] text-[var(--p-risk)]">{error}</p>}
      <button
        type="submit"
        disabled={loading || !username || !password}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 py-3 text-[14px] font-semibold text-white shadow-[0_6px_14px_rgba(8,127,212,.22)] transition hover:bg-[#0876c2] disabled:opacity-40"
      >
        {loading ? (
          <>
            <Spinner />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
