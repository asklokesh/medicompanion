
import { useAuth } from "@/lib/auth/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, Pill, Calendar, Camera, 
  LogOut, Menu, X, HeartPulse, User, BellRing
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query"; 
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BottomNavigation } from "./BottomNavigation";

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
      icon: <HeartPulse className="h-6 w-6" />,
    },
    {
      name: "My Medications",
      path: "/medications",
      icon: <Pill className="h-6 w-6" />,
    },
    {
      name: "Reminders",
      path: "/reminders",
      icon: <Bell className="h-6 w-6" />,
    },
    {
      name: "Identify Pill",
      path: "/identify",
      icon: <Camera className="h-6 w-6" />,
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
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <HeartPulse className="h-16 w-16 text-primary-600 animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary-200 blur-2xl opacity-30 rounded-full -z-10"></div>
          </div>
          <p className="mt-6 text-primary-700 font-medium text-lg">Loading your care dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-105">
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 w-9 h-9 rounded-lg flex items-center justify-center shadow-sm">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                MediCompanion
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button 
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 text-slate-700 hover:bg-slate-100"
                onClick={() => navigate('/reminders')}
              >
                <BellRing className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-9 w-9 rounded-full text-slate-700 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Desktop user menu */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-9 font-normal text-slate-700 hover:bg-slate-100"
                onClick={() => navigate('/profile')}
              >
                <span className="h-7 w-7 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full flex items-center justify-center text-white mr-2">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
                <span className="truncate max-w-32">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside 
          className={cn(
            "w-64 bg-white border-r border-slate-100 h-[calc(100vh-64px)] sticky top-16 flex-shrink-0 hidden md:block",
          )}
        >
          <div className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto py-6 px-3">
              <ul className="space-y-1.5">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        location.pathname === item.path 
                          ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600 pl-2" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-md",
                        location.pathname === item.path 
                          ? "bg-primary-100 text-primary-700" 
                          : "text-slate-500"
                      )}>
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeMenu}>
            <div 
              className="fixed top-16 right-0 bottom-0 w-72 bg-white shadow-xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                      {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{userProfile?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                      <span className="text-xs text-slate-500">Senior</span>
                    </div>
                  </div>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            location.pathname === item.path 
                              ? "bg-primary-50 text-primary-700" 
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <div className={cn(
                            "p-1.5 rounded-md",
                            location.pathname === item.path 
                              ? "bg-primary-100 text-primary-700" 
                              : "text-slate-500"
                          )}>
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="p-4 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-slate-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className={cn(
          "flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full animate-fade-in",
          isMobile ? "pb-24" : "" // Add padding at the bottom for mobile to accommodate the navigation bar
        )}>
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
}
