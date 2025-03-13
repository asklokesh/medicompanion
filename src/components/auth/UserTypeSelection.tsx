
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserRound, HeartPulse, Brain, Bell, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAppConfig, AppFeatures } from "@/services/configService";

export function UserTypeSelection() {
  const [features, setFeatures] = useState<AppFeatures>({
    medication_reminder: true,
    health_tracking: true,
    brain_games: true,
    emergency_features: false,
    family_connection: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getAppConfig();
        setFeatures(config.features);
      } catch (error) {
        console.error("Failed to load app configuration:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-16 w-16 bg-primary/20 rounded-full"></div>
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <HeartPulse className="w-16 h-16 mx-auto text-primary float absolute" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gradient">MediCompanion</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">We care about your health journey every step of the way</p>
      </div>

      <div className="grid gap-6 fade-in" style={{animationDelay: "0.2s"}}>
        <Link to="/login/senior" className="transform transition-all duration-300 hover:scale-105">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative group rounded-3xl">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-blue-100 rounded-full pill-shadow">
                <UserRound className="w-10 h-10 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">Get Started</h2>
                <p className="text-gray-600 text-lg">Take control of your medications and health</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {features.medication_reminder && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Bell className="w-3 h-3" /> Reminders
                    </span>
                  )}
                  {features.brain_games && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Brain className="w-3 h-3" /> Brain Games
                    </span>
                  )}
                  {features.health_tracking && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Activity className="w-3 h-3" /> Health Tracking
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Caregiver option removed but code kept for future reference */}
        {/* <Link to="/login/caregiver" className="transform transition-all duration-300 hover:scale-105">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative group rounded-3xl">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="flex items-center space-x-5">
              <div className="p-4 bg-purple-100 rounded-full pill-shadow">
                <HeartPulse className="w-10 h-10 text-purple-500" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">Caregiver Access</h2>
                <p className="text-gray-600 text-lg">Help manage care for your loved ones</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Bell className="w-3 h-3" /> Medication Management
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Activity className="w-3 h-3" /> Health Monitoring
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link> */}
      </div>

      <div className="text-center fade-in" style={{animationDelay: "0.4s"}}>
        <p className="text-gray-500 mb-4">Join thousands who trust MediCompanion daily</p>
        <Button asChild variant="link" className="text-lg">
          <Link to="/help">Need help getting started?</Link>
        </Button>
      </div>
    </div>
  );
}
