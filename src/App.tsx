
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MyMedications from "./pages/MyMedications";
import Schedule from "./pages/Schedule";
import IdentifyPill from "./pages/IdentifyPill";
import AddMedication from "./pages/AddMedication";
import EditMedication from "./pages/EditMedication";
import CaregiverConnect from "./pages/CaregiverConnect";
import Profile from "./pages/Profile";
import BrainGames from "./pages/BrainGames";
import Reminders from "./pages/Reminders";
import HealthTracking from "./pages/HealthTracking";
import AdminConfig from "./pages/AdminConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/:userType" element={<Login />} />
            <Route path="/signup/:userType" element={<Signup />} />
            <Route path="/help" element={<Help />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/brain-games" element={<BrainGames />} />
              <Route path="/medications" element={<MyMedications />} />
              <Route path="/medications/add" element={<AddMedication />} />
              <Route path="/medications/edit/:id" element={<EditMedication />} />
              <Route path="/identify" element={<IdentifyPill />} />
              <Route path="/health-tracking" element={<HealthTracking />} />
              <Route path="/connect" element={<CaregiverConnect />} />
              <Route path="/admin/config" element={<AdminConfig />} />
              <Route path="/schedule" element={<Schedule />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
