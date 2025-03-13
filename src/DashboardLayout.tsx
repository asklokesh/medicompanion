
import { cn } from "./utils";
import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { UserRound, BellRing, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-16 flex items-center px-4 md:px-6">
        <div className="flex-1 flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              MediCompanion
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <UserRound className="w-5 h-5" />
            <span className="hidden md:inline-block">
              {user?.email?.split('@')[0] || "Profile"}
            </span>
          </Link>
          <Link
            to="/reminders"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <BellRing className="w-5 h-5 text-gray-600" />
          </Link>
          <Link
            to="/profile"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <main className="flex-1 py-6 px-4 md:px-6 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Footer navigation */}
      <BottomNavigation />
    </div>
  );
}
