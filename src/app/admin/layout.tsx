import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../portal/portal.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="portal-scope min-h-screen">{children}</div>;
}
