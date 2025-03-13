
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, Plus, Check, Clock, Calendar, X, Settings, 
  Volume2, Vibrate, Eye, ChevronDown 
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AddReminderModal } from "@/components/reminders/AddReminderModal";

interface Reminder {
  id: number;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  type: 'medication' | 'appointment' | 'activity';
  notificationMethods: NotificationMethod[];
}

type NotificationMethod = 'push' | 'sound' | 'vibration' | 'visual' | 'voice';

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { 
      id: 1, 
      title: "Take Blood Pressure Medication", 
      time: "08:00 AM", 
      date: "Today", 
      completed: false, 
      type: 'medication',
      notificationMethods: ['push', 'sound']
    },
    { 
      id: 2, 
      title: "Doctor Appointment", 
      time: "10:30 AM", 
      date: "Tomorrow", 
      completed: false, 
      type: 'appointment',
      notificationMethods: ['push', 'sound', 'vibration']
    },
    { 
      id: 3, 
      title: "Drink Water", 
      time: "12:00 PM", 
      date: "Today", 
      completed: true, 
      type: 'activity',
      notificationMethods: ['push']
    },
    { 
      id: 4, 
      title: "Take Vitamin D", 
      time: "08:00 PM", 
      date: "Today", 
      completed: false, 
      type: 'medication',
      notificationMethods: ['push', 'sound', 'voice']
    },
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("15");
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationMethod[]>([
    'push', 'sound', 'vibration', 'visual'
  ]);
  const [addReminderOpen, setAddReminderOpen] = useState(false);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
    
    // Show toast notification
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast.success(`${reminder.completed ? 'Unmarked' : 'Marked'} "${reminder.title}" as ${reminder.completed ? 'incomplete' : 'complete'}`);
    }
  };

  const toggleNotificationMethod = (method: NotificationMethod) => {
    setNotificationPreferences(prev => 
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'medication': return <Bell className="h-5 w-5 text-amber-500" />;
      case 'appointment': return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'activity': return <Clock className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  const getNotificationMethodIcon = (method: NotificationMethod) => {
    switch(method) {
      case 'push': return <Bell className="h-4 w-4" />;
      case 'sound': return <Volume2 className="h-4 w-4" />;
      case 'vibration': return <Vibrate className="h-4 w-4" />;
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'voice': return <Volume2 className="h-4 w-4" />;
    }
  };

  const handleReminderAdded = () => {
    // In a real app, we would refetch the reminders
    // For now, we'll just add a mock reminder
    const newReminder: Reminder = {
      id: reminders.length + 1,
      title: "New Reminder",
      time: "03:00 PM",
      date: "Today",
      completed: false,
      type: 'medication',
      notificationMethods: ['push', 'sound']
    };
    
    setReminders([...reminders, newReminder]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
            <p className="text-gray-500 mt-2">Never miss an important medication or appointment</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={showSettings ? "bg-orange-100 text-orange-500 border-orange-200" : ""}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setAddReminderOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>
        </div>
        
        {showSettings && (
          <Card className="bg-orange-50 border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg">Reminder Settings</CardTitle>
              <CardDescription>Customize how you receive reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <Label htmlFor="frequency" className="min-w-[120px]">Reminder frequency</Label>
                </div>
                <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="10">Every 10 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <h3 className="font-medium mb-2">Notification Methods</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="push" 
                      checked={notificationPreferences.includes('push')}
                      onCheckedChange={() => toggleNotificationMethod('push')}
                    />
                    <Label htmlFor="push" className="flex gap-2 items-center cursor-pointer">
                      <Bell className="h-4 w-4" /> 
                      <span>Push Notifications</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sound" 
                      checked={notificationPreferences.includes('sound')}
                      onCheckedChange={() => toggleNotificationMethod('sound')}
                    />
                    <Label htmlFor="sound" className="flex gap-2 items-center cursor-pointer">
                      <Volume2 className="h-4 w-4" /> 
                      <span>Sound Alerts</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="vibration" 
                      checked={notificationPreferences.includes('vibration')}
                      onCheckedChange={() => toggleNotificationMethod('vibration')}
                    />
                    <Label htmlFor="vibration" className="flex gap-2 items-center cursor-pointer">
                      <Vibrate className="h-4 w-4" /> 
                      <span>Vibration</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="visual" 
                      checked={notificationPreferences.includes('visual')}
                      onCheckedChange={() => toggleNotificationMethod('visual')}
                    />
                    <Label htmlFor="visual" className="flex gap-2 items-center cursor-pointer">
                      <Eye className="h-4 w-4" /> 
                      <span>Visual Indicators</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="voice" 
                      checked={notificationPreferences.includes('voice')}
                      onCheckedChange={() => toggleNotificationMethod('voice')}
                    />
                    <Label htmlFor="voice" className="flex gap-2 items-center cursor-pointer">
                      <Volume2 className="h-4 w-4" /> 
                      <span>Voice Reminders</span>
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className={`overflow-hidden hover:shadow-md transition-all ${reminder.completed ? 'bg-gray-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant={reminder.completed ? "default" : "outline"} 
                      size="icon"
                      className={`${reminder.completed ? 'bg-amber-500 text-white' : 'text-gray-400'} h-10 w-10 rounded-full`}
                      onClick={() => toggleReminder(reminder.id)}
                    >
                      {reminder.completed ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    </Button>
                    <div>
                      <h3 className={`text-lg font-medium ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {reminder.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{reminder.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{reminder.date}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-1">
                        {reminder.notificationMethods.map((method) => (
                          <span key={method} className="inline-flex items-center p-1 bg-amber-50 rounded-full text-amber-600">
                            {getNotificationMethodIcon(method)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-gray-100">
                      {getIconForType(reminder.type)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Snooze</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="p-6 bg-gradient-to-r from-amber-50 to-red-50 rounded-xl shadow-sm mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Set Up Voice Reminders</h2>
              <p className="text-gray-600 mt-1">Get friendly audio reminders for your medications</p>
            </div>
            <Button variant="outline" className="border-amber-200 bg-white">
              Enable Voice Reminders
            </Button>
          </div>
        </div>
      </div>
      
      <AddReminderModal 
        open={addReminderOpen} 
        onOpenChange={setAddReminderOpen}
        onReminderAdded={handleReminderAdded}
      />
    </DashboardLayout>
  );
};

export default Reminders;
