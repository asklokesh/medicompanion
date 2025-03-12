
import { Link, useLocation } from "react-router-dom";
import { HeartPulse, Pill, Brain, Bell, Users } from "lucide-react";
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
  const [userProfile, setUserProfile] = useState<any>(null);
  
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
      name: "Family",
      path: "/connect",
      icon: <Users className="h-6 w-6" />,
      featureFlag: "family_connection",
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around">
        {displayedItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center py-3 px-3",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <div className={cn(
              "p-2 rounded-full mb-1",
              location.pathname === item.path ? "bg-primary/10" : ""
            )}>
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
