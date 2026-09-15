"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Fades a section up into place the first time it scrolls into view.
 * Uses IntersectionObserver directly rather than an animation library —
 * the effect is one class toggle, so a dependency isn't justified. The
 * observer disconnects after the first reveal; sections don't re-hide
 * when scrolled past. The `.reveal` / `.reveal.is-visible` styles (and
 * their `prefers-reduced-motion` opt-out) live in globals.css.
 */
export default function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
