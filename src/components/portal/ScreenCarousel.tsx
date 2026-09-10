"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate } from "@/lib/portal/format";
import type { FinishedScreen } from "@/lib/portal/types";

export function ScreenCarousel({ screens }: { screens: FinishedScreen[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // one card + gap ≈ 156px; page by roughly the visible width, min one card
    const amount = Math.max(156, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const canScroll = !atStart || !atEnd;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {screens.map((s) => (
          <figure key={s.id} className="w-36 shrink-0">
            <div className="flex h-[280px] items-center justify-center overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-2)] text-[12px] text-[var(--p-text-dim)]">
              {s.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-2xl">🖼️</span>
              )}
            </div>
            <figcaption className="mt-2">
              <p className="text-[13px] font-medium">{s.name}</p>
              <p className="text-[12px] text-[var(--p-text-dim)]">
                {formatDate(s.date)}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {canScroll ? (
        <>
          <CarouselButton
            side="left"
            disabled={atStart}
            onClick={() => scrollByCards(-1)}
          />
          <CarouselButton
            side="right"
            disabled={atEnd}
            onClick={() => scrollByCards(1)}
          />
        </>
      ) : null}
    </div>
  );
}

function CarouselButton({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous screens" : "More screens"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-[140px] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text)] shadow-[0_4px_14px_rgba(20,55,86,.14)] transition-opacity hover:bg-[var(--p-surface-2)] disabled:pointer-events-none disabled:opacity-0 ${
        side === "left" ? "left-0 -ml-2" : "right-0 -mr-2"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
        <path
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
