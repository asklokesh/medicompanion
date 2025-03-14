
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { CurrentMedicationsCard } from "@/components/dashboard/CurrentMedicationsCard";
import { EmptyMedicationsCard } from "@/components/dashboard/EmptyMedicationsCard";
import { QuickAccessGrid } from "@/components/dashboard/QuickAccessGrid";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(28);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const {
    userProfile,
    medications,
    currentMedications,
    loading,
    timeOfDay,
    markMedicationsTaken,
    isCurrentMedicationTaken,
    allCurrentMedicationsTaken
  } = useDashboardData();

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

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UserProfileCard 
          userProfile={userProfile} 
          user={user} 
          streak={streak} 
        />

        <CurrentMedicationsCard 
          currentMedications={currentMedications}
          isCurrentMedicationTaken={isCurrentMedicationTaken}
          allCurrentMedicationsTaken={allCurrentMedicationsTaken}
          timeOfDay={timeOfDay}
          markMedicationsTaken={markMedicationsTaken}
        />

        {medications.length === 0 && <EmptyMedicationsCard />}

        <QuickAccessGrid />
      </div>

      {/* Notification Sheet - Kept but not shown directly on dashboard */}
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
    </DashboardLayout>
  );
};

export default Dashboard;
