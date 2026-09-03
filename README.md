This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Client portal (`/portal`)

A multi-project status portal for clients, living under `/portal` in this app.

- **Routes**: `/portal` lists projects as cards; `/portal/<slug>` is a project page
  with an always-visible status hero and five tabs (`overview`, `requests`,
  `prototype`, `timeline`, `decisions`) — each tab is deep-linkable at
  `/portal/<slug>/<tab>`. `/console` is the PM editor with a project switcher.
- **Auth**: env-based shared login, no user accounts. Set `PORTAL_USER`,
  `PORTAL_PASSWORD` (client role), `PORTAL_PM_PASSWORD` (unlocks `/console`,
  the "New project" action, and the dashed PM annotations), and
  `PORTAL_SESSION_SECRET`. See `.env.example`.
- **Content**: one file per project in `src/portal-data/<slug>.json`, listed in
  `src/portal-data/index.json` (card summaries). The console edits `<slug>.json` and
  refreshes the index — writes work in local dev; on Vercel the runtime filesystem is
  read-only, so console saves no-op with a notice until the backend is wired.
- **Backend swap**: when the API in `docs/portal-api-contract.md` exists, set
  `PORTAL_API_URL` and replace the four functions in `src/lib/portal/data.ts`. Nothing
  else changes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
