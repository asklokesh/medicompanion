
import { useState } from "react";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { LucideSmile, UserRound, Users } from "lucide-react";

export function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to MediCompanion
        </h1>
        <p className="text-xl text-gray-600">
          Your personal medication assistant
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-lg text-center text-gray-700">I am a:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="button"
            variant={selectedType === "senior" ? "default" : "outline"}
            className={`text-lg p-6 flex-col h-auto space-y-2 ${
              selectedType === "senior"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : ""
            }`}
            onClick={() => setSelectedType("senior")}
          >
            <UserRound className="h-10 w-10" />
            <span>Senior</span>
          </Button>

          <Button
            type="button"
            variant={selectedType === "caregiver" ? "default" : "outline"}
            className={`text-lg p-6 flex-col h-auto space-y-2 ${
              selectedType === "caregiver"
                ? "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                : ""
            }`}
            onClick={() => setSelectedType("caregiver")}
          >
            <Users className="h-10 w-10" />
            <span>Caregiver</span>
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="button"
          className={`w-full text-xl py-6 bg-gradient-to-r ${
            selectedType === "senior"
              ? "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              : selectedType === "caregiver"
              ? "from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              : "from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          }`}
          disabled={!selectedType}
          asChild
        >
          <Link to={selectedType ? `/login/${selectedType}` : "#"}>
            Continue
          </Link>
        </Button>

        <div className="mt-4 text-center">
          <Button variant="link" asChild className="text-lg">
            <Link to="/help">Need help?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
