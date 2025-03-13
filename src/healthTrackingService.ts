
import { supabase } from "./supabase/client";

export interface HealthData {
  day: string;
  bp: number;
  pulse: number;
  glucose: number;
  weight?: number;
  steps?: number;
  sleep?: number;
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
    { day: 'Mon', bp: 120, pulse: 72, glucose: 110, weight: 160, steps: 8500, sleep: 7.5, date: '2024-03-01' },
    { day: 'Tue', bp: 118, pulse: 74, glucose: 105, weight: 160, steps: 7800, sleep: 8.0, date: '2024-03-02' },
    { day: 'Wed', bp: 122, pulse: 70, glucose: 112, weight: 159, steps: 9200, sleep: 6.5, date: '2024-03-03' },
    { day: 'Thu', bp: 125, pulse: 73, glucose: 108, weight: 159, steps: 10500, sleep: 7.0, date: '2024-03-04' },
    { day: 'Fri', bp: 119, pulse: 71, glucose: 106, weight: 158, steps: 7500, sleep: 7.2, date: '2024-03-05' },
    { day: 'Sat', bp: 121, pulse: 69, glucose: 104, weight: 158, steps: 5200, sleep: 8.5, date: '2024-03-06' },
    { day: 'Sun', bp: 117, pulse: 70, glucose: 102, weight: 158, steps: 6300, sleep: 9.0, date: '2024-03-07' },
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
    },
    { 
      type: 'weight', 
      value: '160', 
      unit: 'lbs', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'oxygen_saturation', 
      value: '98', 
      unit: '%', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'steps', 
      value: '8500', 
      unit: 'steps', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'sleep', 
      value: '7.5', 
      unit: 'hours', 
      recorded_at: new Date().toISOString() 
    },
    { 
      type: 'water_intake', 
      value: '64', 
      unit: 'oz', 
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
    
    // Here we would normally store the data in Supabase
    // For example:
    /*
    const { error } = await supabase
      .from('health_metrics')
      .insert({
        type: metric.type,
        value: metric.value,
        unit: metric.unit,
        user_id: userId,
        recorded_at: new Date().toISOString()
      });
    
    if (error) throw error;
    */
    
    return true;
  } catch (error) {
    console.error('Error recording health metric:', error);
    return false;
  }
};

// New function to connect health tracking devices
export const connectHealthDevice = async (
  deviceType: string,
  userId?: string
): Promise<boolean> => {
  try {
    console.log(`Connecting ${deviceType} for user ${userId}`);
    // This would connect to the device's API in a real implementation
    return true;
  } catch (error) {
    console.error(`Error connecting ${deviceType}:`, error);
    return false;
  }
};

// New function to disconnect health tracking devices
export const disconnectHealthDevice = async (
  deviceType: string,
  userId?: string
): Promise<boolean> => {
  try {
    console.log(`Disconnecting ${deviceType} for user ${userId}`);
    // This would disconnect from the device's API in a real implementation
    return true;
  } catch (error) {
    console.error(`Error disconnecting ${deviceType}:`, error);
    return false;
  }
};
