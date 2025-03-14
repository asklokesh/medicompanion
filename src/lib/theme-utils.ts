
import { AppTheme } from "@/services/configService";

export type ThemeColors = {
  primaryGradient: string;
  secondaryGradient: string;
  buttonColor: string;
  badgeBg: string;
  badgeText: string;
  highlightBg: string;
  activeText: string;
  border: string;
};

export const themeColors: Record<AppTheme, ThemeColors> = {
  blue: {
    primaryGradient: "from-blue-500 to-indigo-600",
    secondaryGradient: "from-indigo-500 to-purple-600",
    buttonColor: "bg-blue-600",
    badgeBg: "bg-blue-100 dark:bg-blue-900",
    badgeText: "text-blue-800 dark:text-blue-200",
    highlightBg: "bg-blue-50 dark:bg-blue-900/30",
    activeText: "text-blue-800 dark:text-blue-200",
    border: "border-blue-200 dark:border-blue-800"
  },
  teal: {
    primaryGradient: "from-teal-500 to-green-600",
    secondaryGradient: "from-emerald-500 to-teal-600",
    buttonColor: "bg-teal-600",
    badgeBg: "bg-teal-100 dark:bg-teal-900",
    badgeText: "text-teal-800 dark:text-teal-200",
    highlightBg: "bg-teal-50 dark:bg-teal-900/30",
    activeText: "text-teal-800 dark:text-teal-200",
    border: "border-teal-200 dark:border-teal-800"
  },
  purple: {
    primaryGradient: "from-purple-500 to-pink-600",
    secondaryGradient: "from-fuchsia-500 to-purple-600",
    buttonColor: "bg-purple-600",
    badgeBg: "bg-purple-100 dark:bg-purple-900",
    badgeText: "text-purple-800 dark:text-purple-200",
    highlightBg: "bg-purple-50 dark:bg-purple-900/30",
    activeText: "text-purple-800 dark:text-purple-200",
    border: "border-purple-200 dark:border-purple-800"
  },
  orange: {
    primaryGradient: "from-orange-500 to-amber-600",
    secondaryGradient: "from-amber-500 to-orange-600",
    buttonColor: "bg-orange-600",
    badgeBg: "bg-orange-100 dark:bg-orange-900",
    badgeText: "text-orange-800 dark:text-orange-200",
    highlightBg: "bg-orange-50 dark:bg-orange-900/30",
    activeText: "text-orange-800 dark:text-orange-200",
    border: "border-orange-200 dark:border-orange-800"
  }
};

export const getThemeClasses = (theme: AppTheme = 'orange') => {
  return themeColors[theme];
};
