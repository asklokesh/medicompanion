
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { CurrentMedicationsCard } from "@/components/dashboard/CurrentMedicationsCard";
import { EmptyMedicationsCard } from "@/components/dashboard/EmptyMedicationsCard";
import { QuickAccessGrid } from "@/components/dashboard/QuickAccessGrid";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";

const Dashboard = () => {
  const { user } = useAuth();

  const {
    userProfile,
    medications,
    currentMedications,
    loading,
    timeOfDay,
    markMedicationsTaken,
    isCurrentMedicationTaken,
    allCurrentMedicationsTaken,
    streak
  } = useDashboardData();

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <UserProfileCard 
          userProfile={userProfile} 
          user={user} 
          streak={streak} 
        />

        <CurrentMedicationsCard 
          currentMedications={currentMedications}
          isCurrentMedicationTaken={isCurrentMedicationTaken}
          allCurrentMedicationsTaken={allCurrentMedicationsTaken}
          timeOfDay={timeOfDay}
          markMedicationsTaken={markMedicationsTaken}
        />

        {medications.length === 0 && <EmptyMedicationsCard />}

        <QuickAccessGrid />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
