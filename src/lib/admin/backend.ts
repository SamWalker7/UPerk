// Thin client for the non-portal backend routes described in the deployed
// OpenAPI spec at <PORTAL_API_URL>/api-docs/#/ (tags: "Blog Content",
// "Bookings"). These are internal/admin tools — no end-user auth model is
// defined for them in the spec, so callers are expected to gate access
// themselves (see src/app/admin/*).

export class AdminBackendError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function baseUrl(): string {
  const url = process.env.PORTAL_API_URL;
  if (!url) throw new AdminBackendError(503, "PORTAL_API_URL is not configured");
  return url.replace(/\/+$/, "");
}

export function adminBackendConfigured(): boolean {
  return Boolean(process.env.PORTAL_API_URL);
}

type Json = Record<string, unknown> | unknown[];

async function request<T>(
  path: string,
  init: { method?: string; body?: Json } = {},
): Promise<T> {
  const { method = "GET", body } = init;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    throw new AdminBackendError(
      502,
      err instanceof Error ? err.message : "Failed to reach the backend",
    );
  }

  const text = await res.text();
  const data = text ? safeParse(text) : {};

  if (!res.ok) {
    const message = extractError(data) ?? `Backend error (${res.status})`;
    throw new AdminBackendError(res.status, message);
  }
  return data as T;
}

function extractError(data: unknown): string | null {
  if (data && typeof data === "object" && "error" in data) {
    return String((data as { error: unknown }).error);
  }
  return null;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export type BlogPost = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  username: string;
  fetchedAt: string;
};

export type BookingLog = {
  id: string;
  event: string;
  payload: unknown;
  status: string;
  timestamp: string;
};

export const adminBackend = {
  // "Blogs" — published posts (read-only).
  listBlogs: () => request<{ posts: BlogPost[] }>("/api/blogs"),
  readBlog: (id: string) => request<BlogPost>(`/api/blogs/${encodeURIComponent(id)}`),

  // "Blog Content" — AI-generated drafts.
  listContent: () => request<{ items: unknown[] } | unknown[]>("/api/content"),
  generateContent: (topic: string) =>
    request<{ id?: string; content?: unknown }>("/api/content", {
      method: "POST",
      body: { topic },
    }),
  readContent: (id: string) =>
    request<unknown>(`/api/content/${encodeURIComponent(id)}`),

  // "Bookings" — Calendly webhook log (the webhook itself is called by
  // Calendly, not the frontend, so there is no client method for it).
  bookingLogs: () => request<{ logs: BookingLog[] }>("/api/bookings/logs"),
};
