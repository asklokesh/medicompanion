
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { LogOut, Palette, Settings, Users, Lock, Bell, UserRound } from "lucide-react";
import { useTheme } from "@/hooks/next-themes";

export default function Profile() {
  const { signOut, user } = useAuth();
  const { theme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
    // No need to redirect, protected route will do it
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main profile card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {user?.email?.[0].toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Account Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Email</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Account Type</span>
                    <span>{user?.user_metadata?.account_type || "Senior"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Theme</span>
                    <span className="capitalize">{theme}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleSignOut} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>Logging out...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Settings shortcuts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Quickly access common settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/theme-settings">
                  <Button variant="outline" className="w-full justify-start text-left" size="lg">
                    <Palette className="h-5 w-5 mr-2" />
                    <div className="flex flex-col items-start">
                      <span>Appearance</span>
                      <span className="text-xs text-gray-500">Themes, colors, and font size</span>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/reminders">
                  <Button variant="outline" className="w-full justify-start text-left" size="lg">
                    <Bell className="h-5 w-5 mr-2" />
                    <div className="flex flex-col items-start">
                      <span>Notifications</span>
                      <span className="text-xs text-gray-500">Manage your reminders</span>
                    </div>
                  </Button>
                </Link>
                
                <Link to="/connect">
                  <Button variant="outline" className="w-full justify-start text-left" size="lg">
                    <Users className="h-5 w-5 mr-2" />
                    <div className="flex flex-col items-start">
                      <span>Caregivers</span>
                      <span className="text-xs text-gray-500">Connect with family and caregivers</span>
                    </div>
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start text-left" size="lg">
                  <Lock className="h-5 w-5 mr-2" />
                  <div className="flex flex-col items-start">
                    <span>Privacy &amp; Security</span>
                    <span className="text-xs text-gray-500">Manage your account security</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Help &amp; Support</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/help">
                  <Button variant="secondary" className="w-full">Get Help</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
