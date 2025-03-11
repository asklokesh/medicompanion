
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday, parseISO, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, X, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time_of_day: string[];
  user_id: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  status: 'taken' | 'skipped' | 'missed';
  taken_at: string;
}

const SchedulePage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch medications
        const { data: medicationsData, error: medicationsError } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);
          
        if (medicationsError) throw medicationsError;
        
        if (medicationsData) {
          setMedications(medicationsData);
        }
        
        // Fetch medication logs for the selected date
        await fetchMedicationLogs(selectedDate);
        
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        toast.error("Failed to load schedule data");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  const fetchMedicationLogs = async (date: Date) => {
    if (!user) return;
    
    try {
      // Create date range for the selected day (start to end of day)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('taken_at', startDate.toISOString())
        .lte('taken_at', endDate.toISOString());
        
      if (error) throw error;
      
      if (data) {
        // Convert to properly typed MedicationLog objects
        const typedLogs: MedicationLog[] = data.map(log => ({
          id: log.id,
          medication_id: log.medication_id,
          status: log.status as 'taken' | 'skipped' | 'missed',
          taken_at: log.taken_at
        }));
        setMedicationLogs(typedLogs);
      }
    } catch (error) {
      console.error("Error fetching medication logs:", error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchMedicationLogs(date);
    }
  };

  const getMedicationStatus = (medicationId: string): 'taken' | 'skipped' | 'missed' | 'pending' => {
    const log = medicationLogs.find(log => log.medication_id === medicationId);
    
    if (!log) return 'pending';
    return log.status;
  };

  const handleMedicationAction = async (medicationId: string, status: 'taken' | 'skipped') => {
    if (!user) return;
    
    try {
      // Check if there's an existing log
      const existingLog = medicationLogs.find(log => log.medication_id === medicationId);
      
      if (existingLog) {
        // Update existing log
        const { error } = await supabase
          .from('medication_logs')
          .update({ status })
          .eq('id', existingLog.id);
          
        if (error) throw error;
      } else {
        // Create new log
        const { error } = await supabase
          .from('medication_logs')
          .insert([{
            medication_id: medicationId,
            user_id: user.id,
            status,
            taken_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
      }
      
      // Refresh logs
      await fetchMedicationLogs(selectedDate);
      
      toast.success(`Medication marked as ${status}`);
    } catch (error) {
      console.error("Error updating medication status:", error);
      toast.error("Failed to update medication status");
    }
  };

  const filterMedications = (medications: Medication[], timeOfDay: string | null = null) => {
    if (!timeOfDay || timeOfDay === 'all') {
      return medications;
    }
    
    return medications.filter(med => med.time_of_day.includes(timeOfDay));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar */}
          <Card className="w-full md:w-auto md:min-w-[350px]">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
              
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">
                  {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
                </h3>
              </div>
            </CardContent>
          </Card>
          
          {/* Medications List */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Medication Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-primary/50" />
                  <h3 className="mt-4 text-xl font-medium">No medications scheduled</h3>
                  <p className="text-gray-500">Add medications to see your schedule</p>
                </div>
              ) : (
                <>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="morning">Morning</TabsTrigger>
                      <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
                      <TabsTrigger value="evening">Evening</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={activeTab} className="space-y-4">
                      {filterMedications(medications, activeTab === 'all' ? null : activeTab).map((medication) => {
                        const status = getMedicationStatus(medication.id);
                        
                        return (
                          <div 
                            key={medication.id}
                            className={`p-4 border rounded-lg ${
                              status === 'taken' ? 'bg-green-50 border-green-200' :
                              status === 'skipped' ? 'bg-gray-50 border-gray-200' :
                              status === 'missed' ? 'bg-red-50 border-red-200' :
                              'bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-medium">{medication.name}</h4>
                                <div className="text-sm text-gray-500">
                                  <span>{medication.dosage}</span>
                                  <span className="mx-2">•</span>
                                  <span className="capitalize">{medication.time_of_day.join(', ')}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {status === 'pending' ? (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="border-green-500 text-green-500 hover:bg-green-50"
                                      onClick={() => handleMedicationAction(medication.id, 'taken')}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Taken
                                    </Button>
                                    
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="border-gray-400 text-gray-400 hover:bg-gray-50"
                                      onClick={() => handleMedicationAction(medication.id, 'skipped')}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Skip
                                    </Button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    {status === 'taken' && <Check className="h-5 w-5 text-green-500" />}
                                    {status === 'skipped' && <X className="h-5 w-5 text-gray-400" />}
                                    {status === 'missed' && <Bell className="h-5 w-5 text-red-500" />}
                                    <span className="capitalize">{status}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {filterMedications(medications, activeTab === 'all' ? null : activeTab).length === 0 && (
                        <div className="text-center py-8">
                          <Clock className="mx-auto h-10 w-10 text-gray-300" />
                          <p className="mt-2 text-gray-500">No medications scheduled for this time period</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
