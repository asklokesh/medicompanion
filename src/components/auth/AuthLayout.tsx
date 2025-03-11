
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className={cn(
        "w-full max-w-md glass rounded-3xl p-8 shadow-lg",
        "transform transition-all duration-500 ease-out",
        className
      )}>
        {children}
      </div>
    </div>
  );
}

