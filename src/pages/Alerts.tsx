
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Medication schedule updated for Mary Johnson',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New appointment scheduled with Dr. Smith',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Daily health check completed',
      time: '2 hours ago'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500 mt-2">Stay updated with important notifications</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                  ) : alert.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  ) : (
                    <Bell className="h-5 w-5 text-blue-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">Mark as read</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
