
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAppConfig, AppFeatures } from "@/services/configService";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { Shield } from "lucide-react";

const AdminConfig = () => {
  const [features, setFeatures] = useState<AppFeatures>({ caregiver_login: false });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const config = await getAppConfig();
      setFeatures(config.features);
    } catch (error) {
      console.error("Failed to load app configuration:", error);
      toast.error("Failed to load app configuration");
    } finally {
      setLoading(false);
    }
  };

  const updateFeature = async (featureName: keyof AppFeatures, value: boolean) => {
    try {
      setUpdating(true);
      
      // Create a new features object with the updated value
      const updatedFeatures = {
        ...features,
        [featureName]: value
      };

      const { error } = await supabase
        .from('app_config')
        .update({ value: updatedFeatures })
        .eq('id', 'features');

      if (error) {
        throw error;
      }

      setFeatures(updatedFeatures);
      toast.success(`${featureName} feature has been ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Failed to update feature:", error);
      toast.error("Failed to update feature configuration");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin Configuration</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>
              Enable or disable features in the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex items-center space-x-4 py-4">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Label htmlFor="caregiver-login" className="flex-1">
                  Caregiver Login
                  <p className="text-sm text-gray-500">
                    Allow caregivers to log in and manage seniors' medications
                  </p>
                </Label>
                <Switch
                  id="caregiver-login"
                  checked={features.caregiver_login}
                  onCheckedChange={(checked) => updateFeature('caregiver_login', checked)}
                  disabled={updating}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminConfig;
