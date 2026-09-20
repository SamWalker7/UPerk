import { PmAnnotation } from "./PmAnnotation";
import { PrototypeEmbed } from "./PrototypeEmbed";
import { Card, SectionTitle } from "./ui";
import { formatDate } from "@/lib/portal/format";
import { toFigmaEmbedUrl } from "@/lib/portal/figma";
import type { BuildInfo, PortalRole, ProjectLink } from "@/lib/portal/types";

const LINK_TYPE_LABEL: Record<ProjectLink["type"], string> = {
  figma: "Figma file",
  playstore: "Play Store build",
  testflight: "TestFlight build",
  other: "Link",
};

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

/** Colour the "known issues" dot from the free-text value. */
function knownIssuesDot(text: string): "ok" | "warn" | "risk" {
  const t = text.trim().toLowerCase();
  // "none", "no known issues", "0" → clear
  if (!t || /^(none|no known|0\b|nothing)/.test(t) || t === "—") return "ok";
  // issues exist and at least one blocks → risk; otherwise amber
  return /(?<!none |not |no )blocking/.test(t) ? "risk" : "warn";
}

function Fact({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  /** small status dot before the value, e.g. amber for "known issues" */
  dot?: "ok" | "warn" | "risk";
}) {
  const dotColor =
    dot === "warn"
      ? "bg-[var(--p-warn)]"
      : dot === "risk"
        ? "bg-[var(--p-risk)]"
        : "bg-[var(--p-ok)]";
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--p-border)] py-3 text-[13px] last:border-0">
      <span className="text-[var(--p-text-dim)]">{label}</span>
      <span className="flex items-center gap-2 text-right font-medium">
        {dot ? (
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} />
        ) : null}
        {value}
      </span>
    </div>
  );
}

export function SeeItWorking({
  links,
  build,
  role,
  slug,
}: {
  links: ProjectLink[];
  build: BuildInfo;
  role: PortalRole;
  slug: string;
}) {
  const figmaLink = links.find((l) => l.type === "figma");
  const installLink = links.find((l) => l.type === "playstore" || l.type === "testflight");
  const primaryLink = links[0];
  const otherLinks = links.filter((l) => l !== figmaLink && l !== installLink && l !== primaryLink);

  // What goes in the iframe: derive an embeddable URL from the Figma link.
  const embedSrc = toFigmaEmbedUrl(figmaLink?.url) || null;

  return (
    <div>
      <SectionTitle title="See it working" aside={primaryLink?.description} />
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Card className="flex items-center justify-center">
          {embedSrc ? (
            <PrototypeEmbed
              src={embedSrc}
              title={figmaLink?.title || "Embedded prototype"}
            />
          ) : (
            <div className="flex h-[480px] w-full max-w-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-2)] px-6 text-center text-[12px] text-[var(--p-text-dim)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="mb-3 h-8 w-8 text-[var(--p-text-dim)]"
                aria-hidden
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path
                  d="M21 15l-4.5-4.5L7 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {figmaLink?.title || "Embedded prototype"}
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
            {links.length === 0 ? (
              <LinkButton primary>Open the prototype</LinkButton>
            ) : (
              links.map((link) => (
                <LinkButton key={link.id} href={link.url} primary={link === primaryLink}>
                  {link.title || LINK_TYPE_LABEL[link.type]}
                </LinkButton>
              ))
            )}
          </div>

          <Card className="mt-4 py-2">
            <Fact
              label="Latest build"
              value={`${build.version} — ${formatDate(build.date)}`}
            />
            <Fact
              label="Screens in prototype"
              value={`${build.screensBuilt} of ${build.screensTotal}`}
            />
            <Fact
              label="Known issues"
              value={build.knownIssues}
              dot={knownIssuesDot(build.knownIssues)}
            />
            <Fact label="Tested on" value={build.testedOn} />
          </Card>

          {otherLinks.length > 0 ? (
            <div className="mt-4 space-y-2">
              {otherLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-[12px]"
                >
                  <p className="font-semibold text-[var(--p-text)]">
                    {link.title || LINK_TYPE_LABEL[link.type]}
                    {link.buildVersion ? ` — ${link.buildVersion}` : ""}
                  </p>
                  {link.description ? (
                    <p className="mt-0.5 text-[var(--p-text-dim)]">{link.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {role === "pm" ? (
            <PmAnnotation
              linkLabel="+ Add / replace links"
              href={`/console?p=${slug}`}
            >
              <span className="font-semibold text-[var(--p-text)]">
                — how this area gets filled
              </span>
              <span className="mt-1.5 block">
                Add a Figma prototype or share URL and a TestFlight or Play link;
                the embed and the buttons update together. Give each link its own
                title, description and build version.
              </span>
            </PmAnnotation>
          ) : null}
        </div>
      </div>
    </div>
  );
}
