import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import type { Medication } from "@/hooks/useDashboardData";

interface InteractiveMedicationListProps {
  currentMedications: Medication[];
  updateMedicationStatus: (medicationId: string, status: 'taken' | 'skipped') => void;
  isMedicationTakenToday: (medicationId: string, time: string) => boolean;
  timeOfDay: string;
}

export function InteractiveMedicationList({
  currentMedications,
  updateMedicationStatus,
  isMedicationTakenToday,
  timeOfDay,
}: InteractiveMedicationListProps) {

  const capitalizedTimeOfDay = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);

  const allTaken = currentMedications.every(med => isMedicationTakenToday(med.id, timeOfDay));

  if (currentMedications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No {capitalizedTimeOfDay} Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">You have no medications scheduled for this time.</p>
        </CardContent>
      </Card>
    );
  }

  if (allTaken) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
            {capitalizedTimeOfDay} Medications Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">Great job! You've handled all your {timeOfDay} medications.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-amber-600" />
          {capitalizedTimeOfDay} Medications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentMedications.map((med) => {
            const isTaken = isMedicationTakenToday(med.id, timeOfDay);
            return (
              <div
                key={med.id}
                className={`p-4 border rounded-lg flex justify-between items-center transition-all ${
                  isTaken ? "bg-green-50 border-green-200" : "bg-white"
                }`}
              >
                <div>
                  <h4 className="font-semibold text-lg">{med.name}</h4>
                  <p className="text-sm text-gray-600">{med.dosage}</p>
                </div>
                {isTaken ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-6 w-6 mr-2" />
                    <span className="font-semibold">Taken</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-gray-300 hover:bg-gray-100"
                      aria-label="Skip"
                      onClick={() => updateMedicationStatus(med.id, 'skipped')}
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 bg-green-500 hover:bg-green-600"
                      aria-label="Take"
                      onClick={() => updateMedicationStatus(med.id, 'taken')}
                    >
                      <Check className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
