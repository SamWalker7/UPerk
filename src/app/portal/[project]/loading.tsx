import { PageLoader } from "@/components/portal/Spinner";

// Shown while a project's data + tab load.
export default function Loading() {
  return <PageLoader label="Loading project…" />;
}
