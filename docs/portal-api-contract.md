# Client Portal — Backend API Contract

The client portal (this repo, `/portal`) currently reads a committed JSON file
(`src/portal-data/portal.json`). This document is the contract for the backend service
that will replace it. When the service exists:

- Set `PORTAL_API_URL` in the portal's Vercel env.
- Replace the bodies of `readPortalData()` / `writePortalData()` in
  `src/lib/portal/data.ts` with `fetch()` calls. **No component or type changes.**

The response/request body is the `PortalData` object defined in
`src/lib/portal/types.ts` — treat that file as the schema of record.

---

## Auth

Shared credentials, no user accounts (v1). The portal itself handles login today via
env vars (`PORTAL_USER`, `PORTAL_PASSWORD`, `PORTAL_PM_PASSWORD`) and a signed cookie.

If the backend takes over auth later:

```
POST /api/portal/auth/login
  body:  { "username": string, "password": string }
  200:   { "token": string, "role": "client" | "pm" }
  401:   { "error": string }
```

All other calls send `Authorization: Bearer <token>`. `role: "pm"` is required for every
write.

---

## Read

```
GET /api/portal/:projectId
  200: PortalData
  401 / 404: { "error": string }
```

`:projectId` — for v1 there is one project; a constant id (e.g. `forkthis`) is fine.

---

## Write (PM only)

### Full replace (what the console uses today)

```
PUT /api/portal/:projectId
  body: PortalData
  200:  { "ok": true }
  403:  { "error": "PM access required" }
  400:  { "error": string }
```

### Granular routes (optional, nicer for the console later)

```
PATCH /api/portal/:projectId/status        body: Partial<PortalStatus>
PATCH /api/portal/:projectId/plan          body: Partial<PortalData["plan"]>
POST  /api/portal/:projectId/requests      body: Omit<ClientRequest,"id">   -> { id }
PATCH /api/portal/:projectId/requests/:id  body: Partial<ClientRequest>
POST  /api/portal/:projectId/decisions     body: Omit<Decision,"id">        -> { id }
POST  /api/portal/:projectId/screens       body: Omit<FinishedScreen,"id">  -> { id }
```

Decisions are append-or-supersede only — never hard-delete (`supersededBy` points at
the replacement).

---

## Client actions (post-v1 — not built yet)

Buttons like "Choose A", "Mark as done", "Resend the invite" are display-only in v1.
When wired:

```
POST /api/portal/:projectId/requests/:id/respond   body: { "choice": string }
POST /api/portal/:projectId/requests/:id/resend
POST /api/portal/:projectId/requests/:id/done
```

These are callable with the `client` role.

---

## Error shape

All non-2xx responses: `{ "error": string }`, optionally `{ "details": unknown }`.

---

## `PortalData` shape (summary — `types.ts` is authoritative)

```ts
PortalData = {
  project:  { name, updatedAt, updatedBy }
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
