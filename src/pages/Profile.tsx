
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { PlusCircle, Trash2, Upload, Camera } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";
import VoiceReminderService from "@/services/voiceReminderService";

interface DearOne {
  id: string;
  name: string;
  relation: string;
  image_url?: string;
}

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  date_of_birth?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  dear_ones?: DearOne[];
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const dearOnesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDearOne, setSelectedDearOne] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<Profile>({
    id: "",
    full_name: "",
    phone: "",
    dear_ones: []
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    voice: false,
  });

  // New dear one form state
  const [newDearOne, setNewDearOne] = useState<{
    name: string;
    relation: string;
    image_file?: File | null;
    image_preview?: string;
  }>({
    name: "",
    relation: ""
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
          // Safely type cast the dear_ones from Json to DearOne[]
          const dearOnes = (data.dear_ones as any as DearOne[]) || [];
          
          setProfile({
            id: data.id,
            full_name: data.full_name || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url,
            date_of_birth: data.date_of_birth,
            bio: data.bio,
            dear_ones: dearOnes,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
        }

        // Check voice reminder settings
        const voiceService = VoiceReminderService.getInstance();
        setNotificationSettings(prev => ({
          ...prev,
          voice: voiceService.isEnabled()
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    
    // Check if the URL has a hash to navigate to a specific section
    if (location.hash === '#dear-ones') {
      setActiveTab('dear-ones');
      setTimeout(() => {
        dearOnesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [user, location.hash]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Convert DearOne[] to Json before saving to database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          // Only include these fields if they exist
          ...(profile.date_of_birth && { date_of_birth: profile.date_of_birth }),
          ...(profile.bio && { bio: profile.bio }),
          ...(profile.avatar_url && { avatar_url: profile.avatar_url }),
          dear_ones: profile.dear_ones as unknown as Json
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDearOne({
        ...newDearOne,
        image_file: file,
        image_preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${uuidv4()}.${fileExt}`;
      const filePath = `dear-ones/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddDearOne = async () => {
    if (!newDearOne.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    let imageUrl = "";
    if (newDearOne.image_file) {
      const uploadedUrl = await uploadImage(newDearOne.image_file);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const updatedDearOnes = [
      ...(profile.dear_ones || []),
      {
        id: uuidv4(),
        name: newDearOne.name.trim(),
        relation: newDearOne.relation.trim() || "Family",
        image_url: imageUrl
      }
    ];

    setProfile({
      ...profile,
      dear_ones: updatedDearOnes
    });

    setNewDearOne({
      name: "",
      relation: "",
      image_file: null,
      image_preview: undefined
    });

    toast.success(`${newDearOne.name} added to your dear ones`);
    
    // Save changes immediately
    await handleSaveProfile();
  };

  const handleUpdateDearOnePhoto = async (id: string, file: File) => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(file);
      
      if (!uploadedUrl) {
        throw new Error("Failed to upload image");
      }
      
      const updatedDearOnes = (profile.dear_ones || []).map(person => 
        person.id === id 
          ? { ...person, image_url: uploadedUrl } 
          : person
      );
      
      setProfile({
        ...profile,
        dear_ones: updatedDearOnes
      });
      
      // Save changes immediately
      await supabase
        .from('user_profiles')
        .update({
          dear_ones: updatedDearOnes as unknown as Json
        })
        .eq('id', user.id);
      
      toast.success("Photo updated successfully");
      setSelectedDearOne(null);
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDearOne = (id: string) => {
    const updatedDearOnes = (profile.dear_ones || []).filter(
      person => person.id !== id
    );

    setProfile({
      ...profile,
      dear_ones: updatedDearOnes
    });

    toast.success("Person removed from your dear ones");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleVoiceNotifications = () => {
    const voiceService = VoiceReminderService.getInstance();
    const isEnabled = voiceService.toggleEnabled();
    
    setNotificationSettings(prev => ({
      ...prev,
      voice: isEnabled
    }));
    
    toast.success(isEnabled ? "Voice notifications enabled" : "Voice notifications disabled");
    
    if (isEnabled) {
      voiceService.speak("Voice notifications are now enabled. I'll remind you to take your medications.");
    }
  };

  const handleDearOnePhotoClick = (id: string) => {
    setSelectedDearOne(id);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDearOne) return;
    
    await handleUpdateDearOnePhoto(selectedDearOne, file);
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
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    value={profile.date_of_birth || ""}
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
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="dear-ones">Dear Ones</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4 pt-4">
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
                      {isSaving ? "Saving..." : "Save Profile Changes"}
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
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Voice Reminders</h4>
                        <p className="text-sm text-gray-500">Get voice reminders with personalized messages</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.voice}
                        onCheckedChange={toggleVoiceNotifications}
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
                
                <TabsContent value="dear-ones" className="space-y-4 pt-4" ref={dearOnesRef}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">My Dear Ones</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Add the names and photos of loved ones who motivate you to stay healthy
                      </p>
                      
                      {/* Hidden file input for updating photos */}
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileInputChange}
                      />
                      
                      {/* List of current dear ones */}
                      <div className="space-y-2 mb-6">
                        {(profile.dear_ones || []).length === 0 ? (
                          <p className="text-sm text-gray-500 italic">No dear ones added yet</p>
                        ) : (
                          (profile.dear_ones || []).map(person => (
                            <div 
                              key={person.id} 
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative group">
                                  <Avatar className="h-10 w-10">
                                    {person.image_url ? (
                                      <AvatarImage src={person.image_url} alt={person.name} />
                                    ) : null}
                                    <AvatarFallback className="bg-primary/20 text-primary">
                                      {person.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <button
                                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity"
                                    onClick={() => handleDearOnePhotoClick(person.id)}
                                  >
                                    <Camera className="h-4 w-4 text-white" />
                                  </button>
                                </div>
                                <div>
                                  <h4 className="font-medium">{person.name}</h4>
                                  <p className="text-xs text-gray-500">{person.relation}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveDearOne(person.id)}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Add new dear one form */}
                      <div className="border rounded-lg p-4 space-y-4">
                        <h4 className="font-medium flex items-center">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add a Dear One
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dearOneName">Name</Label>
                            <Input
                              id="dearOneName"
                              placeholder="e.g. Emily"
                              value={newDearOne.name}
                              onChange={(e) => setNewDearOne({...newDearOne, name: e.target.value})}
                              className="h-12 text-base"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dearOneRelation">Relationship</Label>
                            <Input
                              id="dearOneRelation"
                              placeholder="e.g. Daughter"
                              value={newDearOne.relation}
                              onChange={(e) => setNewDearOne({...newDearOne, relation: e.target.value})}
                              className="h-12 text-base"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dearOnePhoto">Photo (Optional)</Label>
                          <div className="flex items-center gap-4">
                            {newDearOne.image_preview ? (
                              <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                                <img 
                                  src={newDearOne.image_preview} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : null}
                            <Input
                              id="dearOnePhoto"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              fileUploadLabel={newDearOne.image_file ? newDearOne.image_file.name : "Upload photo..."}
                              className="h-12 text-base"
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Adding a photo creates a stronger emotional connection
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleAddDearOne}
                          className="mt-2"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                              Uploading...
                            </>
                          ) : (
                            "Add Person"
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full rounded-xl h-12 text-base"
                      onClick={handleSaveProfile}
                      disabled={isSaving || isUploading}
                    >
                      {isSaving ? "Saving..." : "Save All Changes"}
                    </Button>
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
