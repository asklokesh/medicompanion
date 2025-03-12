
import { supabase } from "@/integrations/supabase/client";

export type AppFeatures = {
  caregiver_login: boolean;
  medication_reminder: boolean;
  health_tracking: boolean;
  brain_games: boolean;
  emergency_features: boolean;
  family_connection: boolean;
};

export type AppTheme = 'blue' | 'teal' | 'purple' | 'orange';

export type AppConfig = {
  features: AppFeatures;
  currentTheme: AppTheme;
  version: string;
};

export const defaultAppConfig: AppConfig = {
  features: {
    caregiver_login: false,
    medication_reminder: true,
    health_tracking: true,
    brain_games: true,
    emergency_features: false,
    family_connection: false,
  },
  currentTheme: 'blue',
  version: '1.0.0'
};

export const getAppConfig = async (): Promise<AppConfig> => {
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('*')
      .eq('id', 'features')
      .single();
    
    if (error) {
      console.error('Error fetching app configuration:', error);
      // Return default configuration if there's an error
      return defaultAppConfig;
    }
    
    // Merge the stored value with our default to ensure we have all expected properties
    const mergedFeatures = {
      ...defaultAppConfig.features,
      ...(data?.value as AppFeatures || {})
    };
    
    // Get theme data
    const { data: themeData, error: themeError } = await supabase
      .from('app_config')
      .select('*')
      .eq('id', 'theme')
      .single();
      
    let currentTheme = defaultAppConfig.currentTheme;
    
    if (!themeError && themeData) {
      // Fix: Safely access the theme property from the JSON value
      const themeValue = themeData.value as { theme?: string };
      currentTheme = themeValue?.theme as AppTheme || defaultAppConfig.currentTheme;
    }
    
    return { 
      ...defaultAppConfig,
      features: mergedFeatures,
      currentTheme
    };
  } catch (error) {
    console.error('Unexpected error fetching app configuration:', error);
    return defaultAppConfig;
  }
};

export const updateAppConfig = async (configId: string, value: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('app_config')
      .update({ value })
      .eq('id', configId);
    
    if (error) {
      console.error('Error updating app configuration:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating app configuration:', error);
    return false;
  }
};

export const updateAppFeatures = async (features: Partial<AppFeatures>): Promise<boolean> => {
  try {
    // First get current config
    const currentConfig = await getAppConfig();
    
    // Merge with new features
    const updatedFeatures = {
      ...currentConfig.features,
      ...features
    };
    
    // Update in database
    return await updateAppConfig('features', updatedFeatures);
  } catch (error) {
    console.error('Failed to update app features:', error);
    return false;
  }
};

export const updateAppTheme = async (theme: AppTheme): Promise<boolean> => {
  try {
    return await updateAppConfig('theme', { theme });
  } catch (error) {
    console.error('Failed to update app theme:', error);
    return false;
  }
};
