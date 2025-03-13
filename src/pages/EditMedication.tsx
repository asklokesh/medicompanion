
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes?: string;
}

const EditMedication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [medication, setMedication] = useState<Medication | null>(null);
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

  useEffect(() => {
    const fetchMedication = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setFetchError(null);
        
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setMedication(data);
          setName(data.name);
          setDosage(data.dosage);
          setFrequency(data.frequency);
          // Ensure time_of_day is an array
          setTimeOfDay(Array.isArray(data.time_of_day) ? data.time_of_day : []);
          setNotes(data.notes || "");
        }
      } catch (error) {
        console.error("Error fetching medication:", error);
        setFetchError("Failed to load medication details");
        toast.error("Failed to load medication");
      } finally {
        setLoading(false);
      }
    };

    fetchMedication();
  }, [id, user, navigate]);

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

    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('medications')
        .update({
          name,
          dosage,
          frequency,
          time_of_day: timeOfDay,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Medication updated successfully");
      navigate("/medications");
    } catch (error) {
      console.error("Error updating medication:", error);
      toast.error("Failed to update medication");
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    if (!id || !user) return;
    
    setLoading(true);
    setFetchError(null);
    
    supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error retrying medication fetch:", error);
          setFetchError("Failed to load medication details");
          toast.error("Failed to load medication");
        } else if (data) {
          setMedication(data);
          setName(data.name);
          setDosage(data.dosage);
          setFrequency(data.frequency);
          setTimeOfDay(Array.isArray(data.time_of_day) ? data.time_of_day : []);
          setNotes(data.notes || "");
        }
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
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
          
          <Card className="text-center py-8">
            <CardContent className="space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-medium">Error Loading Medication</h2>
              <p className="text-gray-500">{fetchError}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={handleRetry}>Try Again</Button>
                <Button variant="outline" asChild>
                  <Link to="/medications">Back to Medications</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!medication) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl">Medication not found</h2>
          <Button onClick={() => navigate("/medications")} className="mt-4">
            Back to Medications
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
            <CardTitle className="text-2xl">Edit Medication</CardTitle>
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
                  aria-required="true"
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
                  aria-required="true"
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
                disabled={saving || !name || !dosage || !frequency || timeOfDay.length === 0}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Save Changes</span>
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

export default EditMedication;
