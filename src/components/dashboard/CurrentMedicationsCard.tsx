
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import type { Medication } from "@/hooks/useDashboardData";
import VoiceReminderService from "@/services/voiceReminderService";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  // Check for time-based greetings when component mounts
  useEffect(() => {
    const checkForGreeting = async () => {
      const voiceService = VoiceReminderService.getInstance();
      if (voiceService.isEnabled()) {
        try {
          // Fetch dear ones from profile
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('dear_ones')
              .eq('id', userData.user.id)
              .single();
            
            if (profile?.dear_ones) {
              voiceService.speakTimeBasedGreeting(profile.dear_ones as any);
            } else {
              voiceService.speakTimeBasedGreeting();
            }
          }
        } catch (error) {
          console.error("Error fetching profile data for voice greeting:", error);
          // Still provide greeting without personalization
          voiceService.speakTimeBasedGreeting();
        }
      }
    };
    
    checkForGreeting();
  }, []);

  const handleTakeMedications = async () => {
    await markMedicationsTaken();
  };

  const handleMarkTaken = async () => {
    markMedicationsTaken();
    
    // Add voice notification if enabled
    const voiceService = VoiceReminderService.getInstance();
    if (voiceService.isEnabled()) {
      const timeStr = timeOfDay === 'morning' ? 'morning' : 
                      timeOfDay === 'afternoon' ? 'afternoon' : 'evening';
      
      voiceService.speak(`Great job! You've taken your ${timeStr} medications. Keep up the good work!`);
    }
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
              onClick={handleMarkTaken}
            >
              Take All Medications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
