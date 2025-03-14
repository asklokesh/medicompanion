
import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("system");
  const [mounted, setMounted] = useState(false);

  // Check if user prefers dark mode
  const prefersDarkMode = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Determine active theme (resolving "system" to actual theme)
  const resolveTheme = (theme: string) => {
    if (theme === "system") {
      return prefersDarkMode() ? "dark" : "light";
    }
    return theme;
  };

  // Apply theme to document
  const applyTheme = (newTheme: string) => {
    const resolvedTheme = resolveTheme(newTheme);
    
    // Apply or remove dark class
    if (resolvedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Update meta theme-color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content", 
        resolvedTheme === "dark" ? "#1a1f2c" : "#f8fafc"
      );
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Check for stored theme or use system preference
    const storedTheme = localStorage.getItem("theme") || "system";
    setTheme(storedTheme);
    applyTheme(storedTheme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // This effect runs when theme state changes
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme, mounted]);

  return { 
    theme, 
    setTheme,
    resolvedTheme: mounted ? resolveTheme(theme) : undefined,
    systemTheme: mounted ? (prefersDarkMode() ? "dark" : "light") : undefined
  };
}
