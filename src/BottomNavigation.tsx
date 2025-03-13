
import { Link, useLocation } from "react-router-dom";
import { cn } from "./utils";
import {
  Home,
  Pill,
  Activity,
  Brain,
  Users,
  Smartphone,
  CalendarDays,
  Menu,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./button";
import { useMediaQuery } from "./use-media-query";

export function BottomNavigation() {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const routes = useMemo(
    () => [
      {
        label: "Home",
        href: "/dashboard",
        icon: Home,
        active: location.pathname === "/dashboard",
        primary: true,
      },
      {
        label: "Medications",
        href: "/medications",
        icon: Pill,
        active: location.pathname.includes("/medications"),
        primary: true,
      },
      {
        label: "Health",
        href: "/health-tracking",
        icon: Activity,
        active: location.pathname.includes("/health"),
        primary: true,
      },
      {
        label: "Brain Games",
        href: "/brain-games",
        icon: Brain,
        active: location.pathname.includes("/brain-games"),
        primary: true,
      },
      {
        label: "Connect",
        href: "/connect",
        icon: Users,
        active: location.pathname.includes("/connect"),
        primary: false,
      },
      {
        label: "Schedule",
        href: "/schedule",
        icon: CalendarDays,
        active: location.pathname.includes("/schedule"),
        primary: false,
      },
      {
        label: "Identify Pill",
        href: "/identify",
        icon: Smartphone,
        active: location.pathname.includes("/identify"),
        primary: false,
      },
    ],
    [location]
  );

  if (isDesktop) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t py-2 px-4">
      <div className="max-w-md mx-auto">
        <nav
          className={cn(
            "grid grid-cols-5 gap-1",
            showMore && "grid-cols-4"
          )}
        >
          {routes
            .filter((route) => showMore || route.primary)
            .slice(0, showMore ? 7 : 4)
            .map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-lg text-gray-500",
                  route.active &&
                    "text-amber-500 font-medium bg-amber-50"
                )}
              >
                <route.icon
                  className={cn("h-6 w-6", route.active && "text-amber-500")}
                />
                <span className="text-xs mt-1">{route.label}</span>
              </Link>
            ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center justify-center h-full rounded-lg"
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs mt-1">{showMore ? "Less" : "More"}</span>
          </Button>
        </nav>
      </div>
    </div>
  );
}
