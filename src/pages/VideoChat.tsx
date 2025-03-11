
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, Phone } from "lucide-react";

const VideoChat = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Chat</h1>
          <p className="text-gray-500 mt-2">Connect with caregivers and healthcare providers</p>
        </div>

        <Card className="bg-gray-50">
          <CardContent className="p-8">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <Video className="h-16 w-16 text-gray-600" />
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="destructive" size="icon" className="rounded-full h-12 w-12">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VideoChat;
