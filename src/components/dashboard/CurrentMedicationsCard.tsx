
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Pill } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Medication, MedicationLog } from "@/hooks/useDashboardData";

interface CurrentMedicationsCardProps {
  currentMedications: Medication[];
  isCurrentMedicationTaken: (medId: string) => boolean;
  allCurrentMedicationsTaken: () => boolean;
  timeOfDay: string;
  markMedicationsTaken: () => Promise<boolean>;
  caregiverMessage: string;
}

export function CurrentMedicationsCard({
  currentMedications,
  isCurrentMedicationTaken,
  allCurrentMedicationsTaken,
  timeOfDay,
  markMedicationsTaken,
  caregiverMessage
}: CurrentMedicationsCardProps) {
  if (currentMedications.length === 0) {
    return null;
  }

  const handleMarkTaken = async () => {
    const success = await markMedicationsTaken();
    if (success) {
      toast.success("Medications marked as taken!");
    } else {
      toast.error("Failed to update medication status");
    }
  };

  return (
    <Card className="border-l-4 border-l-red-500 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Medications
            </h2>
          </div>
          
          <div className="mb-4">
            <h3 className="text-2xl font-bold">
              {format(new Date(), 'h:mm a')}
            </h3>
            
            <div className="mt-4 space-y-2 border-l-2 border-gray-200 pl-4">
              {currentMedications.map((med) => (
                <div 
                  key={med.id} 
                  className={`flex items-center gap-2 ${
                    isCurrentMedicationTaken(med.id) ? 'text-gray-500 line-through' : ''
                  }`}
                >
                  <Pill className="h-5 w-5 text-primary" />
                  <span className="text-lg">{med.name} ({med.dosage})</span>
                </div>
              ))}
            </div>
          </div>
          
          {!allCurrentMedicationsTaken() && (
            <Button 
              className="w-full text-lg py-6"
              onClick={handleMarkTaken}
            >
              TAKE MEDICATIONS
            </Button>
          )}
          
          {caregiverMessage && (
            <p className="text-gray-600 italic mt-4 text-center">
              {caregiverMessage}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
