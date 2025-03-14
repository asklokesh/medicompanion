
import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { UserRound, BellRing, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Medication Reminder",
      message: "Time to take your morning medications",
      time: "1 hour ago",
      read: false,
      type: "medication"
    },
    {
      id: 2,
      title: "Health Update",
      message: "Your blood pressure readings look good this week",
      time: "3 hours ago",
      read: false,
      type: "health"
    },
    {
      id: 3, 
      title: "Appointment Reminder",
      message: "You have a doctor's appointment tomorrow at 10:00 AM",
      time: "Yesterday",
      read: true,
      type: "appointment"
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleNotificationClick = (notification: any) => {
    // Mark the notification as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate based on notification type
    switch (notification.type) {
      case "medication":
        navigate("/medications");
        break;
      case "health":
        navigate("/health-tracking");
        break;
      case "appointment":
        navigate("/schedule");
        break;
      default:
        break;
    }

    // Close the notifications panel
    setNotificationsOpen(false);
  };

  // Track scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Calculate unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header 
        className={cn(
          "sticky top-0 z-30 transition-all duration-200",
          scrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm h-16" 
            : "bg-white h-20"
        )}
      >
        <div className="h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-2 shadow-md">
              <HeartPulseIcon className="h-6 w-6 text-white" />
            </div>
            
            <Link to="/dashboard" className="flex items-center">
              <span className={cn(
                "text-xl font-bold transition-all", 
                scrolled 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                  : "bg-gradient-to-r from-amber-400 to-orange-600",
                "bg-clip-text text-transparent"
              )}>
                MediCompanion
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-1 md:gap-4">
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <BellRing className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <Link
              to="/profile"
              className="w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-2 flex items-center gap-2 rounded-full hover:bg-gray-100"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary-100 text-primary-800">
                  {user?.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                {user?.email?.split('@')[0] || "Profile"}
              </span>
            </Link>
            
            <Link
              to="/settings"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <main className="flex-1 py-6 px-4 md:px-6 max-w-6xl mx-auto w-full pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Footer navigation */}
      <BottomNavigation />

      {/* Notifications Sheet */}
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <button className="text-sm text-primary hover:underline" onClick={markAllAsRead}>
              Mark all as read
            </button>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read ? "bg-gray-50" : "bg-amber-50"
                  } hover:bg-amber-100`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-medium ${!notification.read ? "text-amber-800" : "text-gray-800"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Heart pulse icon for the logo
function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}
