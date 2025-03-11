
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Trophy, Star, Clock, ArrowRight, Sparkles } from "lucide-react";

const BrainGames = () => {
  const games = [
    {
      id: 1,
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards",
      icon: <Brain className="h-8 w-8 text-primary" />,
      level: "Beginner",
      time: "5 min"
    },
    {
      id: 2,
      title: "Word Scramble",
      description: "Unscramble letters to form meaningful words",
      icon: <Sparkles className="h-8 w-8 text-accent" />,
      level: "Intermediate",
      time: "10 min"
    },
    {
      id: 3,
      title: "Number Sequence",
      description: "Remember and repeat sequences of numbers",
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      level: "Advanced",
      time: "15 min"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brain Games</h1>
            <p className="text-gray-500 mt-2">Keep your mind sharp with these fun cognitive exercises</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="font-medium">Your Score: 1250</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {game.icon}
                  <div className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                    {game.level}
                  </div>
                </div>
                <CardTitle className="text-xl mt-2">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{game.time}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Play Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Challenge Yourself Daily</h2>
              <p className="text-gray-600 mt-1">Regular brain exercises can improve cognitive function and memory</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Star className="mr-2 h-4 w-4" /> Daily Challenge
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrainGames;
