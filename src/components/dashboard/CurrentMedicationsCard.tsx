
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import type { Medication } from "@/hooks/useDashboardData";

interface CurrentMedicationsCardProps {
  currentMedications: Medication[];
  isCurrentMedicationTaken: (medId: string) => boolean;
  allCurrentMedicationsTaken: () => boolean;
  timeOfDay: string;
  markMedicationsTaken: () => Promise<boolean>;
}

export function CurrentMedicationsCard({
  currentMedications,
  isCurrentMedicationTaken,
  allCurrentMedicationsTaken,
  timeOfDay,
  markMedicationsTaken,
}: CurrentMedicationsCardProps) {
  
  const capitalizedTimeOfDay = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);

  const handleTakeMedications = async () => {
    await markMedicationsTaken();
  };

  if (currentMedications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No {capitalizedTimeOfDay} Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            You don't have any medications scheduled for {timeOfDay}.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (allCurrentMedicationsTaken()) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
            {capitalizedTimeOfDay} Medications Taken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-2">
            Great job! You've taken all your {timeOfDay} medications.
          </p>
          <div className="space-y-2">
            {currentMedications.map((med) => (
              <div
                key={med.id}
                className="p-3 bg-white border border-green-200 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm text-gray-500">{med.dosage}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-primary" />
          {capitalizedTimeOfDay} Medications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {currentMedications.map((med) => (
              <div
                key={med.id}
                className={`p-3 border rounded-lg flex justify-between items-center ${
                  isCurrentMedicationTaken(med.id)
                    ? "bg-green-50 border-green-200"
                    : "bg-white"
                }`}
              >
                <div>
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm text-gray-500">{med.dosage}</p>
                </div>
                {isCurrentMedicationTaken(med.id) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : null}
              </div>
            ))}
          </div>

          {!allCurrentMedicationsTaken() && (
            <Button
              size="lg"
              className="w-full text-lg rounded-xl h-14"
              onClick={handleTakeMedications}
            >
              Take All Medications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
