
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, UserPlus, UserCheck, Mail } from "lucide-react";

const CaregiverConnect = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<Array<{id: string, email: string, status: string}>>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  // This would be implemented with a real backend to handle caregiver-senior connections
  const sendInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    
    try {
      // This is a placeholder - in a real app, we would send an invitation
      // and store the connection in the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
      
      // Add the new connection to the list with "pending" status
      setConnections([...connections, {
        id: Math.random().toString(36).substring(2, 9),
        email,
        status: "pending"
      }]);
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Caregiver Connect</h1>
          <p className="text-gray-500 mt-2">
            Connect with your caregivers to share medication information and receive assistance.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <span>Invite a Caregiver</span>
            </CardTitle>
            <CardDescription>
              Enter the email address of your caregiver to send them an invitation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="caregiver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={sendInvite} disabled={loading}>
                {loading ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Your Connections</span>
            </CardTitle>
            <CardDescription>
              View and manage your caregiver connections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connections.length > 0 ? (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div 
                    key={connection.id} 
                    className="flex items-center justify-between border p-3 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{connection.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {connection.status === "active" ? (
                            <>
                              <UserCheck className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-500">Active</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 text-amber-500" />
                              <span className="text-xs text-amber-500">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {connection.status === "active" ? "Remove" : "Cancel"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>No connections yet</p>
                <p className="text-sm">Invite caregivers to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CaregiverConnect;
