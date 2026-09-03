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
        <label className="mb-1 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-[14px] outline-none focus:border-blue-500 dark:border-slate-700"
        />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-[14px] outline-none focus:border-blue-500 dark:border-slate-700"
        />
      </div>
      {error && <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading || !username || !password}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
