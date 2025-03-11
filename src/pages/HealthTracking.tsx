
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, TrendingUp, Thermometer, Plus, Droplets, LineChart, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const healthData = [
  { day: 'Mon', bp: 120, pulse: 72, glucose: 110 },
  { day: 'Tue', bp: 118, pulse: 74, glucose: 105 },
  { day: 'Wed', bp: 122, pulse: 70, glucose: 112 },
  { day: 'Thu', bp: 125, pulse: 73, glucose: 108 },
  { day: 'Fri', bp: 119, pulse: 71, glucose: 106 },
  { day: 'Sat', bp: 121, pulse: 69, glucose: 104 },
  { day: 'Sun', bp: 117, pulse: 70, glucose: 102 },
];

const HealthTracking = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Tracking</h1>
            <p className="text-gray-500 mt-2">Monitor your vital signs and health metrics</p>
          </div>
          <div>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Record New
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" /> Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120/80</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Normal
              </div>
              <div className="text-xs text-gray-500 mt-1">Last recorded: Today, 8:30 AM</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" /> Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72 BPM</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Resting
              </div>
              <div className="text-xs text-gray-500 mt-1">Last recorded: Today, 8:30 AM</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-purple-500" /> Blood Glucose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">105 mg/dL</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Normal
              </div>
              <div className="text-xs text-gray-500 mt-1">Last recorded: Today, 7:00 AM</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" /> Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.6°F</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Normal
              </div>
              <div className="text-xs text-gray-500 mt-1">Last recorded: Yesterday, 6:00 PM</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weekly Health Trends</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" /> Weekly View
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="bp" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="pulse" stroke="#4ADE80" fill="#4ADE80" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="glucose" stroke="#F472B6" fill="#F472B6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Connect Health Devices</h2>
              <p className="text-gray-600 mt-1">Sync with your smart health devices for automatic tracking</p>
            </div>
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              Connect Devices
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthTracking;
