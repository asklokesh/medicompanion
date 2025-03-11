import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";
import { Pill, AlertCircle, CalendarIcon, Clock, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes?: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  status: 'taken' | 'skipped' | 'missed';
  taken_at: string;
}

const Schedule = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("today");

  const timeSlots = ["morning", "afternoon", "evening", "night"];
  
  const timeLabels: Record<string, { label: string, icon: React.ReactNode }> = {
    morning: { 
      label: "Morning (5am - 12pm)", 
      icon: <Clock className="h-5 w-5 text-yellow-500" /> 
    },
    afternoon: { 
      label: "Afternoon (12pm - 5pm)", 
      icon: <Clock className="h-5 w-5 text-orange-500" /> 
    },
    evening: { 
      label: "Evening (5pm - 9pm)", 
      icon: <Clock className="h-5 w-5 text-blue-500" /> 
    },
    night: { 
      label: "Night (9pm - 5am)", 
      icon: <Clock className="h-5 w-5 text-indigo-700" /> 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        
        try {
          // Fetch all medications
          const { data: medicationsData, error: medicationsError } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', user.id);
          
          if (medicationsError) throw medicationsError;
          
          if (medicationsData) {
            setMedications(medicationsData);
          }

          // Fetch medication logs for selected date
          const startOfDay = new Date(selectedDate);
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(selectedDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          const { data: logsData, error: logsError } = await supabase
            .from('medication_logs')
            .select('*')
            .eq('user_id', user.id)
            .gte('taken_at', startOfDay.toISOString())
            .lte('taken_at', endOfDay.toISOString());
          
          if (logsError) throw logsError;
          
          if (logsData) {
            // Convert data to MedicationLog type
            const typedLogs = logsData.map(log => ({
              ...log,
              status: log.status as 'taken' | 'skipped' | 'missed'
            }));
            setMedicationLogs(typedLogs);
          }
        } catch (error) {
          toast.error("Failed to load schedule data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, selectedDate]);

  const isMedicationTaken = (medicationId: string, timeSlot: string) => {
    const today = new Date();
    return medicationLogs.some(log => 
      log.medication_id === medicationId && 
      isSameDay(new Date(log.taken_at), selectedDate)
    );
  };

  const getMedicationsForTimeSlot = (timeSlot: string) => {
    return medications.filter(med => 
      med.time_of_day.includes(timeSlot)
    );
  };

  const markMedicationAsTaken = async (medicationId: string) => {
    try {
      const { data, error } = await supabase
        .from('medication_logs')
        .insert({
          medication_id: medicationId,
          user_id: user?.id,
          status: 'taken' as const,
          taken_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Refresh medication logs
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data: updatedLogs, error: fetchError } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('taken_at', startOfDay.toISOString())
        .lte('taken_at', endOfDay.toISOString());
      
      if (!fetchError && updatedLogs) {
        const typedLogs = updatedLogs.map(log => ({
          ...log,
          status: log.status as 'taken' | 'skipped' | 'missed'
        }));
        setMedicationLogs(typedLogs);
      }
      
      toast.success("Medication marked as taken!");
    } catch (error) {
      toast.error("Failed to update medication status");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setActiveTab("calendar");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Medication Schedule</h1>

        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-6 mt-4">
            {timeSlots.map((timeSlot) => {
              const medsForSlot = getMedicationsForTimeSlot(timeSlot);
              
              return (
                <Card key={timeSlot}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {timeLabels[timeSlot].icon}
                      <CardTitle className="text-lg">
                        {timeLabels[timeSlot].label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {medsForSlot.length > 0 ? (
                      <div className="space-y-3">
                        {medsForSlot.map((med) => {
                          const taken = isMedicationTaken(med.id, timeSlot);
                          
                          return (
                            <div 
                              key={med.id} 
                              className="flex items-center justify-between p-3 rounded-lg border"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Pill className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className={`font-medium ${taken ? 'text-gray-500 line-through' : ''}`}>
                                    {med.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">{med.dosage}</p>
                                </div>
                              </div>
                              
                              {!taken ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => markMedicationAsTaken(med.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Check className="h-4 w-4" />
                                  Take
                                </Button>
                              ) : (
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                  <Check className="h-4 w-4" />
                                  Taken
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No medications scheduled for this time
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {medications.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-medium">No medications scheduled</h3>
                  <p className="text-gray-500">
                    Add medications to view your schedule
                  </p>
                  <Button asChild>
                    <Link to="/medications/add">Add Medication</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-6 mt-4">
            <Card>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="mx-auto border rounded-md p-3"
                />
              </CardContent>
            </Card>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">
                Schedule for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h2>
            </div>
            
            {timeSlots.map((timeSlot) => {
              const medsForSlot = getMedicationsForTimeSlot(timeSlot);
              
              if (medsForSlot.length === 0) return null;
              
              return (
                <Card key={timeSlot}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {timeLabels[timeSlot].icon}
                      <CardTitle className="text-lg">
                        {timeLabels[timeSlot].label}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {medsForSlot.map((med) => {
                        const taken = isMedicationTaken(med.id, timeSlot);
                        
                        return (
                          <div 
                            key={med.id} 
                            className="flex items-center justify-between p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Pill className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className={`font-medium ${taken ? 'text-gray-500 line-through' : ''}`}>
                                  {med.name}
                                </h3>
                                <p className="text-sm text-gray-500">{med.dosage}</p>
                              </div>
                            </div>
                            
                            {isSameDay(selectedDate, new Date()) && (
                              !taken ? (
                                <Button 
                                  size="sm" 
                                  onClick={() => markMedicationAsTaken(med.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Check className="h-4 w-4" />
                                  Take
                                </Button>
                              ) : (
                                <span className="text-sm text-green-600 flex items-center gap-1">
                                  <Check className="h-4 w-4" />
                                  Taken
                                </span>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {timeSlots.every(slot => getMedicationsForTimeSlot(slot).length === 0) && (
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-medium">No medications scheduled</h3>
                  <p className="text-gray-500">
                    No medications scheduled for this date
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
