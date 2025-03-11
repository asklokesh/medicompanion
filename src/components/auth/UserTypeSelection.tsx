
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, UserRound, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function UserTypeSelection() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <Heart className="w-12 h-12 mx-auto text-primary float" />
        <h1 className="text-3xl font-bold text-gray-900">Welcome to MediCompanion</h1>
        <p className="text-xl text-gray-600">Choose how you'd like to continue</p>
      </div>

      <div className="grid gap-4">
        <Link to="/login/senior">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <UserRound className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">I'm a Senior</h2>
                <p className="text-gray-600 text-lg">Manage my medications</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/login/caregiver">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <User className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">I'm a Caregiver</h2>
                <p className="text-gray-600 text-lg">Help manage medications</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="text-center">
        <Button asChild variant="link" className="text-lg">
          <Link to="/help">Need help getting started?</Link>
        </Button>
      </div>
    </div>
  );
}

