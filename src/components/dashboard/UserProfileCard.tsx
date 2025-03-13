
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface UserProfileCardProps {
  userProfile: any;
  user: any;
  streak: number;
}

export function UserProfileCard({ userProfile, user, streak }: UserProfileCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex-shrink-0 border-2 border-primary overflow-hidden">
            {userProfile?.avatar_url ? (
              <img 
                src={userProfile.avatar_url} 
                alt={userProfile.full_name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {userProfile?.full_name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-xl text-gray-600">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-primary/90 text-white rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h3 className="text-xl font-bold">{streak} day streak</h3>
            </div>
          </div>
          <div>
            <p className="text-white/90">For Emily & the grandkids</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
