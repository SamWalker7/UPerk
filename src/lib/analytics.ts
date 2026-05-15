export const GA_MEASUREMENT_ID = "G-6HQ3Q4MJR7";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    gtagInitialized?: boolean;
  }
}

function getGtag() {
  if (typeof window === "undefined") return undefined;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!window.gtagInitialized) {
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
    window.gtagInitialized = true;
  }

  return window.gtag;
}

export function trackPageView(path: string) {
  const gtag = getGtag();
  if (!gtag) return;

  gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  const gtag = getGtag();
  if (!gtag) return;

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );

  if (typeof cleanParams.category === "string") {
    cleanParams.event_category = cleanParams.category;
  }

  gtag("event", eventName, cleanParams);
}
