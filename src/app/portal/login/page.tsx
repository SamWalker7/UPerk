import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPortalRole } from "@/lib/portal/session";
import LoginForm from "@/components/portal/LoginForm";
import { BrandLogo } from "@/components/portal/BrandLogo";

export const metadata: Metadata = {
  title: "Sign in | Client portal",
  robots: { index: false, follow: false },
};

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext =
    next && (next.startsWith("/portal") || next.startsWith("/console"))
      ? next
      : "/portal";
  const role = await getPortalRole();
  if (role) redirect(safeNext);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0,_#f1f6fc_48%,_#eaf1f8_100%)] px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-[1176px] items-center justify-between">
        <BrandLogo href="/portal" />
        <span className="hidden text-[13px] text-[var(--p-text-dim)] sm:inline">Client portal</span>
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-[1176px] items-center justify-center">
        <div className="w-full max-w-[440px] rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-7 shadow-[0_18px_45px_rgba(31,62,91,.12)] sm:p-9">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--p-accent-weak)] text-xl text-[var(--p-accent)]">↗</span>
          <h1 className="mt-5 text-[28px] font-bold tracking-tight text-[var(--p-text)]">Welcome back</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-text-dim)]">
            Sign in to see your project’s latest progress, decisions, and next steps.
          </p>
          <LoginForm next={next} />
          <p className="mt-6 border-t border-[var(--p-border)] pt-5 text-center text-[12px] leading-relaxed text-[var(--p-text-dim)]">
            Use the shared portal account from your Universal Perk project team.
          </p>
        </div>
      </div>
    </div>
  );
}
