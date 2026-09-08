// Thin client for the real backend described in docs/portal-api-contract.md.
// Base URL: PORTAL_API_URL, e.g. https://nbttrereyf.execute-api.us-east-1.amazonaws.com/prod
// All routes below are relative to that base and match the deployed OpenAPI spec
// at <PORTAL_API_URL>/api-docs/#/.

export class BackendError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function baseUrl(): string {
  const url = process.env.PORTAL_API_URL;
  if (!url) throw new BackendError(503, "PORTAL_API_URL is not configured");
  return url.replace(/\/+$/, "");
}

export function backendConfigured(): boolean {
  return Boolean(process.env.PORTAL_API_URL);
}

type Json = Record<string, unknown> | unknown[];

async function request<T>(
  path: string,
  init: { method?: string; token?: string | null; body?: Json } = {},
): Promise<T> {
  const { method = "GET", token, body } = init;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    throw new BackendError(
      502,
      err instanceof Error ? err.message : "Failed to reach the portal API",
    );
  }

  const text = await res.text();
  const data = text ? safeParse(text) : {};

  if (!res.ok) {
    const message = extractError(data) ?? `Portal API error (${res.status})`;
    throw new BackendError(res.status, message);
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

export const backend = {
  login: (username: string, password: string) =>
    request<{ token: string; role: "client" | "pm" }>(
      "/api/portal/auth/login",
      { method: "POST", body: { username, password } },
    ),

  listProjects: (token: string) =>
    request<{ projects: unknown[] }>("/api/projects", { token }),

  createProject: (token: string, name: string, client: string) =>
    request<{ ok: true; slug: string }>("/api/projects", {
      method: "POST",
      token,
      body: { name, client },
    }),

  readProject: (token: string, slug: string) =>
    request<unknown>(`/api/projects/${encodeURIComponent(slug)}`, { token }),

  replaceProject: (token: string, slug: string, data: unknown) =>
    request<{ ok: true }>(`/api/projects/${encodeURIComponent(slug)}`, {
      method: "PUT",
      token,
      body: data as Json,
    }),

  patchProject: (token: string, slug: string, changes: unknown) =>
    request<{ ok: true }>(`/api/projects/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      token,
      body: changes as Json,
    }),

  appendDecision: (token: string, slug: string, data: unknown) =>
    request<{ id: string; decision?: unknown }>(
      `/api/projects/${encodeURIComponent(slug)}/decisions`,
      { method: "POST", token, body: data as Json },
    ),

  publishProject: (token: string, slug: string) =>
    request<{ ok: true; publication: unknown }>(
      `/api/projects/${encodeURIComponent(slug)}/publish`,
      { method: "POST", token },
    ),

  respondToRequest: (token: string, slug: string, id: string, choice: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/requests/${encodeURIComponent(id)}/respond`,
      { method: "POST", token, body: { choice } },
    ),

  resendRequest: (token: string, slug: string, id: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/requests/${encodeURIComponent(id)}/resend`,
      { method: "POST", token },
    ),

  markRequestDone: (token: string, slug: string, id: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/requests/${encodeURIComponent(id)}/done`,
      { method: "POST", token },
    ),

  // PM-only deletes. Backend removes the record and keeps its own summary/list
  // projection in sync.
  deleteProject: (token: string, slug: string) =>
    request<{ ok: true }>(`/api/projects/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      token,
    }),

  deleteRequest: (token: string, slug: string, id: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/requests/${encodeURIComponent(id)}`,
      { method: "DELETE", token },
    ),

  deleteScreen: (token: string, slug: string, id: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/screens/${encodeURIComponent(id)}`,
      { method: "DELETE", token },
    ),

  updateScreen: (token: string, slug: string, id: string, screen: unknown) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/screens/${encodeURIComponent(id)}`,
      { method: "PATCH", token, body: screen as Json },
    ),

  addScreen: (token: string, slug: string, screen: unknown) =>
    request<{ id: string }>(`/api/projects/${encodeURIComponent(slug)}/screens`, {
      method: "POST", token, body: screen as Json,
    }),
};
