import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../portal/portal.css";

export const metadata: Metadata = {
  title: "PM console | Universal Perk",
  robots: { index: false, follow: false },
};

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return <div className="portal-scope min-h-screen">{children}</div>;
}
