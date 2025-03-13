import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Calendar, Camera, Clock, AlertCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time_of_day: string[];
}

interface MedicationLog {
  id: string;
  medication_id: string;
  status: 'taken' | 'skipped' | 'missed';
  taken_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMedications, setCurrentMedications] = useState<Medication[]>([]);
  const [streak, setStreak] = useState(28);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [caregiverMessage, setCaregiverMessage] = useState("\"Mom, don't forget your pills! ❤️\" - Emily");

  const currentHour = new Date().getHours();
  const timeOfDay = 
    currentHour >= 5 && currentHour < 12 ? 'morning' :
    currentHour >= 12 && currentHour < 17 ? 'afternoon' :
    currentHour >= 17 && currentHour < 21 ? 'evening' : 'night';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setUserProfile(data);
        }
      }
    };

    const fetchMedications = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);
        
        if (data && !error) {
          setMedications(data);
          
          const filtered = data.filter(med => 
            med.time_of_day.includes(timeOfDay)
          );
          setCurrentMedications(filtered);
        }
      }
    };

    const fetchMedicationLogs = async () => {
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
          .from('medication_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('taken_at', today.toISOString());
        
        if (data && !error) {
          const typedLogs: MedicationLog[] = data.map(log => ({
            id: log.id,
            medication_id: log.medication_id,
            status: log.status as 'taken' | 'skipped' | 'missed',
            taken_at: log.taken_at
          }));
          setMedicationLogs(typedLogs);
        }
      }
    };

    Promise.all([
      fetchUserProfile(),
      fetchMedications(),
      fetchMedicationLogs()
    ]).finally(() => {
      setLoading(false);
    });
  }, [user, timeOfDay]);

  const getGreeting = () => {
    if (currentHour >= 5 && currentHour < 12) return "Good Morning";
    if (currentHour >= 12 && currentHour < 17) return "Good Afternoon";
    if (currentHour >= 17 && currentHour < 21) return "Good Evening";
    return "Good Night";
  };

  const markMedicationsTaken = async () => {
    try {
      const logs = currentMedications.map(med => ({
        medication_id: med.id,
        user_id: user?.id,
        status: 'taken' as const,
        taken_at: new Date().toISOString()
      }));

      if (logs.length > 0) {
        const { data, error } = await supabase
          .from('medication_logs')
          .insert(logs);

        if (error) throw error;
        
        toast.success("Medications marked as taken!");
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: updatedLogs, error: fetchError } = await supabase
          .from('medication_logs')
          .select('*')
          .eq('user_id', user?.id)
          .gte('taken_at', today.toISOString());
          
        if (!fetchError && updatedLogs) {
          const typedLogs: MedicationLog[] = updatedLogs.map(log => ({
            id: log.id,
            medication_id: log.medication_id,
            status: log.status as 'taken' | 'skipped' | 'missed',
            taken_at: log.taken_at
          }));
          setMedicationLogs(typedLogs);
        }
      }
    } catch (error) {
      toast.error("Failed to update medication status");
    }
  };

  const isCurrentMedicationTaken = (medId: string) => {
    return medicationLogs.some(log => 
      log.medication_id === medId && log.status === 'taken'
    );
  };

  const allCurrentMedicationsTaken = () => {
    return currentMedications.length > 0 && 
      currentMedications.every(med => isCurrentMedicationTaken(med.id));
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
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex-shrink-0 border-2 border-primary overflow-hidden">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.full_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                    {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Hello, {userProfile?.full_name?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-xl text-gray-600">
                  {format(new Date(), 'EEEE, MMMM d')}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-primary/90 text-white rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <h3 className="text-xl font-bold">{streak} day streak</h3>
                </div>
              </div>
              <div>
                <p className="text-white/90">For Emily & the grandkids</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentMedications.length > 0 && (
          <Card className="border-l-4 border-l-red-500 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-6 w-6 text-red-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Medications
                  </h2>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">
                    {format(new Date(), 'h:mm a')}
                  </h3>
                  
                  <div className="mt-4 space-y-2 border-l-2 border-gray-200 pl-4">
                    {currentMedications.map((med) => (
                      <div 
                        key={med.id} 
                        className={`flex items-center gap-2 ${
                          isCurrentMedicationTaken(med.id) ? 'text-gray-500 line-through' : ''
                        }`}
                      >
                        <Pill className="h-5 w-5 text-primary" />
                        <span className="text-lg">{med.name} ({med.dosage})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {!allCurrentMedicationsTaken() && (
                  <Button 
                    className="w-full text-lg py-6"
                    onClick={markMedicationsTaken}
                  >
                    TAKE MEDICATIONS
                  </Button>
                )}
                
                {caregiverMessage && (
                  <p className="text-gray-600 italic mt-4 text-center">
                    {caregiverMessage}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {medications.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-medium">No medications added yet</h3>
              <p className="text-gray-500">
                Start by adding your medications to receive reminders
              </p>
              <Button asChild>
                <Link to="/medications/add">Add Medication</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link to="/medications" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Pill className="h-10 w-10 text-amber-500 mb-2" />
                <h3 className="text-lg font-medium">My Medications</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/schedule" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Calendar className="h-10 w-10 text-orange-500 mb-2" />
                <h3 className="text-lg font-medium">Schedule</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/identify" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Camera className="h-10 w-10 text-red-500 mb-2" />
                <h3 className="text-lg font-medium">Identify Pill</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/brain-games" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Brain 
                  className="h-10 w-10 text-amber-600 mb-2"
                />
                <h3 className="text-lg font-medium">Brain Games</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
