
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const CaregiverConnect = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Connection</h1>
          <p className="text-gray-500 mt-2">
            Stay connected with your family members
          </p>
        </div>

        <Card className="rounded-3xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Family Connection</CardTitle>
            <CardDescription>
              This feature will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Clock className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-gray-500 max-w-md">
              We're working on making it easier for you to connect with your family members.
              This feature will be available in a future update.
            </p>
            <Button className="mt-6 rounded-xl px-8 py-6 text-lg" size="lg">
              Notify Me When Available
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CaregiverConnect;
