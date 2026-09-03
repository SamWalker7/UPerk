import { PmAnnotation } from "./PmAnnotation";
import { Card, SectionTitle } from "./ui";
import type { BuildInfo, PortalRole, PrototypeLinks } from "@/lib/portal/types";

function LinkButton({
  href,
  children,
  primary,
}: {
  href?: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const cls = primary
    ? "bg-[var(--p-accent)] text-white hover:opacity-90"
    : "border border-[var(--p-border)] text-[var(--p-text)] hover:bg-[var(--p-surface-2)]";
  if (!href) {
    return (
      <span
        className={`cursor-not-allowed rounded-lg px-4 py-2 text-[13px] font-semibold opacity-40 ${cls}`}
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`rounded-lg px-4 py-2 text-[13px] font-semibold ${cls}`}
    >
      {children}
    </a>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--p-border)] py-3 text-[13px] last:border-0">
      <span className="text-[var(--p-text-dim)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SeeItWorking({
  prototype,
  build,
  role,
  slug,
}: {
  prototype: PrototypeLinks;
  build: BuildInfo;
  role: PortalRole;
  slug: string;
}) {
  return (
    <div>
      <SectionTitle title="See it working" aside={prototype.caption} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card className="flex items-center justify-center">
          {prototype.embedUrl ? (
            <iframe
              src={prototype.embedUrl}
              title="Embedded prototype"
              className="h-[520px] w-full rounded-xl border border-[var(--p-border)]"
              allow="fullscreen"
            />
          ) : (
            <div className="flex h-[480px] w-[240px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--p-border)] text-center text-[12px] text-[var(--p-text-dim)]">
              <span className="mb-2 text-2xl">🖼️</span>
              {prototype.frameLabel || "Embedded prototype"}
            </div>
          )}
        </Card>

        <div>
          <p className="text-[14px] leading-relaxed text-[var(--p-text-dim)]">
            This is the clickable prototype, not a picture. Tap through it the way you
            would the real app — it refreshes every time we push work, so what is here is
            what is built.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton href={prototype.prototypeUrl} primary>
              Open the prototype
            </LinkButton>
            <LinkButton href={prototype.installUrl}>
              {prototype.installLabel || "Install build"}
            </LinkButton>
            <LinkButton href={prototype.figmaUrl}>Figma file</LinkButton>
          </div>

          <Card className="mt-4 py-2">
            <Fact label="Latest build" value={`${build.version} — ${build.date}`} />
            <Fact
              label="Screens in prototype"
              value={`${build.screensBuilt} of ${build.screensTotal}`}
            />
            <Fact label="Known issues" value={build.knownIssues} />
            <Fact label="Tested on" value={build.testedOn} />
          </Card>

          {role === "pm" ? (
            <PmAnnotation
              linkLabel="+ Add / replace links"
              href={`/console?p=${slug}`}
            >
              {prototype.pmNote ||
                "Paste a Figma prototype URL and a TestFlight or Play link; the embed and the buttons update together."}
            </PmAnnotation>
          ) : null}
        </div>
      </div>
    </div>
  );
}
