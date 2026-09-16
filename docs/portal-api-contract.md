# Client Portal — Backend API Contract

The client portal (this repo, `/portal`) currently reads JSON files from
`src/portal-data/` — one `<slug>.json` per project plus an `index.json` of card
summaries. This document is the contract for the backend service that will replace it.
When the service exists:

- Set `PORTAL_API_URL` in the portal's Vercel env.
- Replace the bodies of the functions in `src/lib/portal/data.ts`
  (`listProjects`, `readProject`, `writeProject`, `createProject`) with `fetch()`
  calls. **No component or type changes.**

The per-project body is the `ProjectData` object defined in
`src/lib/portal/types.ts` — treat that file as the schema of record. `index.json` /
`ProjectSummary` is a portal-side convenience; the backend replaces it with a list
query and can compute the summary fields itself.

---

## Auth

Shared credentials, no user accounts. The portal handles login today via env vars
(`PORTAL_USER`, `PORTAL_PASSWORD`, `PORTAL_PM_PASSWORD`) and a signed cookie. If the
backend takes over auth later:

```
POST /api/portal/auth/login
  body:  { "username": string, "password": string }
  200:   { "token": string, "role": "client" | "pm" }
  401:   { "error": string }
```

All other calls send `Authorization: Bearer <token>`. `role: "pm"` is required for
every write.

---

## Projects collection

### List

```
GET /api/projects
  200: { "projects": ProjectSummary[] }
```

`ProjectSummary` = `{ slug, name, client, currentPhase, statusLabel, statusTone
("ok"|"warn"|"risk"), daysToLaunch, launchDate, screensBuilt, screensTotal,
openRequests, updatedAt }`.

### Create (PM only)

```
POST /api/projects
  body: { "name": string, "client": string }
  201:  { "ok": true, "slug": string }
  400:  { "error": string }   // missing name
  403:  { "error": "PM access required" }
```

Server assigns the slug (`slugify(name)`, collision → `-2`, `-3`, …) and seeds an
empty project (4 standard phases, empty requests/decisions/screens).

### Read one

```
GET /api/projects/:slug
  200: ProjectData
  404: { "error": "Not found" }
```

### Weekly update history

```
GET /api/projects/:slug/weekly-history
  200: { "updates": WeeklyUpdate[], "total": number }
```

`status.thisWeek`, `status.upNext`, and `status.neededFromYou` are the current
update. When a PM changes any of them, the backend automatically appends the
previous set to `weeklyHistory` (newest first). History is read-only to callers,
so prior client updates cannot be edited or removed accidentally.

The PM console also keeps section snapshots for requests, phase, status,
notes, links/build details, the plan, and finished screens:

```
GET /api/projects/:slug/history?section=requests|phase|status|notes|links|plan|screens
  200: { "entries": ProjectHistoryEntry[], "total": number }
```

These snapshots are append-only and PM-only. The backend creates them before a
section changes; uploaded image data is intentionally excluded from snapshots.

### Replace (PM only) — what the console uses

```
PUT /api/projects/:slug
  body: ProjectData
  200:  { "ok": true }
  400:  { "error": string }   // malformed
  403:  { "error": "PM access required" }
```

The portal recomputes the project's summary after a successful PUT; a real backend
should keep its own summary/list projection in sync.

### Delete (PM only) — what the console's "Danger zone" and per-item Remove use

```
DELETE /api/projects/:slug                    200: { "ok": true }
DELETE /api/projects/:slug/requests/:id        200: { "ok": true }
DELETE /api/projects/:slug/screens/:id         200: { "ok": true }
  403: { "error": "PM access required" }
  404: { "error": "Not found" }
```

Deleting the project removes it and everything in it; the backend keeps its
summary/list projection in sync. Request and screen deletes are hard deletes
(decisions are *not* deletable — supersede instead).

### Granular routes

Wired in `src/lib/portal/backend.ts` / `data.ts` and proxied at
`/portal/api/projects/:slug/...`. The console still saves via the full-object
`PUT`/`PATCH` on `/api/projects/:slug`; these are narrower alternatives for
callers that don't want to resend the whole `ProjectData`.

```
PATCH /api/projects/:slug/status         body: Partial<PortalStatus>
PATCH /api/projects/:slug/plan           body: Partial<ProjectData["plan"]>
PATCH /api/projects/:slug/prototype      body: Partial<PrototypeLinks>
POST  /api/projects/:slug/notes          body: { body, visibility: "internal"|"client", pinned? } -> { id }
POST  /api/projects/:slug/requests       body: Omit<ClientRequest,"id">   -> { id }
PATCH /api/projects/:slug/requests/:id   body: Partial<ClientRequest>
GET   /api/projects/:slug/decisions      -> { decisions: Decision[], total?, active? }
POST  /api/projects/:slug/decisions      body: Omit<Decision,"id">        -> { id }
POST  /api/projects/:slug/screens        body: Omit<FinishedScreen,"id">  -> { id }
PATCH /api/projects/:slug/screens/:id    body: { name, date, imageUrl? }
POST  /api/projects/:slug/publish        -> { ok: true, publication: unknown }
```

`publish` ships the project's accumulated draft changes (PM only) — wired at
`/portal/api/projects/:slug/publish` via `src/lib/portal/backend.ts`.

Decisions are append-or-supersede only — never hard-delete (`supersededBy` points at
the replacement).

---

## Client actions

Buttons like "Choose A", "Mark as done", "Send the list". Wired, callable
with the `client` role:

```
POST /api/projects/:slug/requests/:id/respond   body: { "choice": string }
POST /api/projects/:slug/requests/:id/resend
POST /api/projects/:slug/requests/:id/done
```

---

## Non-portal routes (admin tools, `/admin`)

The same deployed API also exposes a few routes unrelated to the client
portal schema above. They're wired at `/admin/api/*` (PM-session-gated, same
as `/console`) via `src/lib/admin/backend.ts`:

```
GET  /api/blogs                 -> { posts: BlogPost[] }
GET  /api/blogs/:id             -> BlogPost
GET  /api/content                -> generated blog drafts
POST /api/content   body: { topic: string } -> generated draft
GET  /api/content/:id           -> one generated draft
GET  /api/bookings/logs          -> { logs: BookingLog[] }
```

`POST /api/bookings/webhook` (Calendly webhook receiver) is called by
Calendly directly, never by this frontend, so there's no client method for
it. `/api/newsletter`, `/api/form/submit-form`, and `/api/chatbot` are
called directly from their respective components
(`Subscrib.tsx`, `forms.ts`, `Chatbot.tsx`) rather than through
`PORTAL_API_URL` — they don't need a session.

---

## Error shape

All non-2xx responses: `{ "error": string }`, optionally `{ "details": unknown }`.

---

## `ProjectData` shape (summary — `types.ts` is authoritative)

```ts
ProjectData = {
  slug: string
  project:  { name, client, updatedAt, updatedBy }
  status:   { currentPhase, phaseSubtitle, daysToLaunch, launchDate, launchNote,
              screensBuilt, screensTotal, statusLabel, statusBody,
              thisWeek, upNext, neededFromYou, weeklyUpdatedAt?, neededLinkLabel?, neededLink? }
  weeklyHistory?: { id, recordedAt, recordedBy, thisWeek, upNext, neededFromYou }[]
  projectHistory?: { id, section, recordedAt, recordedBy, summary, data }[]
  steps:    { label, state: "done"|"now"|"upcoming" }[]
  requests: ClientRequest[]     // id,title,status,daysOpen,blocking,body,note?,subNote?,
                                // responseType?: "approval"|"choice", response?,
                                // options?[{label,imageUrl?}], actions[{label,kind,intent?}], pmNote?
  build:    { version, date, screensBuilt, screensTotal, knownIssues, testedOn }
  prototype:{ prototypeUrl?, installUrl?, figmaUrl?, embedUrl?, caption?, frameLabel?,
              installLabel?, pmNote? }
  plan:     { rangeLabel, axisStart, axisEnd,
              phases[{ id,name,state,start,end,rangeLabel? }],
              milestones[{ title, body }] }
  finishedScreens: { id, name, date, imageUrl? }[]
  decisionsIntro?: string
  decisions: { id, date, createdAt?, body, attribution, link?{label,url}, supersededBy? }[]
  nextCall?: { label, agendaUrl? }
}
```

Dates: `axis*` and phase `start`/`end` are ISO `YYYY-MM-DD`. Everything else is a
human-typed display string (e.g. `"Wed 2 Sept, 9:14"`).
