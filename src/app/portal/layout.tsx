import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PortalAuthGuard } from "@/components/portal/PortalAuthGuard";
import "./portal.css";

export const metadata: Metadata = {
  // Plain "Client portal" — the root layout's title template now appends
  // "| Universal Perk" automatically (added for the marketing pages' SEO
  // pass); keeping the old full string here would double it.
  title: "Client portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portal-scope min-h-screen">
      <PortalAuthGuard />
      {children}
    </div>
  );
}
