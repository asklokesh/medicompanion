
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyMedicationsCard() {
  return (
    <Card>
      <CardContent className="p-6 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-primary mx-auto" />
        <h3 className="text-xl font-medium">No medications added yet</h3>
        <p className="text-gray-500">
          Start by adding your medications to receive reminders
        </p>
        <Button asChild>
          <Link to="/medications/add">Add Medication</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
