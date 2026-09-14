"use client";

import { PortalTopBar } from "@/components/portal/PortalTopBar";
import { AdminPanels } from "@/components/admin/AdminPanels";

// middleware.ts already gates /admin/** to PM sessions server-side, so this
// page (and AdminPanels, which fetches its own data client-side against
// /admin/api/*) can render straight away.
export default function AdminPage() {
  return (
    <main>
      <PortalTopBar role="pm" showConsoleLink backHref="/portal" crumb="Admin" />
      <div className="mx-auto w-full max-w-[1440px] px-3 pb-24 pt-6 sm:px-6">
        <AdminPanels />
      </div>
    </main>
  );
}
