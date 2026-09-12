import { trackPageView } from "@/lib/analytics";

export const GET_STARTED_HASH = "getstarted";
export const GET_STARTED_HASH_FRAGMENT = `#${GET_STARTED_HASH}`;

export function hasGetStartedHash() {
  if (typeof window === "undefined") return false;

  return window.location.hash === GET_STARTED_HASH_FRAGMENT;
}

export function setGetStartedHash() {
  if (typeof window === "undefined") return;

  const pathWithQuery = `${window.location.pathname}${window.location.search}`;
  const pathWithHash = `${pathWithQuery}${GET_STARTED_HASH_FRAGMENT}`;

  if (window.location.hash !== GET_STARTED_HASH_FRAGMENT) {
    window.history.pushState(null, "", pathWithHash);
  }

  trackPageView(pathWithHash);
}

export function clearGetStartedHash() {
  if (typeof window === "undefined") return;
  if (window.location.hash !== GET_STARTED_HASH_FRAGMENT) return;

  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}`
  );
}
