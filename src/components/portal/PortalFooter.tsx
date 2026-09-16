"use client";

import { useState } from "react";

/** Clears whatever the browser has cached for this app (router/session
 *  storage, any Cache Storage entries, service workers) and forces a fresh
 *  reload straight from the server — the escape hatch for "the portal looks
 *  stale/broken, just start over" without asking someone to open devtools. */
async function refreshSite() {
  try {
    sessionStorage.clear();
  } catch {
    // ignore — private mode etc.
  }
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // ignore
  }
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
    }
  } catch {
    // ignore
  }
  window.location.reload();
}

export function PortalFooter() {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <footer className="mx-auto flex w-full max-w-[1440px] justify-center px-3 py-8 sm:px-6">
      <button
        type="button"
        onClick={() => {
          setRefreshing(true);
          refreshSite();
        }}
        disabled={refreshing}
        className="flex items-center gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2 text-[12px] font-medium text-[var(--p-text-dim)] shadow-sm transition hover:bg-[var(--p-surface-2)] hover:text-[var(--p-text)] disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          aria-hidden
        >
          <path
            d="M20 11A8 8 0 104.4 15M4 5v6h6M4 13a8 8 0 0015.6 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {refreshing ? "Refreshing…" : "Refresh site"}
      </button>
    </footer>
  );
}
