
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { getAppConfig, updateAppFeatures, AppFeatures } from "@/services/configService";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/AuthContext";
import { Shield, Settings, Package, Bell, Activity, Brain, Heart, Users } from "lucide-react";

const AdminConfig = () => {
  const [features, setFeatures] = useState<AppFeatures>({
    caregiver_login: false,
    medication_reminder: true,
    health_tracking: true,
    brain_games: true,
    emergency_features: false,
    family_connection: false
  });
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
      
      // Create an update object with just the changed feature
      const featureUpdate = { [featureName]: value } as Partial<AppFeatures>;
      
      const success = await updateAppFeatures(featureUpdate);

      if (!success) {
        throw new Error("Failed to update feature");
      }

      // Update local state
      setFeatures(prev => ({
        ...prev,
        [featureName]: value
      }));
      
      toast.success(`${featureName.replace('_', ' ')} feature has been ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Failed to update feature:", error);
      toast.error("Failed to update feature configuration");
    } finally {
      setUpdating(false);
    }
  };

  const featureConfigs = [
    {
      id: 'caregiver_login',
      name: 'Caregiver Login',
      description: 'Allow caregivers to log in and manage seniors\' medications',
      icon: <Users className="h-5 w-5 text-primary" />
    },
    {
      id: 'medication_reminder',
      name: 'Medication Reminders',
      description: 'Enable push notifications and reminders for medications',
      icon: <Bell className="h-5 w-5 text-accent" />
    },
    {
      id: 'health_tracking',
      name: 'Health Tracking',
      description: 'Allow users to track their health metrics and symptoms',
      icon: <Activity className="h-5 w-5 text-green-500" />
    },
    {
      id: 'brain_games',
      name: 'Brain Games',
      description: 'Enable brain games for cognitive health',
      icon: <Brain className="h-5 w-5 text-purple-500" />
    },
    {
      id: 'emergency_features',
      name: 'Emergency Features',
      description: 'Enable emergency contact and location sharing features',
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      id: 'family_connection',
      name: 'Family Connection',
      description: 'Allow seniors to connect with family members',
      icon: <Users className="h-5 w-5 text-blue-500" />
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin Configuration</h1>
        </div>
        
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Feature Flags</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>System Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>
                  Enable or disable features in the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4 py-4">
                        <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
                        </div>
                        <div className="ml-auto h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featureConfigs.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                        <div className="flex-shrink-0">{feature.icon}</div>
                        <Label htmlFor={feature.id} className="flex-1">
                          <span className="font-medium">{feature.name}</span>
                          <p className="text-sm text-gray-500">
                            {feature.description}
                          </p>
                        </Label>
                        <Switch
                          id={feature.id}
                          checked={features[feature.id as keyof AppFeatures]}
                          onCheckedChange={(checked) => 
                            updateFeature(feature.id as keyof AppFeatures, checked)
                          }
                          disabled={updating}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Manage system-wide configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-8 text-center">
                  <Settings className="h-12 w-12 text-gray-300 mx-auto" />
                  <p className="mt-4 text-gray-500">System settings will be available in future updates</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminConfig;
