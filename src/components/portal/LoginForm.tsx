"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <div>
        <label className="mb-1 block text-[13px] font-medium text-[var(--p-text-dim)]">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[14px] outline-none focus:border-[var(--p-accent)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-medium text-[var(--p-text-dim)]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-lg border border-[var(--p-border)] bg-transparent px-3 py-2 text-[14px] outline-none focus:border-[var(--p-accent)]"
        />
      </div>
      {error && <p className="text-[13px] text-[var(--p-risk)]">{error}</p>}
      <button
        type="submit"
        disabled={loading || !username || !password}
        className="w-full rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
