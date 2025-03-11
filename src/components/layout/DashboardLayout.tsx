
import { useAuth } from "@/lib/auth/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, Pill, Calendar, Camera, Palette, 
  LogOut, Menu, X, Heart, User, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query"; // Updated import path
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

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

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      name: "My Medications",
      path: "/medications",
      icon: <Pill className="h-6 w-6" />,
    },
    {
      name: "Schedule",
      path: "/schedule",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      name: "Identify Pill",
      path: "/identify",
      icon: <Camera className="h-6 w-6" />,
    },
    {
      name: "Theme",
      path: "/theme",
      icon: <Palette className="h-6 w-6" />,
    },
    {
      name: userProfile?.user_type === 'senior' ? "Connect to Caregiver" : "My Seniors",
      path: "/connect",
      icon: <Users className="h-6 w-6" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="h-6 w-6" />,
    },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Heart fill="white" className="h-8 w-8" />
          <h1 className="text-2xl font-bold">MediCompanion</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="h-6 w-6 cursor-pointer" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:bg-primary-foreground/10"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside 
          className={cn(
            "w-64 bg-white shadow-md h-[calc(100vh-64px)] sticky top-16 flex-shrink-0 transition-all duration-300 ease-in-out",
            "hidden md:block"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{userProfile?.full_name || 'User'}</span>
                  <span className="text-xs text-gray-500">{userProfile?.user_type === 'senior' ? 'Senior' : 'Caregiver'}</span>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors",
                        location.pathname === item.path && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 text-gray-700"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/60" onClick={closeMenu}>
            <div 
              className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                      {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{userProfile?.full_name || 'User'}</span>
                      <span className="text-xs text-gray-500">{userProfile?.user_type === 'senior' ? 'Senior' : 'Caregiver'}</span>
                    </div>
                  </div>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors",
                            location.pathname === item.path && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="p-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 text-gray-700"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
