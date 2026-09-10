"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-[var(--p-border)] bg-white px-3.5 py-3 pr-11 text-[14px] text-[var(--p-text)] outline-none transition focus:border-[var(--p-accent)] focus:ring-4 focus:ring-[var(--p-accent)]/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--p-text-dim)] hover:text-[var(--p-text)]"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
                <path
                  d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4 10 7a12.4 12.4 0 01-2.5 3.5M6.1 6.1C3.9 7.5 2.4 9.6 2 12c1 3 5 7 10 7a9.6 9.6 0 004.3-1"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
                <path
                  d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            )}
          </button>
        </div>
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
