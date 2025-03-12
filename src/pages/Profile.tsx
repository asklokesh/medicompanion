
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  date_of_birth?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: "",
    full_name: "",
    phone: "",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProfile({
            id: data.id,
            full_name: data.full_name,
            phone: data.phone,
            avatar_url: data.avatar_url,
            date_of_birth: data.date_of_birth,
            bio: data.bio,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          // Only include these fields if they exist
          ...(profile.date_of_birth && { date_of_birth: profile.date_of_birth }),
          ...(profile.bio && { bio: profile.bio }),
          ...(profile.avatar_url && { avatar_url: profile.avatar_url })
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Card */}
          <Card className="w-full md:w-1/3 rounded-3xl shadow-md">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                  <p className="text-sm text-gray-500">Senior</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({...profile, date_of_birth: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>
                
                <Button 
                  className="w-full rounded-xl h-12 text-base"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Settings Tabs */}
          <Card className="w-full md:w-2/3 rounded-3xl shadow-md">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notifications">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="notifications" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive medication reminders via email</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, email: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive medication reminders as push notifications</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, push: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive medication reminders via text message</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.sms}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, sms: checked})
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accessibility" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Larger Text</h4>
                        <p className="text-sm text-gray-500">Increase text size for better readability</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">High Contrast</h4>
                        <p className="text-sm text-gray-500">Enhance visual distinction between elements</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Screen Reader Support</h4>
                        <p className="text-sm text-gray-500">Optimize for screen reader compatibility</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="account" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="h-12 text-base"
                      />
                      <p className="text-xs text-gray-500">Your email cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        value={profile.bio || ""}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell us a bit about yourself"
                        className="h-12 text-base"
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl h-12 text-base"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Account Changes"}
                    </Button>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        className="w-full rounded-xl h-12 text-base"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
