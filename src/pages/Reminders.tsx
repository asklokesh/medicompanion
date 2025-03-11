
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Check, Clock, Calendar, X, Settings } from "lucide-react";
import { useState } from "react";

interface Reminder {
  id: number;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  type: 'medication' | 'appointment' | 'activity';
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, title: "Take Blood Pressure Medication", time: "08:00 AM", date: "Today", completed: false, type: 'medication' },
    { id: 2, title: "Doctor Appointment", time: "10:30 AM", date: "Tomorrow", completed: false, type: 'appointment' },
    { id: 3, title: "Drink Water", time: "12:00 PM", date: "Today", completed: true, type: 'activity' },
    { id: 4, title: "Take Vitamin D", time: "08:00 PM", date: "Today", completed: false, type: 'medication' },
  ]);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'medication': return <Bell className="h-5 w-5 text-primary" />;
      case 'appointment': return <Calendar className="h-5 w-5 text-accent" />;
      case 'activity': return <Clock className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
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
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className={`overflow-hidden hover:shadow-md transition-all ${reminder.completed ? 'bg-gray-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant={reminder.completed ? "default" : "outline"} 
                      size="icon"
                      className={`${reminder.completed ? 'bg-primary text-white' : 'text-gray-400'} h-10 w-10 rounded-full`}
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-gray-100">
                      {getIconForType(reminder.type)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl shadow-sm mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Set Up Voice Reminders</h2>
              <p className="text-gray-600 mt-1">Get friendly audio reminders for your medications</p>
            </div>
            <Button variant="outline" className="border-teal-200 bg-white">
              Enable Voice Reminders
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reminders;
