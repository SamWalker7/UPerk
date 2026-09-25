import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PortalAuthGuard } from "@/components/portal/PortalAuthGuard";
import "../portal/portal.css";

export const metadata: Metadata = {
  // See portal/layout.tsx — root layout's title template appends the
  // "| Universal Perk" suffix now, so it isn't repeated here.
  title: "PM console",
  robots: { index: false, follow: false },
};

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portal-scope min-h-screen">
      <PortalAuthGuard />
      {children}
    </div>
  );
}
