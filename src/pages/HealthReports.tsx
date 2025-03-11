
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp } from "lucide-react";

const HealthReports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Reports</h1>
          <p className="text-gray-500 mt-2">View and download health summary reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>Generated on March 1, 2024</span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Medication Adherence Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>Last 30 days analysis</span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthReports;
