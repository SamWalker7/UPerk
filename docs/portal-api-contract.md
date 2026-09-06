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

### Granular routes (optional, nicer for the console later)

```
PATCH /api/projects/:slug/status        body: Partial<PortalStatus>
PATCH /api/projects/:slug/plan           body: Partial<ProjectData["plan"]>
POST  /api/projects/:slug/requests       body: Omit<ClientRequest,"id">   -> { id }
PATCH /api/projects/:slug/requests/:id   body: Partial<ClientRequest>
POST  /api/projects/:slug/decisions      body: Omit<Decision,"id">        -> { id }
POST  /api/projects/:slug/screens        body: Omit<FinishedScreen,"id">  -> { id }
```

Decisions are append-or-supersede only — never hard-delete (`supersededBy` points at
the replacement).

---

## Client actions (not built yet)

Buttons like "Choose A", "Mark as done", "Send the list" are display-only until this
exists. When wired (callable with the `client` role):

```
POST /api/projects/:slug/requests/:id/respond   body: { "choice": string }
POST /api/projects/:slug/requests/:id/resend
POST /api/projects/:slug/requests/:id/done
```

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
              thisWeek, upNext, neededFromYou, neededLinkLabel?, neededLink? }
  steps:    { label, state: "done"|"now"|"upcoming" }[]
  requests: ClientRequest[]     // id,title,status,daysOpen,blocking,body,note?,subNote?,
                                // options?[{label,imageUrl?}], actions[{label,kind}], pmNote?
  build:    { version, date, screensBuilt, screensTotal, knownIssues, testedOn }
  prototype:{ prototypeUrl?, installUrl?, figmaUrl?, embedUrl?, caption?, frameLabel?,
              installLabel?, pmNote? }
  plan:     { rangeLabel, axisStart, axisEnd,
              phases[{ id,name,state,start,end,rangeLabel? }],
              milestones[{ title, body }] }
  finishedScreens: { id, name, date, imageUrl? }[]
  decisionsIntro?: string
  decisions: { id, date, body, attribution, link?{label,url}, supersededBy? }[]
  nextCall?: { label, agendaUrl? }
}
```

Dates: `axis*` and phase `start`/`end` are ISO `YYYY-MM-DD`. Everything else is a
human-typed display string (e.g. `"Wed 2 Sept, 9:14"`).
