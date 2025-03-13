
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Apple, PlusCircle, SmartphoneCharging, Watch } from "lucide-react";

interface DeviceIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeviceIntegrationModal({
  open,
  onOpenChange,
}: DeviceIntegrationModalProps) {
  const [connectedDevices, setConnectedDevices] = useState<Record<string, boolean>>({
    appleWatch: false,
    appleHealth: false,
    fitbit: false,
    googleFit: false,
  });
  
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = (device: string) => {
    setIsConnecting(device);
    
    // Simulate connection process
    setTimeout(() => {
      setConnectedDevices({
        ...connectedDevices,
        [device]: true,
      });
      setIsConnecting(null);
      toast.success(`${getDeviceName(device)} connected successfully`);
    }, 1500);
  };
  
  const handleDisconnect = (device: string) => {
    setIsConnecting(device);
    
    // Simulate disconnection process
    setTimeout(() => {
      setConnectedDevices({
        ...connectedDevices,
        [device]: false,
      });
      setIsConnecting(null);
      toast.success(`${getDeviceName(device)} disconnected`);
    }, 1000);
  };
  
  const getDeviceName = (device: string): string => {
    switch (device) {
      case 'appleWatch':
        return 'Apple Watch';
      case 'appleHealth':
        return 'Apple Health';
      case 'fitbit':
        return 'Fitbit';
      case 'googleFit':
        return 'Google Fit';
      default:
        return device;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect Health Devices</DialogTitle>
          <DialogDescription>
            Link your health trackers to automatically sync your health data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Apple className="h-5 w-5" /> Apple Watch
              </CardTitle>
              <CardDescription>
                Sync data from your Apple Watch
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Status</span>
                <span className={`text-sm font-medium ${connectedDevices.appleWatch ? 'text-green-600' : 'text-red-500'}`}>
                  {connectedDevices.appleWatch ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={connectedDevices.appleWatch ? "outline" : "default"}
                className={connectedDevices.appleWatch ? 
                  "w-full border-red-200 text-red-700 hover:bg-red-50" : 
                  "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                }
                onClick={() => connectedDevices.appleWatch ? 
                  handleDisconnect('appleWatch') : 
                  handleConnect('appleWatch')
                }
                disabled={isConnecting !== null}
              >
                {isConnecting === 'appleWatch' ? 
                  (connectedDevices.appleWatch ? "Disconnecting..." : "Connecting...") : 
                  (connectedDevices.appleWatch ? "Disconnect" : "Connect")
                }
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Watch className="h-5 w-5" /> Fitbit
              </CardTitle>
              <CardDescription>
                Sync data from your Fitbit devices
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Status</span>
                <span className={`text-sm font-medium ${connectedDevices.fitbit ? 'text-green-600' : 'text-red-500'}`}>
                  {connectedDevices.fitbit ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={connectedDevices.fitbit ? "outline" : "default"}
                className={connectedDevices.fitbit ? 
                  "w-full border-red-200 text-red-700 hover:bg-red-50" : 
                  "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                }
                onClick={() => connectedDevices.fitbit ? 
                  handleDisconnect('fitbit') : 
                  handleConnect('fitbit')
                }
                disabled={isConnecting !== null}
              >
                {isConnecting === 'fitbit' ? 
                  (connectedDevices.fitbit ? "Disconnecting..." : "Connecting...") : 
                  (connectedDevices.fitbit ? "Disconnect" : "Connect")
                }
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Apple className="h-5 w-5" /> Apple Health
              </CardTitle>
              <CardDescription>
                Sync data from the iPhone Health app
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Status</span>
                <span className={`text-sm font-medium ${connectedDevices.appleHealth ? 'text-green-600' : 'text-red-500'}`}>
                  {connectedDevices.appleHealth ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={connectedDevices.appleHealth ? "outline" : "default"}
                className={connectedDevices.appleHealth ? 
                  "w-full border-red-200 text-red-700 hover:bg-red-50" : 
                  "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                }
                onClick={() => connectedDevices.appleHealth ? 
                  handleDisconnect('appleHealth') : 
                  handleConnect('appleHealth')
                }
                disabled={isConnecting !== null}
              >
                {isConnecting === 'appleHealth' ? 
                  (connectedDevices.appleHealth ? "Disconnecting..." : "Connecting...") : 
                  (connectedDevices.appleHealth ? "Disconnect" : "Connect")
                }
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <SmartphoneCharging className="h-5 w-5" /> Google Fit
              </CardTitle>
              <CardDescription>
                Sync data from Google Fit app
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Status</span>
                <span className={`text-sm font-medium ${connectedDevices.googleFit ? 'text-green-600' : 'text-red-500'}`}>
                  {connectedDevices.googleFit ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={connectedDevices.googleFit ? "outline" : "default"}
                className={connectedDevices.googleFit ? 
                  "w-full border-red-200 text-red-700 hover:bg-red-50" : 
                  "w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                }
                onClick={() => connectedDevices.googleFit ? 
                  handleDisconnect('googleFit') : 
                  handleConnect('googleFit')
                }
                disabled={isConnecting !== null}
              >
                {isConnecting === 'googleFit' ? 
                  (connectedDevices.googleFit ? "Disconnecting..." : "Connecting...") : 
                  (connectedDevices.googleFit ? "Disconnect" : "Connect")
                }
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
