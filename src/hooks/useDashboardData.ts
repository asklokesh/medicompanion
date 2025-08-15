
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, isSameDay } from "date-fns";
import { getMedicationInteractions, type Interaction } from "@/services/medicationService";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time_of_day: string[];
  rxcui?: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  status: 'taken' | 'skipped' | 'missed';
  taken_at: string;
}

interface DashboardData {
  userProfile: any;
  medications: Medication[];
  currentMedications: Medication[];
  medicationLogs: MedicationLog[];
  loading: boolean;
  timeOfDay: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMedications, setCurrentMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const currentHour = new Date().getHours();
  const timeOfDay = 
    currentHour >= 5 && currentHour < 12 ? 'morning' :
    currentHour >= 12 && currentHour < 17 ? 'afternoon' :
    currentHour >= 17 && currentHour < 21 ? 'evening' : 'night';

  // Define calculateStreak function at the component level so it can be accessed from anywhere in the hook
  const calculateStreak = (logs: MedicationLog[]) => {
    if (!logs.length) {
      setStreak(0);
      return;
    }

    // Get all medications to check if user has any
    if (medications.length === 0) {
      setStreak(0);
      return;
    }

    // Group logs by date (using date string as key)
    const logsByDate = logs.reduce((acc: Record<string, MedicationLog[]>, log) => {
      const dateStr = format(new Date(log.taken_at), 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(log);
      return acc;
    }, {});

    // Check if each medication was taken each day
    let currentStreak = 0;
    const today = new Date();
    
    // Start checking from yesterday, since today might not be complete yet
    let checkDate = subDays(today, 1);
    
    // Continue checking backwards until we find a day with missed medications
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const dayLogs = logsByDate[dateStr] || [];
      
      // If there were medications to take and some logs for that day
      if (dayLogs.length > 0) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        // Check if this day is today, in which case the streak doesn't break
        if (isSameDay(checkDate, today)) {
          checkDate = subDays(checkDate, 1);
          continue;
        }
        
        // No logs for this day, streak is broken
        break;
      }
      
      // Don't go back more than 365 days
      if (currentStreak >= 365) break;
    }
    
    setStreak(currentStreak);
  };

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
        // Get logs from the last 30 days to calculate streak
        const thirtyDaysAgo = subDays(new Date(), 30);
        
        const { data, error } = await supabase
          .from('medication_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('taken_at', thirtyDaysAgo.toISOString())
          .order('taken_at', { ascending: false });
        
        if (data && !error) {
          const typedLogs: MedicationLog[] = data.map(log => ({
            id: log.id,
            medication_id: log.medication_id,
            status: log.status as 'taken' | 'skipped' | 'missed',
            taken_at: log.taken_at
          }));
          setMedicationLogs(typedLogs);
          
          // Calculate streak after getting logs
          calculateStreak(typedLogs);
        }
      }
    };

    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch all data in a more sequential and robust way
        const userProfilePromise = fetchUserProfile();
        const medicationsPromise = fetchMedications();

        // Wait for profile and medications
        await Promise.all([userProfilePromise, medicationsPromise]);

        // Now that medications are fetched, fetch logs and interactions
        const logsPromise = fetchMedicationLogs();
        const interactionsPromise = fetchInteractions();
        await Promise.all([logsPromise, interactionsPromise]);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInteractions = async () => {
      if (medications.length > 1) {
        const rxcuis = medications.map(med => med.rxcui).filter(Boolean) as string[];
        if (rxcuis.length > 1) {
          const interactionResults = await getMedicationInteractions(rxcuis);
          setInteractions(interactionResults);
        }
      }
    };

    fetchData();
  }, [user, timeOfDay]);

  const updateMedicationStatus = async (medicationId: string, status: 'taken' | 'skipped') => {
    if (!user) return;

    const newLog = {
      medication_id: medicationId,
      user_id: user.id,
      status: status,
      taken_at: new Date().toISOString(),
    };

    // Optimistically update the UI
    const newLogEntry: MedicationLog = { ...newLog, id: `temp-${Date.now()}` };
    setMedicationLogs(prevLogs => [...prevLogs, newLogEntry]);

    try {
      const { error } = await supabase.from('medication_logs').insert(newLog);

      if (error) {
        console.error("Error updating medication status:", error);
        // Revert optimistic update on error
        setMedicationLogs(prevLogs => prevLogs.filter(log => log.id !== newLogEntry.id));
        toast({
          title: "Update Failed",
          description: "Could not update medication status. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Fetch updated logs to get the real ID and recalculate streak
      const thirtyDaysAgo = subDays(new Date(), 30);
      const { data: updatedLogs, error: fetchError } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('taken_at', thirtyDaysAgo.toISOString())
        .order('taken_at', { ascending: false });

      if (!fetchError && updatedLogs) {
        const typedLogs: MedicationLog[] = updatedLogs.map(log => ({
          id: log.id,
          medication_id: log.medication_id,
          status: log.status as 'taken' | 'skipped' | 'missed',
          taken_at: log.taken_at
        }));
        setMedicationLogs(typedLogs);
        calculateStreak(typedLogs);
      }
    } catch (error) {
      console.error("Error in updateMedicationStatus:", error);
      // Revert optimistic update on error
      setMedicationLogs(prevLogs => prevLogs.filter(log => log.id !== newLogEntry.id));
    }
  };

  const isMedicationTakenToday = (medicationId: string, time: string) => {
    return medicationLogs.some(log =>
      log.medication_id === medicationId &&
      isSameDay(new Date(log.taken_at), new Date()) &&
      log.status === 'taken'
      // We could also check against time of day if logs had that info
    );
  };

  return {
    userProfile,
    medications,
    currentMedications,
    medicationLogs,
    loading,
    timeOfDay,
    updateMedicationStatus,
    isMedicationTakenToday,
    streak,
    interactions
  };
};

export type { Medication, MedicationLog, DashboardData };
