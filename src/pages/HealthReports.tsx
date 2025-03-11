
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, Calendar, FileBarChart, FilePlus, Heart, Activity } from "lucide-react";

const HealthReports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Reports</h1>
          <p className="text-gray-500 mt-2">View and download health summary reports</p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileBarChart className="h-5 w-5 mr-2" /> Monthly Health Summary
            </h2>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-gray-700 text-sm">Blood Pressure</p>
                <p className="text-2xl font-bold text-gray-900">122/78</p>
                <p className="text-green-600 text-sm">Normal</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-700 text-sm">Heart Rate</p>
                <p className="text-2xl font-bold text-gray-900">72 BPM</p>
                <p className="text-green-600 text-sm">Resting</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-gray-700 text-sm">Blood Glucose</p>
                <p className="text-2xl font-bold text-gray-900">105 mg/dL</p>
                <p className="text-green-600 text-sm">Normal</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl flex items-center mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-grow">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Report Period: February 1 - February 28, 2024</span>
              </div>
              <div>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">Available</span>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center py-6 text-lg shadow-md rounded-xl">
              <Download className="h-5 w-5 mr-2" /> Download Full Report
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-all border-0 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-green-500 p-4">
              <CardTitle className="text-lg text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" /> Medication Report
              </CardTitle>
            </div>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Generated on March 1, 2024</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Analysis of medication adherence patterns and effectiveness over the last 30 days.
              </p>
              <Button variant="outline" className="w-full rounded-xl hover:bg-teal-50 border-teal-200 text-teal-700">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all border-0 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
              <CardTitle className="text-lg text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Wellness Trends
              </CardTitle>
            </div>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Last 30 days analysis</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Comprehensive trends in daily health metrics, mood, and activity levels.
              </p>
              <Button variant="outline" className="w-full rounded-xl hover:bg-purple-50 border-purple-200 text-purple-700">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all border-0 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
              <CardTitle className="text-lg text-white flex items-center">
                <FilePlus className="h-5 w-5 mr-2" /> Custom Report
              </CardTitle>
            </div>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Select your parameters</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Create a custom health report by selecting specific metrics and time periods.
              </p>
              <Button variant="outline" className="w-full rounded-xl hover:bg-orange-50 border-orange-200 text-orange-700">
                <FilePlus className="h-4 w-4 mr-2" /> Create Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share Reports with Caregivers</h2>
              <p className="text-gray-600 mt-1">Give your family and healthcare providers easy access to your health data</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md rounded-xl py-5 px-6">
              Manage Sharing Settings
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthReports;
