import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./portal.css";

export const metadata: Metadata = {
  title: "Client portal | Universal Perk",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portal-scope min-h-screen">
      {children}
    </div>
  );
}
