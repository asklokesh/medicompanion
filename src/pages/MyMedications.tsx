
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Plus, Edit, Trash2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes?: string;
}

const MyMedications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('user_id', user.id)
            .order('name');
          
          if (error) throw error;
          
          if (data) {
            setMedications(data);
          }
        } catch (err) {
          console.error("Error fetching medications:", err);
          setError("Failed to load medications. Please try again.");
          toast.error("Failed to load medications");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedications();
  }, [user]);

  const deleteMedication = async () => {
    if (!medicationToDelete) return;
    
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medicationToDelete);
      
      if (error) throw error;
      
      setMedications(medications.filter(med => med.id !== medicationToDelete));
      toast.success("Medication deleted successfully");
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("Failed to delete medication");
    } finally {
      setMedicationToDelete(null);
    }
  };

  const displayTimeOfDay = (times: string[]) => {
    if (!Array.isArray(times)) return '';
    
    return times
      .map(time => time.charAt(0).toUpperCase() + time.slice(1))
      .join(', ');
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Fetch medications again
    if (user) {
      supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('name')
        .then(({ data, error }) => {
          if (error) {
            console.error("Error retrying medication fetch:", error);
            setError("Failed to load medications. Please try again.");
            toast.error("Failed to load medications");
          } else if (data) {
            setMedications(data);
          }
          setLoading(false);
        });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Medications</h1>
          <Button asChild>
            <Link to="/medications/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h3 className="text-xl font-medium">Error Loading Medications</h3>
              <p className="text-gray-500">{error}</p>
              <Button onClick={handleRetry}>Try Again</Button>
            </CardContent>
          </Card>
        ) : medications.length > 0 ? (
          <div className="space-y-4">
            {medications.map((medication) => (
              <Card key={medication.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{medication.name}</h3>
                        <p className="text-gray-500">{medication.dosage}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {medication.frequency}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {displayTimeOfDay(medication.time_of_day)}
                          </span>
                        </div>
                        {medication.notes && (
                          <p className="text-sm text-gray-500 mt-2">{medication.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/medications/edit/${medication.id}`} aria-label={`Edit ${medication.name}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setMedicationToDelete(medication.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Delete ${medication.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-xl font-medium">No medications yet</h3>
              <p className="text-gray-500">
                Start by adding your medications to receive reminders
              </p>
              <Button asChild>
                <Link to="/medications/add">Add Medication</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!medicationToDelete} onOpenChange={(open) => !open && setMedicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this medication and all its records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMedication} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MyMedications;
