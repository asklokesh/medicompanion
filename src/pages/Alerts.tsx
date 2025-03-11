
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle, 
  Clock, 
  Filter, 
  Search,
  X,
  PhoneCall,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Alerts = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Enhanced alert data to match the designs you provided
  const alerts = [
    {
      id: 1,
      type: 'warning',
      priority: 'high',
      message: 'Medication schedule updated for Mary Johnson',
      description: 'The evening dose time has been changed from 8:00 PM to 7:00 PM',
      time: '5 minutes ago',
      relatedTo: 'Medication',
      status: 'unresolved'
    },
    {
      id: 2,
      type: 'info',
      priority: 'medium',
      message: 'New appointment scheduled with Dr. Smith',
      description: 'Cardiology check-up on March 15, 2024 at 10:30 AM',
      time: '1 hour ago',
      relatedTo: 'Appointment',
      status: 'unresolved'
    },
    {
      id: 3,
      type: 'success',
      priority: 'low',
      message: 'Daily health check completed',
      description: 'All vitals are within normal ranges. Great job!',
      time: '2 hours ago',
      relatedTo: 'Health Check',
      status: 'resolved'
    },
    {
      id: 4,
      type: 'warning',
      priority: 'high',
      message: 'Low medication supply for Lisinopril',
      description: 'Only 5 days of supply remaining. Consider refilling soon.',
      time: '1 day ago',
      relatedTo: 'Medication',
      status: 'unresolved'
    },
    {
      id: 5,
      type: 'warning',
      priority: 'high',
      message: 'Missed evening medication (Simvastatin 20mg)',
      description: 'The senior has missed their evening medication dose scheduled for 8:00 PM.',
      time: '6 hours ago',
      relatedTo: 'Medication',
      status: 'unresolved'
    },
    {
      id: 6,
      type: 'info',
      priority: 'medium',
      message: 'Wellness concern reported',
      description: 'Dorothy reported high pain level (6/10) and feeling unwell during daily check-in',
      time: '8 hours ago',
      relatedTo: 'Wellness',
      status: 'unresolved'
    }
  ];

  const filteredAlerts = alerts
    .filter(alert => {
      if (filter === "all") return true;
      return alert.type === filter && alert.status === "unresolved";
    })
    .filter(alert => {
      if (!searchTerm) return true;
      return (
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const openAlertDetail = (alert) => {
    setSelectedAlert(alert);
  };

  const closeAlertDetail = () => {
    setSelectedAlert(null);
  };

  const markAsResolved = (alertId) => {
    // This would typically update the backend, but for now we'll just close the dialog
    closeAlertDetail();
  };

  const getIconForAlertType = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getBackgroundGradientForAlertType = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-emerald-400';
      default:
        return 'bg-gradient-to-r from-blue-400 to-cyan-400';
    }
  };

  const getBackgroundColorForAlertType = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-500';
      case 'success':
        return 'bg-green-100 text-green-500';
      default:
        return 'bg-blue-100 text-blue-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500 mt-2">Stay updated with important notifications about your care recipients</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search alerts..." 
              className="pl-10 bg-white border-0 shadow-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <Card 
                key={alert.id} 
                className="hover:shadow-md transition-all overflow-hidden border-0 shadow-sm cursor-pointer"
                onClick={() => openAlertDetail(alert)}
              >
                <CardContent className="p-0">
                  <div className={`h-2 ${getBackgroundGradientForAlertType(alert.type)}`}></div>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${getBackgroundColorForAlertType(alert.type)}`}>
                        {getIconForAlertType(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-lg font-medium text-gray-900">{alert.message}</p>
                          {alert.priority === 'high' && (
                            <span className="bg-red-100 text-red-600 px-2 py-0.5 text-xs rounded-full font-medium">
                              High Priority
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{alert.time}</span>
                          <span className="mx-2">•</span>
                          <span>{alert.relatedTo}</span>
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
                  onClick={() => {
                    setFilter("all");
                    setSearchTerm("");
                  }}
                >
                  View all alerts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Alert Detail Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={closeAlertDetail}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
            <div className={`h-2 ${getBackgroundGradientForAlertType(selectedAlert.type)}`}></div>
            <DialogHeader className="px-6 pt-6 pb-2">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${getBackgroundColorForAlertType(selectedAlert.type)} flex items-center justify-center mr-4`}>
                  {getIconForAlertType(selectedAlert.type)}
                </div>
                <div>
                  <DialogTitle className="text-xl">{selectedAlert.type === 'warning' ? 'Warning Alert' : selectedAlert.type === 'success' ? 'Success Alert' : 'Information Alert'}</DialogTitle>
                  <p className="text-gray-600 text-sm">{selectedAlert.time}</p>
                </div>
              </div>
            </DialogHeader>
            
            <div className="px-6 py-4">
              <div className={`${
                selectedAlert.type === 'warning' ? 'bg-red-50' : 
                selectedAlert.type === 'success' ? 'bg-green-50' : 
                'bg-blue-50'} p-4 rounded-xl mb-5`}
              >
                <p className="text-lg">{selectedAlert.message}</p>
                <p className="text-gray-600 mt-1">{selectedAlert.description}</p>
              </div>
              
              {selectedAlert.type === 'warning' && selectedAlert.relatedTo === 'Medication' && (
                <div className="bg-gray-50 p-4 rounded-xl mb-5">
                  <h3 className="font-medium mb-2">Related Information</h3>
                  <div className="flex items-start mb-3">
                    <span className="text-xl mr-3">💊</span>
                    <div>
                      <p className="font-medium">Medication Details</p>
                      <p className="text-sm text-gray-600">Simvastatin 20mg</p>
                      <p className="text-sm text-gray-600">Take 1 tablet daily at bedtime</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                    <span className="text-sm">Prescribed by Dr. Johnson</span>
                    <Button variant="ghost" size="sm" className="text-blue-600">View Details</Button>
                  </div>
                </div>
              )}
              
              <h3 className="font-medium mb-3">Take Action</h3>
              <div className="space-y-3">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold py-5 px-4 rounded-xl flex items-center justify-center">
                  <PhoneCall className="h-4 w-4 mr-2" /> Call Senior
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-5 px-4 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" /> Send Message
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border border-gray-300 text-gray-700 bg-white text-base font-semibold py-5 px-4 rounded-xl flex items-center justify-center"
                  onClick={() => markAsResolved(selectedAlert.id)}
                >
                  <CheckCheck className="h-4 w-4 mr-2" /> Mark as Resolved
                </Button>
              </div>
              
              {selectedAlert.type === 'warning' && (
                <div className="mt-5 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-medium mb-2 text-blue-800">Suggestion</h3>
                  <p className="text-blue-800">
                    Consider setting up an automated reminder or adjusting the medication schedule to better fit their routine.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="bg-gray-50 px-6 py-4">
              <Button variant="ghost" onClick={closeAlertDetail}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Alerts;
