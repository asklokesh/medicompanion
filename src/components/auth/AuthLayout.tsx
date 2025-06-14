
import { cn } from "@/lib/utils";
import { Pill, Brain, HeartPulse, Activity, Bell } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      
      {/* Floating pills decorations */}
      <div className="absolute top-1/4 left-10 w-8 h-3 bg-primary rounded-full opacity-30 float" style={{animationDelay: "0.5s"}}></div>
      <div className="absolute bottom-1/4 right-10 w-8 h-3 bg-secondary rounded-full opacity-30 float" style={{animationDelay: "1.2s"}}></div>
      <div className="absolute top-2/3 left-1/4 w-6 h-6 bg-accent rounded-full opacity-20 float" style={{animationDelay: "0.8s"}}></div>
      
      {/* Icon decorations */}
      <div className="absolute top-20 right-1/4">
        <Pill className="w-8 h-8 text-primary/20 float" style={{animationDelay: "1.5s"}} />
      </div>
      <div className="absolute bottom-32 left-1/5">
        <Brain className="w-10 h-10 text-green-500/20 float" style={{animationDelay: "0.3s"}} />
      </div>
      <div className="absolute top-1/3 right-20">
        <Bell className="w-6 h-6 text-blue-500/20 float" style={{animationDelay: "1.8s"}} />
      </div>
      <div className="absolute bottom-1/3 left-14">
        <Activity className="w-8 h-8 text-accent/20 float" style={{animationDelay: "1.1s"}} />
      </div>
      
      <div className={cn(
        "w-full max-w-md glass rounded-3xl p-8 shadow-lg",
        "transform transition-all duration-500 ease-out",
        "relative z-10",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 rounded-3xl -z-10"></div>
        {children}
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>MediCompanion — Your Health Companion</p>
        <p className="text-xs mt-1">Helping seniors and caregivers stay connected</p>
      </footer>
    </div>
  );
}
