
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import ThemeSettings from "./pages/ThemeSettings";
import AddMedication from "./pages/AddMedication";
import EditMedication from "./pages/EditMedication";
import CaregiverConnect from "./pages/CaregiverConnect";
import Profile from "./pages/Profile";

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
              <Route path="/medications" element={<MyMedications />} />
              <Route path="/medications/add" element={<AddMedication />} />
              <Route path="/medications/edit/:id" element={<EditMedication />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/identify" element={<IdentifyPill />} />
              <Route path="/theme" element={<ThemeSettings />} />
              <Route path="/connect" element={<CaregiverConnect />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
