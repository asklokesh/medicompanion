
import { AuthLayout } from "./components/auth/AuthLayout";
import { UserTypeSelection } from "./components/auth/UserTypeSelection";
import { Heart, Activity, Calendar, AlertCircle, Brain, Bell, Users } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  // Add a title for better SEO and user experience
  useEffect(() => {
    document.title = "MediCompanion - Your Personal Health & Medication Assistant";
  }, []);

  return (
    <>
      <AuthLayout>
        <UserTypeSelection />
      </AuthLayout>
      
      {/* Feature highlights section */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 md:flex justify-center items-center gap-6 hidden">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Heart className="w-4 h-4 text-primary animate-pulse" />
          <span>Personalized Care</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Brain className="w-4 h-4 text-green-500" />
          <span>Brain Games</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="w-4 h-4 text-blue-500" />
          <span>Medication Reminders</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-accent" />
          <span>Family Connect</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity className="w-4 h-4 text-secondary" />
          <span>Health Tracking</span>
        </div>
      </div>
    </>
  );
};

export default Index;
