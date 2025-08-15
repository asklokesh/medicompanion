import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import type { Interaction } from "@/services/medicationService";

interface InteractionAlertCardProps {
  interactions: Interaction[];
}

const severityConfig = {
  major: {
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    title: "Major Interaction",
    color: "bg-red-50 border-red-200 text-red-800",
  },
  moderate: {
    icon: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
    title: "Moderate Interaction",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800",
  },
  minor: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    title: "Minor Interaction",
    color: "bg-blue-50 border-blue-200 text-blue-800",
  },
};

export const InteractionAlertCard = ({ interactions }: InteractionAlertCardProps) => {
  if (interactions.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50 shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-3 pb-2">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <CardTitle className="text-xl font-bold text-red-800">
          Potential Medication Interactions Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-700 mb-4">
          Please consult with your doctor or pharmacist about the following potential interactions.
        </p>
        <div className="space-y-3">
          {interactions.map((interaction, index) => {
            const config = severityConfig[interaction.severity] || severityConfig.minor;
            return (
              <div key={index} className={`p-3 rounded-lg border ${config.color}`}>
                <div className="flex items-center font-bold mb-1">
                  {config.icon}
                  <span className="ml-2">{config.title}</span>
                </div>
                <p className="font-semibold">
                  {interaction.drug_1.name} & {interaction.drug_2.name}
                </p>
                <p className="text-sm">{interaction.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
