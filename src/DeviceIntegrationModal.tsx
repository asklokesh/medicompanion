
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Activity, Heart, Smartphone, Watch } from "lucide-react";
import { connectHealthDevice, disconnectHealthDevice } from "./healthTrackingService";

interface DeviceIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeviceIntegrationModal({
  open,
  onOpenChange,
}: DeviceIntegrationModalProps) {
  const { user } = useAuth();
  const [connectingDevice, setConnectingDevice] = useState<string | null>(null);

  // In a real app, we would fetch the connected devices from the database
  const [connectedDevices, setConnectedDevices] = useState<string[]>([
    "apple_watch",
  ]);

  const handleConnectDevice = async (deviceType: string) => {
    setConnectingDevice(deviceType);
    try {
      const success = await connectHealthDevice(deviceType, user?.id);
      
      if (success) {
        toast.success(`Connected to ${getDeviceName(deviceType)}`);
        if (!connectedDevices.includes(deviceType)) {
          setConnectedDevices([...connectedDevices, deviceType]);
        }
      } else {
        toast.error(`Failed to connect to ${getDeviceName(deviceType)}`);
      }
    } catch (error) {
      console.error(`Error connecting to device:`, error);
      toast.error(`An error occurred while connecting to the device`);
    } finally {
      setConnectingDevice(null);
    }
  };

  const handleDisconnectDevice = async (deviceType: string) => {
    setConnectingDevice(deviceType);
    try {
      const success = await disconnectHealthDevice(deviceType, user?.id);
      
      if (success) {
        toast.success(`Disconnected from ${getDeviceName(deviceType)}`);
        setConnectedDevices(connectedDevices.filter(d => d !== deviceType));
      } else {
        toast.error(`Failed to disconnect from ${getDeviceName(deviceType)}`);
      }
    } catch (error) {
      console.error(`Error disconnecting device:`, error);
      toast.error(`An error occurred while disconnecting the device`);
    } finally {
      setConnectingDevice(null);
    }
  };

  const getDeviceName = (deviceType: string): string => {
    switch (deviceType) {
      case "apple_watch":
        return "Apple Watch";
      case "fitbit":
        return "Fitbit";
      case "glucose_monitor":
        return "Glucose Monitor";
      case "blood_pressure":
        return "Blood Pressure Monitor";
      default:
        return deviceType;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "apple_watch":
        return <Watch className="h-6 w-6 text-gray-600" />;
      case "fitbit":
        return <Activity className="h-6 w-6 text-gray-600" />;
      case "glucose_monitor":
        return <Activity className="h-6 w-6 text-gray-600" />;
      case "blood_pressure":
        return <Heart className="h-6 w-6 text-gray-600" />;
      default:
        return <Smartphone className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Health Devices</DialogTitle>
          <DialogDescription>
            Connect your health monitoring devices to automatically sync your health data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="grid grid-cols-1 gap-4">
            {["apple_watch", "fitbit", "glucose_monitor", "blood_pressure"].map(
              (deviceType) => {
                const isConnected = connectedDevices.includes(deviceType);
                const isLoading = connectingDevice === deviceType;

                return (
                  <div
                    key={deviceType}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(deviceType)}
                      <div>
                        <h3 className="font-medium">{getDeviceName(deviceType)}</h3>
                        <p className="text-sm text-gray-500">
                          {isConnected
                            ? "Connected and syncing data"
                            : "Not connected"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={isConnected ? "outline" : "default"}
                      size="sm"
                      onClick={() =>
                        isConnected
                          ? handleDisconnectDevice(deviceType)
                          : handleConnectDevice(deviceType)
                      }
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Processing..."
                        : isConnected
                        ? "Disconnect"
                        : "Connect"}
                    </Button>
                  </div>
                );
              }
            )}
          </div>

          <div className="pt-2 text-center text-sm text-gray-500">
            <p>Devices will sync data automatically in the background</p>
            <p className="mt-1">
              For technical support with device connections, please contact support
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
