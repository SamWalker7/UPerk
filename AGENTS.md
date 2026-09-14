# AI agent instructions

These instructions apply to any AI coding assistant working in this repo
(Claude, Cursor, Copilot, Codex, etc.) — not just Claude.

## Design & UX

- **Mobile-first.** Write base Tailwind classes for the smallest viewport,
  then layer `sm:`/`lg:`/`xl:` overrides for larger screens. Never design
  desktop-first and hide/patch things for mobile as an afterthought.
- Aim for modern, clean, premium UI — this is a development/AI services
  agency site and client portal; it should read as professional and
  credible to prospects and clients alike.
- Reuse existing design tokens and patterns (e.g. `--p-*` CSS variables in
  the portal, existing Tailwind color/spacing conventions on the marketing
  site) instead of inventing new ones.

## Code style

- Minimal, clean code. No speculative abstractions, no unused props, no
  scaffolding for features that don't exist yet.
- Only touch the code you have to for the task at hand — don't refactor,
  rename, or restyle unrelated code in the same change.
- Prefer [shadcn/ui](https://ui.shadcn.com) components + Tailwind for any
  new UI. Add components via `npx shadcn@latest add <component>` rather
  than hand-rolling one from scratch. Only build a component from scratch
  when shadcn has no equivalent.
- Add comments. They don't have to ask "why".

## Verification

- Run project verification from this repository only.
- Reuse the existing server at `http://localhost:3000` for browser checks.
  Do not restart it or start additional preview servers. Stop any extra
  localhost servers you started when they are no longer needed.
- Keep verification scripts, screenshots, caches, and temporary artifacts
  inside this repo (use the gitignored `output/` directory when needed).
- Do not create verification files in `/private/`, `/tmp/`, or other projects,
  or use another project's dependencies to run checks.
