
import { supabase } from "@/integrations/supabase/client";

export interface HealthData {
  day: string;
  bp: number;
  pulse: number;
  glucose: number;
  date?: string;
}

export interface HealthMetric {
  id?: string;
  type: string;
  value: string;
  unit: string;
  recorded_at: string;
  user_id?: string;
}

// This is a mock implementation since we don't have the actual database table yet
export const getHealthTrendsData = async (userId?: string): Promise<HealthData[]> => {
  // In a real implementation, we would fetch from Supabase
  // For now, returning mock data
  return [
    { day: 'Mon', bp: 120, pulse: 72, glucose: 110, date: '2024-03-01' },
    { day: 'Tue', bp: 118, pulse: 74, glucose: 105, date: '2024-03-02' },
    { day: 'Wed', bp: 122, pulse: 70, glucose: 112, date: '2024-03-03' },
    { day: 'Thu', bp: 125, pulse: 73, glucose: 108, date: '2024-03-04' },
    { day: 'Fri', bp: 119, pulse: 71, glucose: 106, date: '2024-03-05' },
    { day: 'Sat', bp: 121, pulse: 69, glucose: 104, date: '2024-03-06' },
    { day: 'Sun', bp: 117, pulse: 70, glucose: 102, date: '2024-03-07' },
  ];
};

export const getLatestHealthMetrics = async (userId?: string): Promise<HealthMetric[]> => {
  // In a real implementation, we would fetch from Supabase
  // For now, returning mock data
  return [
    { 
      type: 'blood_pressure', 
      value: '120/80', 
      unit: 'mmHg', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'heart_rate', 
      value: '72', 
      unit: 'BPM', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'blood_glucose', 
      value: '105', 
      unit: 'mg/dL', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'temperature', 
      value: '98.6', 
      unit: '°F', 
      recorded_at: new Date().toISOString() 
    }
  ];
};

export const recordHealthMetric = async (
  metric: Omit<HealthMetric, 'id' | 'recorded_at' | 'user_id'>,
  userId?: string
): Promise<boolean> => {
  try {
    // For now, just mock success
    console.log(`Recording health metric:`, metric);
    return true;
  } catch (error) {
    console.error('Error recording health metric:', error);
    return false;
  }
};
