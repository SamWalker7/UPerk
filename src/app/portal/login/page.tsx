import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPortalRole } from "@/lib/portal/session";
import LoginForm from "@/components/portal/LoginForm";
import { BrandLogo } from "@/components/portal/BrandLogo";

export const metadata: Metadata = {
  title: "Sign in | Client portal",
  robots: { index: false, follow: false },
};

const PILLARS = [
  {
    verb: "Modernize",
    tag: "Web · Mobile · Software Engineering",
    proof: "Up to 300% performance improvement post-migration.",
  },
  {
    verb: "Automate",
    tag: "AI Agents · Workflows · Integrations",
    proof: "80%+ query automation within the first month.",
  },
  {
    verb: "Scale",
    tag: "Cloud · DevOps · Infrastructure",
    proof: "AWS, GCP, Azure, Kubernetes, Docker - full stack.",
  },
];

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
    <div className="portal-scope min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Credibility panel — desktop only */}
      <div className="relative hidden overflow-hidden bg-[var(--p-hero)] px-12 py-14 text-[var(--p-hero-text)] lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[var(--p-accent)]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative">
          <HeroBrandLogo />

          <div className="mt-20 max-w-md">
            <h1 className="text-[34px] font-bold leading-[1.15] tracking-tight">
              One team. Every layer.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--p-hero-dim)]">
              One trusted partner for web, mobile, cloud, DevOps, and AI.
              The same team that designs your architecture ships your code
              and manages your infrastructure.
            </p>
          </div>
        </div>

        <div className="relative mt-16 space-y-6 border-t border-white/10 pt-10">
          {PILLARS.map((p) => (
            <div key={p.verb} className="flex items-start gap-4">
              <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/10 text-[13px] font-bold">
                {p.verb.charAt(0)}
              </span>
              <div>
                <p className="text-[14px] font-semibold">
                  {p.verb}
                  <span className="ml-2 text-[12px] font-normal text-[var(--p-hero-dim)]">
                    {p.tag}
                  </span>
                </p>
                <p className="mt-0.5 text-[13px] text-[var(--p-hero-dim)]">
                  {p.proof}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative mt-14 text-[12px] text-[var(--p-hero-dim)]">
          © {new Date().getFullYear()} Universal Perk
        </p>
      </div>

      {/* Sign-in panel */}
      <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_#ffffff_0,_#f1f6fc_48%,_#eaf1f8_100%)] px-4 py-8 sm:py-12 lg:bg-none lg:bg-white">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between lg:hidden">
          <BrandLogo href="/portal" />
          <span className="hidden text-[13px] text-[var(--p-text-dim)] sm:inline">
            Client portal
          </span>
        </div>

        <div className="mx-auto mt-6 w-full max-w-[440px] rounded-2xl bg-[var(--p-hero)] px-5 py-5 text-[var(--p-hero-text)] lg:hidden">
          <h1 className="text-[19px] font-bold leading-snug tracking-tight">
            One team. Every layer.
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--p-hero-dim)]">
            Web, mobile, cloud, DevOps, and AI — one trusted partner.
          </p>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {PILLARS.map((p) => (
              <span
                key={p.verb}
                className="flex-shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold"
              >
                {p.verb}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col items-stretch justify-center lg:max-w-[400px]">
          <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-7 shadow-[0_18px_45px_rgba(31,62,91,.12)] sm:p-9 lg:border-none lg:shadow-none">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--p-accent-weak)] text-xl text-[var(--p-accent)]">
              ↗
            </span>
            <h1 className="mt-5 text-[28px] font-bold tracking-tight text-[var(--p-text)]">
              Welcome back
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-text-dim)]">
              Sign in to see your project&rsquo;s latest progress, decisions,
              and next steps.
            </p>
            <LoginForm next={next} />
            <p className="mt-6 border-t border-[var(--p-border)] pt-5 text-center text-[12px] leading-relaxed text-[var(--p-text-dim )]">
              Use the shared portal account from your Universal Perk project
              team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroBrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/icons/logo.svg"
        width={26}
        height={26}
        alt="Universal Perk"
        className="h-[26px] w-[26px] rounded-[6px]"
      />
      <span className="text-[16px] font-bold tracking-tight">
        Universal Perk
      </span>
    </Link>
  );
}
