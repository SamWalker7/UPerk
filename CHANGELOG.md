# Changelog

**Internal document — for the Universal Perk dev/design/PM team only.**
Nothing in this file is served to site visitors or clients (it's a
repo-root markdown file, not a route), but keep client-identifying or
contract-sensitive detail out of it anyway.

---

## Unreleased

**"Add request" in the console now saves immediately.** It previously only
called `onChange()` on local state with a client-generated fake id
(`uid("req")`) — nothing reached the backend until the PM separately hit
the section's "Save" button, so a new request was lost if they navigated
away first. `NewRequestForm`'s submit button used to paper over this by
calling `save()` (the full-object `PATCH`) right after adding locally.
`ConsoleEditor` now has an `addRequest()` (parallel to the existing
`logDecision()`) that `POST`s to `/portal/api/projects/:slug/requests`
immediately, takes the real server-assigned `id` back, and applies it to
both `data` and `saved` state so it's marked persisted right away — same
pattern decisions already used. The redundant `onSave()` call after adding
is gone.

**Portal data fetching moved from server components to client-side `fetch`.**
`/portal`, `/portal/[project]`, `/console`, `/admin`, and `/portal/login`
were React Server Components that called `readProject`/`listProjects`/
`getPortalSession` directly, entirely inside the Next.js server process —
correct, but invisible in the browser's Network tab, which read as "no API
call is happening." They're now client components (`"use client"`) that
fetch from this app's own `/portal/api/*` / `/admin/api/*` routes on mount,
so every read is a visible browser request.

- New `GET /portal/api/session` → `{ role }`, since the session cookie is
  httpOnly and a client component can't read it directly.
- New `ProjectDataProvider` (`src/components/portal/ProjectDataProvider.tsx`)
  is the client-side data boundary for `/portal/[project]/**` — fetches once
  in the layout, exposes `{ data, role, refresh }` via a `useProjectData()`
  hook to the page and its children (`WaitingOnYou`'s respond/resend/done
  actions now call `refresh()` instead of the old, now-inert,
  `router.refresh()`).
- `/console` and `/portal` fetch their own project list + selected project
  client-side; `ConsoleProjectPicker`'s project switch no longer calls
  `router.refresh()` (there's no server data left to refresh).
- `/portal/login` split into a thin server `page.tsx` (keeps the
  `metadata` export, which can't live in a `"use client"` file) and a new
  `PortalLoginClient.tsx` that does the "already signed in" check against
  `/portal/api/session` instead of a server-side `getPortalRole()` call.
- `middleware.ts` is unchanged and still does the real access control
  (redirects unauthenticated visitors, blocks non-PMs from `/console` and
  `/admin`) — these pages assume a valid session by the time they mount and
  handle a 401 from their own fetches as a fallback (expired mid-visit).
- `data.ts`/`backend.ts` and every `/portal/api/*` and `/admin/api/*` route
  handler are unchanged — they still run server-side, by necessity: they're
  the only code holding the backend bearer token (unwrapped from the
  httpOnly session cookie) and it must never reach the browser.

Wired the remaining endpoints from the deployed OpenAPI spec
(`<PORTAL_API_URL>/api-docs/#/`) that had no caller in the codebase yet.

### For engineers

- **Portal granular PM routes.** Added `PATCH /portal/api/projects/:slug/status`,
  `/plan`, `/prototype`, `POST /notes`, `POST /requests`, and
  `GET /portal/api/projects/:slug/decisions` — thin proxies through
  `src/lib/portal/backend.ts` → `src/lib/portal/data.ts`, following the same
  pattern as the existing routes. The console still saves via the full-object
  `PUT`/`PATCH` on `/portal/api/projects/:slug`; these are additive, matching
  endpoints the backend already exposes, for callers that want the narrower
  routes (or future console work).
- **History drawers now actually call the API.** `WeeklyHistoryDrawer`,
  `SectionHistoryDrawer`, and `DecisionHistoryDrawer` previously only
  rendered whatever `weeklyHistory`/`projectHistory`/`decisions` array
  happened to be baked into the initial full-project `GET`, and never called
  the dedicated history endpoints — `backend.weeklyHistory` and
  `backend.projectHistory` existed in `backend.ts` but had no `data.ts`
  wrapper, no Next.js route, and no caller. Added
  `GET /portal/api/projects/:slug/weekly-history` and
  `GET /portal/api/projects/:slug/history?section=...`, and all three
  drawers now fetch fresh data when opened (the prop value is kept only as
  a fallback while the fetch is in flight).
- **New `/admin` section (PM-only, gated in `middleware.ts` like `/console`).**
  Wires the previously-uncalled `Blogs`, `Blog Content`, and `Bookings` tags
  from the spec: `GET /api/blogs`, `GET /api/blogs/:id`, `GET`/`POST
  /api/content`, `GET /api/content/:id`, `GET /api/bookings/logs`. New client
  in `src/lib/admin/backend.ts` (same shape as `portal/backend.ts`), proxied
  through `src/app/admin/api/*`, rendered by
  `src/components/admin/AdminPanels.tsx`. The Calendly webhook itself
  (`POST /api/bookings/webhook`) is called by Calendly, not the frontend, so
  there's no client method for it.

---
## 1.3.0 — 2026-09-15

AI Services page repositioning and new tech-stack icons.

### For engineers

- **`/ai-services` repositioned.** Copy shifted from a chatbots/voice-agent/
  automation pitch to AI engineering, evals, fine-tuning/RFT, and
  forward-deployed engineers, with HIPAA/BAA delivery messaging. Most of
  `AIServicesClient.tsx` was rewritten to match.
- **New `Reveal` component** at `src/components/common/Reveal.tsx` — a
  shared scroll-reveal wrapper, now used on the AI Services page.
- **New tech-stack icons** added under `public/icons/tech/` (Claude,
  CrewAI, FastAPI, Gemini, Grafana, Hugging Face, LiveKit, Meta, Mistral,
  Redis, Supabase, Terraform, Vonage, WebRTC, Weights & Biases, Zapier),
  with `CREDITS.md` updated accordingly.

## 0.2.0 — 2026-09-14

Homepage/landing swap, a new Careers application flow, an SEO/AEO pass
across every marketing page, and a client-portal design refresh.

### For engineers

- **`/` and `/landing` swapped.** The redesigned marketing page (services,
  case studies, FAQ, etc.) now lives at `/`; the previous homepage moved to
  `/landing`. If you have local bookmarks, branches, or docs pointing at
  either route by content rather than path, re-check them.
- **Client/server split on every marketing page.** `page.tsx` for `/`,
  `/landing`, `/ai-services`, `/wmtfa`, `/creva`, `/voice-ai` is now a thin
  Server Component that only exports `metadata` and renders a sibling
  `*Client.tsx` file (`HomeClient.tsx`, `LandingClient.tsx`, etc.), which
  holds the actual `"use client"` page content unchanged. This was
  required — Next won't let a `"use client"` file export `metadata` — so
  if you're editing one of these pages, the interactive content is now in
  the `*Client.tsx` sibling, not in `page.tsx` itself.
- **New SEO/AEO infrastructure:** `src/app/robots.ts`, `src/app/sitemap.ts`
  (Next's `MetadataRoute` generators, output at `/robots.txt` and
  `/sitemap.xml`), `public/llms.txt`, and Organization/WebSite/FAQPage
  JSON-LD (Organization + WebSite in the root `layout.tsx`, FAQPage built
  from the homepage's existing `FAQS` array in `HomeClient.tsx`). The
  canonical domain is a `SITE_URL` constant (`layout.tsx`/`robots.ts`) that
  falls back to `https://www.universalperk.com` if `NEXT_PUBLIC_SITE_URL`
  isn't set — **confirm that's actually the production domain**, or set
  the env var.
- **Root layout now sets a title template** (`%s | Universal Perk`). Any
  new page's `metadata.title` should be just the page-specific part (e.g.
  `"Careers"`), not the full string with the site name appended, or it'll
  double up. Exception: `src/app/page.tsx` (the `/` route) — Next doesn't
  apply an ancestor's title template to a `page.tsx` in the *same* route
  segment as the layout that defines it, so that one file's title is
  written out in full; see the comment there.
- **New Careers feature:** `src/app/careers/`, `src/components/careers/`,
  `src/lib/jobs.ts` (job listings data), `src/lib/careers.ts` (application
  validation), `src/lib/forms.ts`, `src/app/api/careers/route.ts`
  (submission endpoint), `tests/careers.test.cjs`. Not yet linked from nav
  — reachable only at `/careers` directly — see PM notes below.
- **`GridBackdrop` extracted** to `src/components/common/GridBackdrop.tsx`
  (was a local function duplicated per-page); several pages now import it
  instead of redefining it.
- **Global type scale changed** in `globals.css`: the whole Tailwind
  `--text-*` scale shifted up roughly one step, and `--text-base`
  specifically now equals `--text-lg` (19px) as an explicit site-wide
  floor for body copy. If you're hand-picking a `text-[Npx]` arbitrary
  size anywhere, check it against this scale first — there's a real chance
  the named class now covers it.
- **Portal (`/portal/login`) gained real dark-mode support** —
  `src/app/portal/portal.css` now has a `.dark .portal-scope` token block
  that didn't exist before (the file's own comment implied it should, but
  it was never filled in). `--p-accent` also changed from `#087fd4` to the
  marketing site's actual brand blue (`#2563eb`) — if you're relying on
  the old hex anywhere by literal value instead of `var(--p-accent)`,
  update it.
- **Hero typing animation is disabled, not deleted.** `HomeClient.tsx`'s
  `typeChars`/`TYPE_STEP_MS` are commented out with a `TODO` explaining
  why (a `background-clip: text` gradient split across ~28 individually
  `opacity`-animated character spans rendered unreliably — part of the
  phrase silently failed to paint, twice, even after switching to a plain
  solid color). The hero currently renders the headline as static text.
  The `.type-char`/`.type-caret` keyframes are still in `globals.css` for
  whoever picks this back up — see the TODO for a steer toward a
  single-element `clip-path` reveal instead of per-character spans.
- Misc bug fixes bundled into this same pass: a stray-space CSS bug in
  `LoginForm.tsx`/`portal/login/page.tsx` (`--p-text-dim )`) that silently
  dropped a text color, a hardcoded hover/shadow color in `LoginForm.tsx`
  left over from the old portal accent, and 7 pre-existing
  `react/no-unescaped-entities` lint errors in `voice-ai` that were already
  failing `npm run build` before this branch touched that file.

### For designers

- **Brand palette is blue → cyan only**, site-wide, now including the
  client portal (previously a slightly different, unrelated blue). Any new
  accent color should come from that family unless it's a genuine
  semantic state (success/warning/error) or the case-study cards' existing
  per-client color coding.
- **Type scale raised.** Body copy is now 19px minimum (was 17px);
  headings shifted up roughly one step to keep pace. If a design comp
  predates this change, sizes in it will read smaller than what's live.
- **Decorative background textures are chosen per page/section**, not one
  motif everywhere: the animated blueprint grid (squares + circuit traces)
  now reads as "engineering credibility" — homepage's "Who we build for"
  and "Security" sections — while the careers page uses the calmer dot
  grid + glow motif from the homepage hero instead. Squares specifically
  did **not** work on the careers page ("doesn't look professional") — if
  proposing a background for a new page, default to the dot-grid/glow
  treatment unless the page is making a technical-credibility argument.
- CTAs are pill-shaped (`rounded-full`) everywhere now, not `rounded-lg`/
  `rounded-xl`.
- Case-study cards, the "Ways to work with us" cards, and the "Why teams
  choose us" icon tiles all got a resting-state pass (visible border/
  shadow before hover, not only on hover) — worth checking any new card
  component against that same "readable at rest" bar.

### For PMs

- **The public homepage changed** (now at `/`) — the AI-only "Custom AI
  company" framing is gone; it's full-stack services (web, mobile, cloud,
  AI) with problem-led messaging, per the April 2026 repositioning. The
  previous AI-services-led homepage is still live at `/landing` but no
  longer linked from anywhere.
- **Careers isn't in the site nav yet.** The application flow works end
  to end (job listing → apply → submit), but it's only reachable if
  someone has the direct `/careers` link. Decide when it's ready to link
  from the main nav/footer.
- **Blog is deliberately hidden** from nav and footer (was explicitly
  requested — "hide it until it's well developed"). The `/blog` route
  still works if linked directly; it just isn't discoverable from the
  site.
- **New SEO/AI-discoverability groundwork is live**: `robots.txt`,
  `sitemap.xml`, and `llms.txt` (a plain-text summary aimed at AI tools
  like ChatGPT/Claude that fetch it directly), plus structured data so
  search/AI answer engines can quote FAQ content and identify the company
  correctly. This is a foundation, not a guarantee of ranking or
  citations — see the AEO strategy notes shared separately for what
  actually moves the needle from here (external citations, case-study
  specificity, a directory listing like the Anthropic Partner Network).
  **Action needed:** confirm `https://www.universalperk.com` is the
  correct production domain, or provide the right one.
- **The hero's "typing" text animation was tried and pulled back out**
  after it rendered unreliably for some visitors — the headline reads as
  plain (non-animated) text for now. No visitor-facing regression, just a
  planned enhancement that didn't ship this round.
