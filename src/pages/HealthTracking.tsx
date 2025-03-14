import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, TrendingUp, Thermometer, Plus, Droplets, LineChart, Clock, Weight, Watch, Smartphone } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { getHealthTrendsData, getLatestHealthMetrics, HealthData, HealthMetric } from "@/healthTrackingService";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { RecordHealthMetricModal } from "@/components/health/RecordHealthMetricModal";
import { DeviceIntegrationModal } from "@/components/health/DeviceIntegrationModal";

const HealthTracking = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordMetricOpen, setRecordMetricOpen] = useState(false);
  const [deviceIntegrationOpen, setDeviceIntegrationOpen] = useState(false);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const [trendsData, metricsData] = await Promise.all([
          getHealthTrendsData(user?.id),
          getLatestHealthMetrics(user?.id)
        ]);
        
        setHealthData(trendsData);
        setHealthMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching health data:", error);
        toast.error("Failed to load health data");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [user]);

  const getMetricByType = (type: string): HealthMetric | undefined => {
    return healthMetrics.find(metric => metric.type === type);
  };

  const handleMetricAdded = async () => {
    try {
      // Refresh the metrics data
      const metricsData = await getLatestHealthMetrics(user?.id);
      setHealthMetrics(metricsData);
      
      // Refresh the trends data
      const trendsData = await getHealthTrendsData(user?.id);
      setHealthData(trendsData);
    } catch (error) {
      console.error("Error refreshing health data:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Tracking</h1>
            <p className="text-gray-500 mt-2">Monitor your vital signs and health metrics</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setRecordMetricOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
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
              <div className="text-2xl font-bold">{getMetricByType('blood_pressure')?.value || '120/80'}</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Normal
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last recorded: {getMetricByType('blood_pressure') 
                  ? new Date(getMetricByType('blood_pressure')!.recorded_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: 'numeric', 
                      hour12: true 
                    }) 
                  : 'Today, 8:30 AM'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" /> Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getMetricByType('heart_rate')?.value || '72'} {getMetricByType('heart_rate')?.unit || 'BPM'}</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Resting
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last recorded: {getMetricByType('heart_rate') 
                  ? new Date(getMetricByType('heart_rate')!.recorded_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: 'numeric', 
                      hour12: true 
                    }) 
                  : 'Today, 8:30 AM'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-amber-500" /> Blood Glucose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getMetricByType('blood_glucose')?.value || '105'} {getMetricByType('blood_glucose')?.unit || 'mg/dL'}</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Normal
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last recorded: {getMetricByType('blood_glucose') 
                  ? new Date(getMetricByType('blood_glucose')!.recorded_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: 'numeric', 
                      hour12: true 
                    }) 
                  : 'Today, 7:00 AM'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Weight className="h-4 w-4 text-blue-500" /> Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getMetricByType('weight')?.value || '160'} {getMetricByType('weight')?.unit || 'lbs'}</div>
              <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" /> Stable
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last recorded: {getMetricByType('weight') 
                  ? new Date(getMetricByType('weight')!.recorded_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: 'numeric', 
                      hour12: true 
                    }) 
                  : 'Yesterday, 6:00 PM'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weekly Health Trends</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1 border-amber-200 text-amber-700">
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
                  <Area type="monotone" dataKey="bp" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Blood Pressure" />
                  <Area type="monotone" dataKey="pulse" stroke="#EA580C" fill="#EA580C" fillOpacity={0.2} name="Heart Rate" />
                  <Area type="monotone" dataKey="glucose" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Blood Glucose" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="p-6 bg-gradient-to-r from-amber-50 to-red-50 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Connect Health Devices</h2>
              <p className="text-gray-600 mt-1">Sync with your Fitbit, Apple Watch, or other smart health devices</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
              onClick={() => setDeviceIntegrationOpen(true)}
            >
              Connect Devices
            </Button>
          </div>
        </div>
      </div>

      <RecordHealthMetricModal
        open={recordMetricOpen}
        onOpenChange={setRecordMetricOpen}
        onMetricAdded={handleMetricAdded}
      />

      <DeviceIntegrationModal
        open={deviceIntegrationOpen}
        onOpenChange={setDeviceIntegrationOpen}
      />
    </DashboardLayout>
  );
};

export default HealthTracking;
