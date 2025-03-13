
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(true);

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
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error marking medications as taken:", error);
      return false;
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

  return {
    userProfile,
    medications,
    currentMedications,
    medicationLogs,
    loading,
    timeOfDay,
    markMedicationsTaken,
    isCurrentMedicationTaken,
    allCurrentMedicationsTaken
  };
};

export type { Medication, MedicationLog, DashboardData };
