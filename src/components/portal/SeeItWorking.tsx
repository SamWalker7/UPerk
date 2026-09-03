import { Section, Card } from "./Section";
import { PmAnnotation } from "./PmAnnotation";
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
    ? "bg-blue-600 text-white hover:opacity-90"
    : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800";
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
    <div className="flex items-center justify-between border-b border-slate-100 py-3 text-[13px] last:border-0 dark:border-slate-800">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function SeeItWorking({
  prototype,
  build,
  role,
}: {
  prototype: PrototypeLinks;
  build: BuildInfo;
  role: PortalRole;
}) {
  return (
    <Section title="See it working" aside={prototype.caption}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card className="flex items-center justify-center">
          {prototype.embedUrl ? (
            <iframe
              src={prototype.embedUrl}
              title="Embedded prototype"
              className="h-[520px] w-full rounded-xl border border-slate-200 dark:border-slate-700"
              allow="fullscreen"
            />
          ) : (
            <div className="flex h-[480px] w-[240px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 text-center text-[12px] text-slate-400 dark:border-slate-700">
              <span className="mb-2 text-2xl">🖼️</span>
              {prototype.frameLabel || "Embedded prototype"}
            </div>
          )}
        </Card>

        <div>
          <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-300">
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
            <PmAnnotation linkLabel="+ Add / replace links" href="/portal/console">
              {prototype.pmNote ||
                "Paste a Figma prototype URL and a TestFlight or Play link; the embed and the buttons update together."}
            </PmAnnotation>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
