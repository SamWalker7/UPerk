"use client";

import { useState } from "react";
import { Spinner } from "./Spinner";

/**
 * The Figma / prototype iframe with a centred loader shown until it fires
 * `load`. Figma can take a few seconds to hand back its first frame, so the
 * spinner sits over the iframe area rather than leaving a blank box.
 */
export function PrototypeEmbed({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)]">
      <iframe
        src={src}
        title={title}
        className={`h-full w-full transition-opacity duration-300 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        }`}
        allow="fullscreen; clipboard-write"
        loading="lazy"
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
      />

      {state !== "ready" ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--p-text-dim)]">
          {state === "loading" ? (
            <>
              <Spinner className="h-6 w-6" />
              <span className="text-[12px]">Loading the prototype…</span>
            </>
          ) : (
            <span className="max-w-[220px] px-4 text-center text-[12px]">
              The prototype couldn&apos;t load. Open it in a new tab instead.
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
