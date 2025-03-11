
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, MessageCircle, Calendar, Clock, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Alerts = () => {
  const [filter, setFilter] = useState("all");
  
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Medication schedule updated for Mary Johnson',
      description: 'The evening dose time has been changed from 8:00 PM to 7:00 PM',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New appointment scheduled with Dr. Smith',
      description: 'Cardiology check-up on March 15, 2024 at 10:30 AM',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Daily health check completed',
      description: 'All vitals are within normal ranges. Great job!',
      time: '2 hours ago'
    },
    {
      id: 4,
      type: 'warning',
      message: 'Low medication supply for Lisinopril',
      description: 'Only 5 days of supply remaining. Consider refilling soon.',
      time: '1 day ago'
    }
  ];

  const filteredAlerts = filter === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500 mt-2">Stay updated with important notifications</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search alerts..." className="pl-10 bg-white border-0 shadow-sm" />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className={`${filter === "all" ? "bg-gray-100" : "bg-white"} border-0 shadow-sm`}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              className={`${filter === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-white"} border-0 shadow-sm`}
              onClick={() => setFilter("warning")}
            >
              <AlertTriangle className="h-4 w-4 mr-2" /> Warnings
            </Button>
            <Button 
              variant="outline" 
              className={`${filter === "info" ? "bg-blue-100 text-blue-700" : "bg-white"} border-0 shadow-sm`}
              onClick={() => setFilter("info")}
            >
              <Bell className="h-4 w-4 mr-2" /> Info
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-all overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className={`h-2 ${
                    alert.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 
                    alert.type === 'success' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 
                    'bg-gradient-to-r from-blue-400 to-cyan-400'
                  }`}></div>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                        alert.type === 'warning' ? 'bg-yellow-100 text-yellow-500' : 
                        alert.type === 'success' ? 'bg-green-100 text-green-500' : 
                        'bg-blue-100 text-blue-500'
                      }`}>
                        {alert.type === 'warning' ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : alert.type === 'success' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900">{alert.message}</p>
                        <p className="text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                          <MessageCircle className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-700">Mark as read</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700">No alerts found</h3>
                <p className="text-gray-500 mt-1">There are no alerts matching your current filter</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilter("all")}
                >
                  View all alerts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
