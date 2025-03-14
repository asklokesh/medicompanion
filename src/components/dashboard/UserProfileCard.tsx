
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DearOne {
  id: string;
  name: string;
  relation: string;
  image_url?: string;
}

interface UserProfileCardProps {
  userProfile: any;
  user: any;
  streak: number;
}

export function UserProfileCard({ userProfile, user, streak }: UserProfileCardProps) {
  const navigate = useNavigate();
  const dearOnes: DearOne[] = userProfile?.dear_ones || [];
  
  const handleEditDearOnes = () => {
    navigate("/profile#dear-ones");
  };

  // Generate the display message for dear ones
  const getDearOnesMessage = () => {
    if (dearOnes.length === 0) {
      return "Add your loved ones";
    }
    
    if (dearOnes.length === 1) {
      return `For ${dearOnes[0].name}`;
    }
    
    if (dearOnes.length === 2) {
      return `For ${dearOnes[0].name} & ${dearOnes[1].name}`;
    }
    
    const allButLast = dearOnes.slice(0, -1).map(person => person.name).join(', ');
    const last = dearOnes[dearOnes.length - 1].name;
    return `For ${allButLast} & ${last}`;
  };

  // Get random dear one photo
  const getRandomDearOnePhoto = () => {
    const dearOnesWithPhotos = dearOnes.filter(person => person.image_url);
    if (dearOnesWithPhotos.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * dearOnesWithPhotos.length);
    return dearOnesWithPhotos[randomIndex];
  };

  const randomDearOne = getRandomDearOnePhoto();

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex-shrink-0 overflow-hidden shadow-lg">
            {userProfile?.avatar_url ? (
              <img 
                src={userProfile.avatar_url} 
                alt={userProfile.full_name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-br from-primary-400 to-primary-600">
                {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
            <div className="absolute inset-0 rounded-full ring-2 ring-white/50"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hello, {userProfile?.full_name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{streak} day streak</h3>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-white/90 mr-2 font-medium">{getDearOnesMessage()}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10 rounded-full"
                onClick={handleEditDearOnes}
              >
                {dearOnes.length === 0 ? <PlusCircle size={18} /> : <Edit size={18} />}
              </Button>
            </div>
          </div>
          
          {randomDearOne && (
            <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                  <AvatarImage src={randomDearOne.image_url} alt={randomDearOne.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary-300 to-primary-400 text-white">
                    {randomDearOne.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-base text-white/95 font-medium">
                  Remember to stay healthy for {randomDearOne.name} today!
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
