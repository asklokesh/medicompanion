
import { supabase } from "@/integrations/supabase/client";

export type AppFeatures = {
  caregiver_login: boolean;
};

export type AppConfig = {
  features: AppFeatures;
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
      return { features: { caregiver_login: false } };
    }
    
    return { features: data.value as AppFeatures };
  } catch (error) {
    console.error('Unexpected error fetching app configuration:', error);
    return { features: { caregiver_login: false } };
  }
};
