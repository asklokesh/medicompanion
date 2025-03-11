
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, Phone, Users } from "lucide-react";
import { useState } from "react";

const VideoChat = () => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Chat</h1>
          <p className="text-gray-500 mt-2">Connect with caregivers and healthcare providers</p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users className="h-5 w-5 mr-2" /> Active Call
            </h2>
          </div>
          <CardContent className="p-8">
            <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {videoEnabled ? (
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Video call" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-600">
                  <VideoOff className="h-16 w-16 mb-2" />
                  <p className="text-lg">Camera is off</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button 
                onClick={() => setMicEnabled(!micEnabled)}
                variant={micEnabled ? "outline" : "secondary"} 
                size="icon" 
                className={`rounded-full h-16 w-16 shadow-md transition-all hover:scale-105 ${micEnabled ? 'bg-white' : 'bg-red-100 text-red-600'}`}
              >
                {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </Button>
              <Button 
                onClick={() => setVideoEnabled(!videoEnabled)}
                variant={videoEnabled ? "outline" : "secondary"} 
                size="icon" 
                className={`rounded-full h-16 w-16 shadow-md transition-all hover:scale-105 ${videoEnabled ? 'bg-white' : 'bg-red-100 text-red-600'}`}
              >
                {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full h-16 w-16 bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <Phone className="h-6 w-6" />
              </Button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-center text-blue-700 italic">
                "Hi Mom! How are you feeling today? Did you take your morning medication?" - Emily
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Recent Calls</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">E</span>
                  </div>
                  <div>
                    <p className="font-medium">Emily (Daughter)</p>
                    <p className="text-sm text-gray-500">Yesterday, 3:45 PM</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">D</span>
                  </div>
                  <div>
                    <p className="font-medium">Dr. Johnson</p>
                    <p className="text-sm text-gray-500">March 5, 10:00 AM</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Scheduled Calls</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                  <div className="mr-3">
                    <p className="text-xl font-bold text-blue-600">15</p>
                    <p className="text-xs text-blue-600">MAR</p>
                  </div>
                  <div>
                    <p className="font-medium">Family Video Call</p>
                    <p className="text-sm text-gray-500">4:00 PM (30 minutes)</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto text-blue-700 border-blue-200 bg-blue-50">
                    Join
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-purple-50 rounded-xl border-l-4 border-purple-400">
                  <div className="mr-3">
                    <p className="text-xl font-bold text-purple-600">20</p>
                    <p className="text-xs text-purple-600">MAR</p>
                  </div>
                  <div>
                    <p className="font-medium">Dr. Johnson Follow-up</p>
                    <p className="text-sm text-gray-500">10:30 AM (15 minutes)</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto text-purple-700 border-purple-200 bg-purple-50">
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VideoChat;
