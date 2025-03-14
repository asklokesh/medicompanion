
import { Link, useLocation } from "react-router-dom";
import { HeartPulse, Pill, Bell, Brain, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { getAppConfig, AppFeatures } from "@/services/configService";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  featureFlag?: keyof AppFeatures;
}

export function BottomNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  const [features, setFeatures] = useState<AppFeatures | null>(null);
  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getAppConfig();
        setFeatures(config.features);
      } catch (error) {
        console.error("Failed to load app configuration:", error);
      }
    };
    
    loadConfig();
  }, []);

  // Navigation items configuration
  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <HeartPulse className="h-6 w-6" />,
    },
    {
      name: "Medications",
      path: "/medications",
      icon: <Pill className="h-6 w-6" />,
    },
    {
      name: "Reminders",
      path: "/reminders",
      icon: <Bell className="h-6 w-6" />,
      featureFlag: "medication_reminder",
    },
    {
      name: "Brain Games",
      path: "/brain-games",
      icon: <Brain className="h-6 w-6" />,
      featureFlag: "brain_games",
    },
    {
      name: "Health",
      path: "/health-tracking",
      icon: <Activity className="h-6 w-6" />,
      featureFlag: "health_tracking",
    },
  ];

  // Filter items based on feature flags
  const filteredNavItems = navItems.filter(item => {
    if (!item.featureFlag) return true;
    return features?.[item.featureFlag] ?? false;
  });

  // Ensure we only show up to 5 items
  const displayedItems = filteredNavItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {displayedItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-3 transition-colors",
                isActive ? "text-primary-600" : "text-slate-500"
              )}
            >
              <div className={cn(
                "p-2 rounded-full mb-1 transition-all",
                isActive 
                  ? "bg-primary-100 scale-110" 
                  : "hover:bg-slate-100 hover:scale-110"
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
