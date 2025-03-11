
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Palette, Check, Moon, Sun, Monitor } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

const ThemeSettings = () => {
  const { user } = useAuth();
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);

  // Mock data for theme preferences (in a real app, this would be stored in a database)
  const colorOptions = [
    { id: "blue", label: "Blue", value: "214 100% 67%" },
    { id: "green", label: "Green", value: "142 76% 36%" },
    { id: "purple", label: "Purple", value: "262 80% 59%" },
    { id: "orange", label: "Orange", value: "24 94% 50%" },
    { id: "red", label: "Red", value: "0 84% 60%" }
  ];

  const fontSizeOptions = [
    { id: "small", label: "Small" },
    { id: "medium", label: "Medium" },
    { id: "large", label: "Large" },
    { id: "xlarge", label: "Extra Large" }
  ];

  useEffect(() => {
    // This is a simplified example - in a real app, you'd store these preferences in a database
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedColor = localStorage.getItem("primaryColor") || "blue";
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    const savedContrast = localStorage.getItem("highContrast") === "true";
    
    setTheme(savedTheme);
    setPrimaryColor(savedColor);
    setFontSize(savedFontSize);
    setHighContrast(savedContrast);
    
    // Apply the saved theme
    applyTheme(savedTheme, savedColor, savedFontSize, savedContrast);
  }, []);

  const applyTheme = (newTheme: string, newColor: string, newFontSize: string, newContrast: boolean) => {
    const root = document.documentElement;
    const selectedColor = colorOptions.find(color => color.id === newColor)?.value || colorOptions[0].value;
    
    // Apply theme (light/dark)
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--background", "240 10% 3.9%");
      root.style.setProperty("--foreground", "0 0% 98%");
      root.style.setProperty("--card", "240 10% 3.9%");
      root.style.setProperty("--card-foreground", "0 0% 98%");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
    }
    
    // Apply primary color
    root.style.setProperty("--primary", selectedColor);
    
    // Apply font size
    switch (newFontSize) {
      case "small":
        root.style.fontSize = "14px";
        break;
      case "medium":
        root.style.fontSize = "16px";
        break;
      case "large":
        root.style.fontSize = "18px";
        break;
      case "xlarge":
        root.style.fontSize = "20px";
        break;
      default:
        root.style.fontSize = "16px";
    }
    
    // Apply high contrast if needed
    if (newContrast) {
      root.classList.add("high-contrast");
      root.style.setProperty("--primary-foreground", "0 0% 100%");
    } else {
      root.classList.remove("high-contrast");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
    }
  };

  const savePreferences = () => {
    setSaving(true);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("highContrast", highContrast.toString());
    
    // Apply the theme
    applyTheme(theme, primaryColor, fontSize, highContrast);
    
    // Simulate saving to database
    setTimeout(() => {
      toast.success("Theme settings saved successfully");
      setSaving(false);
    }, 500);
  };

  const resetToDefaults = () => {
    const defaultTheme = "light";
    const defaultColor = "blue";
    const defaultFontSize = "medium";
    const defaultContrast = false;
    
    setTheme(defaultTheme);
    setPrimaryColor(defaultColor);
    setFontSize(defaultFontSize);
    setHighContrast(defaultContrast);
    
    applyTheme(defaultTheme, defaultColor, defaultFontSize, defaultContrast);
    
    localStorage.setItem("theme", defaultTheme);
    localStorage.setItem("primaryColor", defaultColor);
    localStorage.setItem("fontSize", defaultFontSize);
    localStorage.setItem("highContrast", defaultContrast.toString());
    
    toast.success("Settings reset to defaults");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base">Theme Mode</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center py-4 h-auto"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    <span>Light</span>
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center py-4 h-auto"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center py-4 h-auto"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-6 w-6 mb-2" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-base">Primary Color</Label>
                <RadioGroup 
                  value={primaryColor} 
                  onValueChange={setPrimaryColor}
                  className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2"
                >
                  {colorOptions.map((color) => (
                    <div key={color.id}>
                      <RadioGroupItem
                        value={color.id}
                        id={`color-${color.id}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color.id}`}
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div
                          className="h-6 w-6 rounded-full mb-2"
                          style={{ backgroundColor: `hsl(${color.value})` }}
                        />
                        <span className="text-sm font-medium">{color.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-base">Font Size</Label>
                <RadioGroup 
                  value={fontSize} 
                  onValueChange={setFontSize}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2"
                >
                  {fontSizeOptions.map((size) => (
                    <div key={size.id}>
                      <RadioGroupItem
                        value={size.id}
                        id={`font-${size.id}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`font-${size.id}`}
                        className="flex items-center justify-center rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="text-sm font-medium">{size.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
                <Label htmlFor="high-contrast" className="text-base font-medium">
                  High Contrast Mode
                </Label>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={savePreferences} 
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>
              <Button 
                onClick={resetToDefaults} 
                variant="outline" 
                className="flex-1"
              >
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Sample Header Text</h3>
                <p>This is how your text will appear throughout the application. Adjust the settings above to make it comfortable for your eyes.</p>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm">Primary Button</Button>
                  <Button size="sm" variant="outline">Secondary Button</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ThemeSettings;
