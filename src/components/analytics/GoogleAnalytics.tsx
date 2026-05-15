"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  GA_MEASUREMENT_ID,
  trackEvent,
  trackPageView,
} from "@/lib/analytics";

function getElementLabel(element: HTMLElement) {
  const explicitLabel = element.dataset.analyticsLabel;
  if (explicitLabel) return explicitLabel;

  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const text = element.textContent?.replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 120);

  return element.tagName.toLowerCase();
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const source = event.target;
      if (!(source instanceof Element)) return;

      const element = source.closest(
        "[data-analytics-event], a, button"
      ) as HTMLElement | null;
      if (!element) return;

      const isLink = element instanceof HTMLAnchorElement;
      const eventName =
        element.dataset.analyticsEvent || (isLink ? "link_click" : "button_click");

      trackEvent(eventName, {
        category: element.dataset.analyticsCategory || "engagement",
        label: getElementLabel(element),
        href: isLink ? element.href : undefined,
        path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          if (!window.gtagInitialized) {
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            window.gtagInitialized = true;
          }
        `}
      </Script>
    </>
  );
}
