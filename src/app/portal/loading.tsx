import { PageLoader } from "@/components/portal/Spinner";

export default function Loading() {
  return (
    <div className="portal-scope min-h-screen">
      <PageLoader />
    </div>
  );
}
