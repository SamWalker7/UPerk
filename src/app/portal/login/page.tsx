import type { Metadata } from "next";
import { PortalLoginClient } from "@/components/portal/PortalLoginClient";

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
  return <PortalLoginClient next={next} />;
}
