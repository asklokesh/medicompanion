
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Calendar, Camera, Brain } from "lucide-react";

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link to="/medications" className="block">
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <Pill className="h-10 w-10 text-amber-500 mb-2" />
            <h3 className="text-lg font-medium">My Medications</h3>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/schedule" className="block">
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <Calendar className="h-10 w-10 text-orange-500 mb-2" />
            <h3 className="text-lg font-medium">Schedule</h3>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/identify" className="block">
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <Camera className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-medium">Identify Pill</h3>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/brain-games" className="block">
        <Card className="h-full hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <Brain className="h-10 w-10 text-amber-600 mb-2" />
            <h3 className="text-lg font-medium">Brain Games</h3>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
