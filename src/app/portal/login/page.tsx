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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <BrandLogo href="/portal" />
        </div>
        <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
          <h1 className="text-lg font-bold">Client portal</h1>
          <p className="mt-1 text-[13px] text-[var(--p-text-dim)]">
            Sign in with the shared account we sent you.
          </p>
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
