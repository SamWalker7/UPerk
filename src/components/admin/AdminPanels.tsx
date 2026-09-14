"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/portal/ui";
import { Spinner } from "@/components/portal/Spinner";

type BlogPost = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  username: string;
};

type BookingLog = {
  id: string;
  event: string;
  status: string;
  timestamp: string;
};

function Panel({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 sm:p-7">
      <SectionTitle title={title} aside={aside} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ErrorLine({ message }: { message: string }) {
  return <p className="text-[13px] text-[var(--p-risk)]">{message}</p>;
}

function BlogsPanel() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/admin/api/blogs")
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (body.error) setError(body.error);
        else setPosts(body.posts ?? []);
      })
      .catch(() => !cancelled && setError("Network error."));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Panel title="Published blog posts" aside={posts ? `${posts.length} posts` : undefined}>
      {error ? <ErrorLine message={error} /> : null}
      {!posts && !error ? <Spinner className="h-4 w-4" /> : null}
      {posts && posts.length === 0 ? (
        <p className="text-[13px] text-[var(--p-text-dim)]">No posts yet.</p>
      ) : null}
      {posts && posts.length > 0 ? (
        <ul className="divide-y divide-[var(--p-border)]">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-[13px] font-semibold text-[var(--p-text)] hover:underline"
                >
                  {post.title}
                </a>
                <p className="text-[12px] text-[var(--p-text-dim)]">
                  {post.username} · {post.pubDate}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}

function ContentPanel() {
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);

  async function generate() {
    if (!topic.trim()) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/admin/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Failed to generate content.");
      } else {
        setResult(body);
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel title="Generate blog content">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic, e.g. Benefits of a modern client portal"
          className="flex-1 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-[13px] outline-none focus:border-[var(--p-accent)]"
        />
        <button
          type="button"
          onClick={generate}
          disabled={busy || !topic.trim()}
          className="flex items-center justify-center gap-2 rounded-lg bg-[var(--p-accent)] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
          Generate
        </button>
      </div>
      {error ? <div className="mt-3"><ErrorLine message={error} /></div> : null}
      {result != null ? (
        <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-[var(--p-surface-2)] p-4 text-[12px] text-[var(--p-text)]">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </Panel>
  );
}

function BookingsPanel() {
  const [logs, setLogs] = useState<BookingLog[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/admin/api/bookings/logs")
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (body.error) setError(body.error);
        else setLogs(body.logs ?? []);
      })
      .catch(() => !cancelled && setError("Network error."));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Panel title="Booking webhook logs" aside={logs ? `${logs.length} events` : undefined}>
      {error ? <ErrorLine message={error} /> : null}
      {!logs && !error ? <Spinner className="h-4 w-4" /> : null}
      {logs && logs.length === 0 ? (
        <p className="text-[13px] text-[var(--p-text-dim)]">No booking events logged yet.</p>
      ) : null}
      {logs && logs.length > 0 ? (
        <ul className="divide-y divide-[var(--p-border)]">
          {logs.map((log) => (
            <li key={log.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[var(--p-text)]">{log.event}</p>
                <p className="text-[12px] text-[var(--p-text-dim)]">{log.timestamp}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  log.status === "success" || log.status === "ok"
                    ? "bg-[var(--p-ok-bg)] text-[var(--p-ok)]"
                    : "bg-[var(--p-risk-bg)] text-[var(--p-risk)]"
                }`}
              >
                {log.status}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}

export function AdminPanels() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BlogsPanel />
      <BookingsPanel />
      <div className="lg:col-span-2">
        <ContentPanel />
      </div>
    </div>
  );
}
