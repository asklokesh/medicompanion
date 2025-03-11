
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const AddMedication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const timeOptions = [
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" },
    { id: "night", label: "Night" }
  ];

  const handleTimeOfDayChange = (timeId: string, checked: boolean) => {
    if (checked) {
      setTimeOfDay([...timeOfDay, timeId]);
    } else {
      setTimeOfDay(timeOfDay.filter(id => id !== timeId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !dosage || !frequency || timeOfDay.length === 0) {
      toast.error("Please fill all required fields and select at least one time of day");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('medications')
        .insert({
          user_id: user?.id,
          name,
          dosage,
          frequency,
          time_of_day: timeOfDay,
          notes: notes || null
        });
      
      if (error) throw error;
      
      toast.success("Medication added successfully");
      navigate("/medications");
    } catch (error) {
      toast.error("Failed to add medication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add New Medication</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Lisinopril"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 10mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={setFrequency}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Time of Day</Label>
                <div className="grid grid-cols-2 gap-3">
                  {timeOptions.map((time) => (
                    <div key={time.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`time-${time.id}`} 
                        checked={timeOfDay.includes(time.id)}
                        onCheckedChange={(checked) => 
                          handleTimeOfDayChange(time.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`time-${time.id}`}
                        className="text-sm font-normal"
                      >
                        {time.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {timeOfDay.length === 0 && (
                  <p className="text-sm text-red-500">Please select at least one time of day</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or notes about this medication"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !name || !dosage || !frequency || timeOfDay.length === 0}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Add Medication</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddMedication;
