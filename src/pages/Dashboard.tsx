
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { EmptyMedicationsCard } from "@/components/dashboard/EmptyMedicationsCard";
import { QuickAccessGrid } from "@/components/dashboard/QuickAccessGrid";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";
import { InteractionAlertCard } from "@/components/dashboard/InteractionAlertCard";
import { InteractiveMedicationList } from "@/components/dashboard/InteractiveMedicationList";

const Dashboard = () => {
  const { user } = useAuth();

  const {
    userProfile,
    medications,
    currentMedications,
    loading,
    timeOfDay,
    updateMedicationStatus,
    isMedicationTakenToday,
    streak,
    interactions
  } = useDashboardData();

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <InteractionAlertCard interactions={interactions} />
        <UserProfileCard 
          userProfile={userProfile} 
          user={user} 
          streak={streak} 
        />

        <InteractiveMedicationList
          currentMedications={currentMedications}
          updateMedicationStatus={updateMedicationStatus}
          isMedicationTakenToday={isMedicationTakenToday}
          timeOfDay={timeOfDay}
        />

        {medications.length === 0 && <EmptyMedicationsCard />}

        <QuickAccessGrid />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
