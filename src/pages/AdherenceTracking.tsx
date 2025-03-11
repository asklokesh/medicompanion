
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle, Calendar, Pill, PieChart, User, Clock, Download } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AdherenceTracking = () => {
  const adherenceData = [
    { name: 'Taken', value: 85, color: '#4ADE80' },
    { name: 'Missed', value: 10, color: '#F43F5E' },
    { name: 'Skipped', value: 5, color: '#F59E0B' },
  ];

  const seniorList = [
    { id: 1, name: 'Mary Johnson', adherence: 85, lastTaken: '2 hours ago', medications: 4 },
    { id: 2, name: 'Robert Smith', adherence: 72, lastTaken: '6 hours ago', medications: 3 },
    { id: 3, name: 'Patricia Wilson', adherence: 95, lastTaken: 'Today, 8:00 AM', medications: 2 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medication Adherence</h1>
            <p className="text-gray-500 mt-2">Monitor medication adherence for your seniors</p>
          </div>
          <div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Seniors Under Your Care</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seniorList.map((senior) => (
                  <Card key={senior.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{senior.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Pill className="h-3 w-3" /> {senior.medications} medications
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`text-lg font-bold ${
                            senior.adherence > 90 ? 'text-green-500' : 
                            senior.adherence > 70 ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {senior.adherence}%
                          </div>
                          <div className="text-xs text-gray-500">Adherence</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" /> Last taken: {senior.lastTaken}
                        </div>
                        <Button size="sm" variant="link" className="p-0">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Overall Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={adherenceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {adherenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-md bg-green-50">
                  <div className="font-bold text-green-600">85%</div>
                  <div className="text-xs text-gray-500">Taken</div>
                </div>
                <div className="p-2 rounded-md bg-red-50">
                  <div className="font-bold text-red-600">10%</div>
                  <div className="text-xs text-gray-500">Missed</div>
                </div>
                <div className="p-2 rounded-md bg-amber-50">
                  <div className="font-bold text-amber-600">5%</div>
                  <div className="text-xs text-gray-500">Skipped</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Set Up Adherence Alerts</h2>
              <p className="text-gray-600 mt-1">Get notified when seniors miss their medications</p>
            </div>
            <Button className="bg-indigo-500 hover:bg-indigo-600">
              <AlertCircle className="mr-2 h-4 w-4" /> Configure Alerts
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdherenceTracking;
