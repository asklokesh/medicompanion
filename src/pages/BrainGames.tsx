
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Star, ExternalLink, Trophy, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const BrainGames = () => {
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if user is on Android or iOS
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/i.test(userAgent));
    setIsIOS(/iphone|ipad|ipod/i.test(userAgent));
  }, []);

  const appLink = isAndroid 
    ? "https://play.google.com/store/apps/details?id=com.tellmewow.senior.memory"
    : "https://apps.apple.com/us/app/train-your-brain-memory/id1415728029";

  const handleAppClick = () => {
    window.open(appLink, '_blank');
    toast.success("Opening app store...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brain Games</h1>
            <p className="text-gray-500 mt-2">Keep your mind sharp with daily memory exercises</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="font-medium">Your Score: 1250</span>
          </div>
        </div>
        
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
                <img
                  src="https://play-lh.googleusercontent.com/k6nLeD6YfXrGyKcyYzBDZJJ-7_X2M8vA3NX5g5YNv0c6PJ5in-ueRDDM9R_NLqRJoQ=w240-h480-rw"
                  alt="Train Your Brain: Memory"
                  className="w-40 h-40 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJyYWluIj48cGF0aCBkPSJNMTkuMjIgMTIuOTRhNiA2IDAgMCAwLTkuNC02LjcyIi8+PHBhdGggZD0iTTcuNzYgMTUuMjdhMy42IDMuNiAwIDAxLTIuNjgtLjQuODguODggMCAwMS0uMzctLjg3bC41LTMuMzlhMS41NiAxLjU2IDAgMDAtLjA5LS43MSAxLjU5IDEuNTkgMCAwMC0uNTctLjcxIDEuNTUgMS41NSAwIDAxLS41Mi0xLjY3QTMuNjQgMy42NCAwIDAxNi43OCA1LjQzYTEuNTUgMS41NSAwIDAxMS42OC0uMjlBMy43NCAzLjc0IDAgMDExMi4yIDQuNWExLjU2IDEuNTYgMCAwMTEuMDYgMS4zOGwuMjcgMi44OGExLjQxIDEuNDEgMCAwMDIuODItLjMxbC0uMjctMy4zM0ExLjU1IDEuNTUgMCAwMTE3IDMuMDFhMy43MyAzLjczIDAgMDEzIDIuMiAxLjU2IDEuNTYgMCAwMS0uMzUgMS43M2wtLjQ5LjVjLS4yOS4zLS4zOC43NC0uMiAxLjEyLjEzLjM5LjQ2LjY1Ljg2LjcybDIuMTUuMzZjLjI0LjA0LjUuMTIuNzIuMjRhMS41OSAxLjU5IDAgMDEuNi43MyAxLjU1IDEuNTUgMCAwMS0uMzMgMS43QTMuNzYgMy43NiAwIDAxMjAgMTVhMS41NiAxLjU2IDAgMDEtMS45NS44bC0yLjUtMS4yNWMtLjM1LS4xNy0uNzMtLjEzLTEuMDcuMWEuOTQuOTQgMCAwMC0uNC43N2wzLjUxIDMuNSIvPjxwYXRoIGQ9Ik02LjMgMTAuOSAzLjA0IDguODZhMy42IDMuNiAwIDAxLTEuMzgtNC4wMkEzLjcgMy43IDAgMDE2LjI0IDNhMy42IDMuNiAwIDAxMi43IDEuMjFsMi40MSAyLjQiLz48cGF0aCBkPSJNMTEuMzUgMTguMiAxMyAxNS45YTEuMjUgMS4yNSAwIDAgMC0uMjctMS43OCAzLjQ0IDMuNDQgMCAwIDAtMy0uNCAzLjQgMy40IDAgMDAtLjY0LjM0Yy0uNzMuNTMtLjUyIDEuNzMtLjUyIDIuNDMgMCAxLjQzLS4yOCAyLjY1LTEuMjggMy43MS0uNTYuNi0xLjEuNjYtMS44Ny42NnE2LjM2LjI3IDguODIgMy45NSIvPjxwYXRoIGQ9Ik02IDhsNC0xIi8+PHBhdGggZD0iTTkgMTJsLTEgNSIvPjxwYXRoIGQ9Ik0xNyA2bC0yIDMiLz48L3N2Zz4=";
                  }}
                />
              </div>
            </div>
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold mb-2">Train Your Brain: Memory</h2>
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">4.8 (10,000+ reviews)</span>
              </div>
              
              <p className="mb-4 text-gray-700">
                Train Your Brain: Memory is the perfect brain training app designed specifically for seniors. It offers a variety of memory exercises that help improve cognitive function and prevent memory decline.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-1 mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                  <p className="text-gray-700">Daily exercises to strengthen your memory</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-1 mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                  <p className="text-gray-700">Adapts to your skill level as you improve</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-100 rounded-full p-1 mr-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                  <p className="text-gray-700">Track your progress with detailed statistics</p>
                </div>
              </div>
              
              <Button 
                onClick={handleAppClick}
                className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Download className="mr-2 h-4 w-4" />
                {isAndroid ? "Get it on Google Play" : isIOS ? "Download on App Store" : "Download App"}
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-sm mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Benefits of Brain Training</h2>
              <p className="text-gray-600 mt-1">Studies show regular brain exercises can help maintain cognitive abilities and improve memory</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              onClick={handleAppClick}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> 
              Open Memory Training App
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrainGames;
