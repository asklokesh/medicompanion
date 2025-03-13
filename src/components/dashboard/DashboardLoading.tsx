
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </DashboardLayout>
  );
}
