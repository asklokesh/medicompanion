
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const AppointmentManager = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Manager</h1>
            <p className="text-gray-500 mt-2">Schedule and manage medical appointments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Appointment
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search appointments..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Dr. Smith - Cardiology</span>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Tomorrow, 10:30 AM</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Regular checkup and medication review</p>
              <Button variant="outline" className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentManager;
