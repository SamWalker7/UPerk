import { PageLoader } from "@/components/portal/Spinner";

// Shown while a project's data loads (the page itself is one long scroll now).
export default function Loading() {
  return <PageLoader label="Loading project…" />;
}
