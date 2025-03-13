
export type AppTheme = 'blue' | 'teal' | 'purple' | 'orange';

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
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
    highlightBg: "bg-blue-50",
    activeText: "text-blue-800",
    border: "border-blue-200"
  },
  teal: {
    primaryGradient: "from-teal-500 to-green-600",
    secondaryGradient: "from-emerald-500 to-teal-600",
    buttonColor: "bg-teal-600",
    badgeBg: "bg-teal-100",
    badgeText: "text-teal-800",
    highlightBg: "bg-teal-50",
    activeText: "text-teal-800",
    border: "border-teal-200"
  },
  purple: {
    primaryGradient: "from-purple-500 to-pink-600",
    secondaryGradient: "from-fuchsia-500 to-purple-600",
    buttonColor: "bg-purple-600",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    highlightBg: "bg-purple-50",
    activeText: "text-purple-800",
    border: "border-purple-200"
  },
  orange: {
    primaryGradient: "from-orange-500 to-amber-600",
    secondaryGradient: "from-amber-500 to-orange-600",
    buttonColor: "bg-orange-600",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
    highlightBg: "bg-orange-50",
    activeText: "text-orange-800",
    border: "border-orange-200"
  }
};

export const getThemeClasses = (theme: AppTheme = 'blue') => {
  return themeColors[theme];
};
