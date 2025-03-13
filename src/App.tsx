import { Toaster } from "./toaster";
import { Toaster as Sonner } from "./sonner";
import { TooltipProvider } from "./tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Index from "./Index";
import Login from "./Login";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import MyMedications from "./pages/MyMedications";
import Schedule from "./pages/Schedule";
import IdentifyPill from "./pages/IdentifyPill";
import AddMedication from "./pages/AddMedication";
import EditMedication from "./pages/EditMedication";
import CaregiverConnect from "./pages/CaregiverConnect";
import Profile from "./pages/Profile";
import BrainGames from "./pages/BrainGames";
import Reminders from "./pages/Reminders";
import HealthTracking from "./HealthTracking";
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
              {/* Common routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Senior-specific routes */}
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/brain-games" element={<BrainGames />} />
              <Route path="/medications" element={<MyMedications />} />
              <Route path="/medications/add" element={<AddMedication />} />
              <Route path="/medications/edit/:id" element={<EditMedication />} />
              <Route path="/identify" element={<IdentifyPill />} />
              <Route path="/health-tracking" element={<HealthTracking />} />
              <Route path="/connect" element={<CaregiverConnect />} />
              
              {/* Admin route */}
              <Route path="/admin/config" element={<AdminConfig />} />
              
              {/* Caregiver-specific routes - disabled but code preserved */}
              {/* 
              <Route path="/adherence-tracking" element={<AdherenceTracking />} />
              <Route path="/appointment-manager" element={<AppointmentManager />} />
              <Route path="/care-notes" element={<CareNotes />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/video-chat" element={<VideoChat />} />
              <Route path="/health-reports" element={<HealthReports />} /> 
              */}
              
              {/* Legacy routes to keep compatibility */}
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
