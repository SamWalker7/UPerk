import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Client portal | Universal Perk",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-900 dark:bg-[#080c15] dark:text-slate-100">
      {children}
    </div>
  );
}
