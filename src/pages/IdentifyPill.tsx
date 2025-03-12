
import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Camera, Search, PlusCircle, Info, FileText, Check, AlertTriangle, HelpCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { searchPillsByText, identifyPillFromImage, type PillMatch } from "@/services/pillIdentificationService";

const IdentifyPill = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [colorTheme] = useState('blue');
  const [matchingPills, setMatchingPills] = useState<PillMatch[]>([]);
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, name: "Round white pill with L484", date: "Mar 9", result: "Acetaminophen 500mg" },
    { id: 2, name: "Oval blue pill with 10mg", date: "Feb 28", result: "Lexapro 10mg" }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Theme colors
  const themes = {
    blue: {
      primary: 'from-blue-500 to-indigo-600',
      accent: 'from-indigo-500 to-purple-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      highlight: 'bg-blue-50',
      active: 'text-blue-800',
      border: 'border-blue-200'
    },
    teal: {
      primary: 'from-teal-500 to-green-600',
      accent: 'from-emerald-500 to-teal-600',
      button: 'bg-teal-600 hover:bg-teal-700',
      badge: 'bg-teal-100 text-teal-800',
      highlight: 'bg-teal-50',
      active: 'text-teal-800',
      border: 'border-teal-200'
    },
    purple: {
      primary: 'from-purple-500 to-pink-600',
      accent: 'from-fuchsia-500 to-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
      badge: 'bg-purple-100 text-purple-800',
      highlight: 'bg-purple-50',
      active: 'text-purple-800',
      border: 'border-purple-200'
    },
    orange: {
      primary: 'from-orange-500 to-amber-600',
      accent: 'from-amber-500 to-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
      badge: 'bg-orange-100 text-orange-800',
      highlight: 'bg-orange-50',
      active: 'text-orange-800',
      border: 'border-orange-200'
    }
  };
  
  const theme = themes[colorTheme];

  const handleStartScan = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFile = files[0];
    setIsScanning(true);
    setMatchingPills([]);
    
    try {
      // Process the image and get possible matches
      const results = await identifyPillFromImage(imageFile);
      setMatchingPills(results);
      
      // Add to recent searches
      if (results.length > 0) {
        const newSearch = {
          id: Date.now(),
          name: "Photo of pill",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          result: results[0].name
        };
        setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
        
        toast({
          title: "Pill Identified",
          description: `Found ${results.length} potential matches.`,
        });
      } else {
        toast({
          title: "No Matches Found",
          description: "Unable to identify the pill from this image. Try another angle or search by text.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setMatchingPills([]);
    
    try {
      console.log("Searching for:", searchQuery);
      // Search for pills based on text query
      const results = await searchPillsByText(searchQuery);
      console.log("Search results:", results);
      setMatchingPills(results);
      
      // Add to recent searches
      if (results.length > 0) {
        const newSearch = {
          id: Date.now(),
          name: searchQuery,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          result: results[0].name
        };
        setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);
        
        toast({
          title: "Search Complete",
          description: `Found ${results.length} potential matches.`,
        });
      } else {
        toast({
          title: "No Matches Found",
          description: "No pills match your search criteria. Try different terms.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to complete your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    toast({
      title: "History Cleared",
      description: "Your search history has been cleared.",
    });
  };

  const handleSelectPill = (pill: PillMatch) => {
    toast({
      title: "Pill Selected",
      description: `You've identified this pill as ${pill.name}.`,
    });
    // In a real app, this would save the selection to the user's medications or show more details
  };

  const handleSearchFromHistory = (search: any) => {
    setSearchQuery(search.name);
    searchPillsByText(search.name).then(results => {
      setMatchingPills(results);
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header section */}
        <div className={`-mx-6 -mt-6 px-6 pt-6 pb-10 bg-gradient-to-r ${theme.primary} text-white rounded-b-3xl`}>
          <h1 className="text-3xl font-bold mb-2">Identify Pills</h1>
          <p className="text-white text-opacity-90">
            Take a photo or enter details to identify your medications
          </p>
          
          {/* Search / Scan Section */}
          <div className="mt-6 flex flex-col space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Describe pill color, shape, or markings..."
                className="pl-10 bg-white border-0 h-12 shadow-md rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className={`absolute right-1 top-1 h-10 rounded-lg ${theme.button}`}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Searching
                  </>
                ) : "Search"}
              </Button>
            </form>
            
            <Button
              onClick={handleStartScan}
              className="bg-white text-indigo-700 hover:bg-white/90 border-2 border-white h-12 rounded-xl shadow-md flex items-center justify-center"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Scanning...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" /> Take Photo of Pill
                </>
              )}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-6">
          {/* Possible matches section */}
          <Card className="border-0 rounded-3xl shadow-md overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.accent} px-5 py-3`}>
              <h2 className="text-xl font-bold text-white flex items-center">
                <Search className="h-5 w-5 mr-2" /> Possible Matches
              </h2>
            </div>
            <CardContent className="p-0">
              {isSearching || isScanning ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-lg text-gray-600">
                    {isScanning ? "Analyzing pill image..." : "Searching medication database..."}
                  </p>
                </div>
              ) : matchingPills.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {matchingPills.map(pill => (
                    <div key={pill.id} className="p-4">
                      <div className="flex items-start">
                        <div className={`w-14 h-14 rounded-full ${pill.imageColor || 'bg-gray-100'} flex items-center justify-center mr-4 flex-shrink-0`}>
                          <span className="text-3xl">💊</span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold">{pill.name}</h3>
                          <p className="text-gray-600 text-sm">{pill.appearance}</p>
                          <div className="flex items-center mt-2">
                            <span className={`${theme.badge} px-3 py-1 rounded-full text-xs`}>
                              {pill.purpose}
                            </span>
                            {pill.manufacturer && (
                              <span className="ml-2 text-xs text-gray-500">
                                By {pill.manufacturer}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between mt-3">
                            <Button variant="ghost" size="sm" className="text-blue-600 flex items-center">
                              <Info className="h-4 w-4 mr-1" /> More Details
                            </Button>
                            <Button 
                              className={`${theme.button} text-white rounded-lg`} 
                              size="sm"
                              onClick={() => handleSelectPill(pill)}
                            >
                              <Check className="h-4 w-4 mr-1" /> This is My Pill
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <Search className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">No Pills Found</h3>
                  <p className="text-gray-500 mt-1 max-w-xs">
                    Search for a pill by entering its details or taking a photo
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Don't see your medication?</span>
                <Button variant="outline" size="sm" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Manually
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent searches */}
          <Card className="border-0 rounded-3xl shadow-md overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Recent Searches</h2>
              {recentSearches.length > 0 && (
                <Button variant="ghost" size="sm" className="text-blue-600" onClick={handleClearRecent}>Clear All</Button>
              )}
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentSearches.map(search => (
                  <div key={search.id} className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{search.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-2">{search.date}</span>
                        <span className={`${theme.badge} px-2 py-0.5 rounded-full text-xs font-medium`}>
                          {search.result}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => handleSearchFromHistory(search)}
                    >
                      <Search className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {recentSearches.length === 0 && (
                <div className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700">No recent searches</h3>
                  <p className="text-gray-500 mt-1">Your search history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Safety notice */}
          <Card className="border-0 rounded-3xl shadow-md overflow-hidden">
            <CardContent className="p-4">
              <div className="flex">
                <div className="bg-yellow-100 p-3 rounded-xl flex items-center justify-center mr-4">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold">Safety Information</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This tool provides an identification aid but is not a substitute for professional medical advice.
                    Always consult your healthcare provider to confirm medication identity.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center border-t border-gray-100 pt-3">
                <span className="text-sm font-medium">Don't show again</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          {/* Resources */}
          <Card className="border-0 rounded-3xl shadow-md overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-lg font-bold">Helpful Resources</h2>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                  <FileText className="h-5 w-5 mr-3 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Medication Safety Guide</h3>
                    <p className="text-xs text-gray-500">Tips for safely managing your medications</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3 px-4">
                  <HelpCircle className="h-5 w-5 mr-3 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Contact Pharmacy</h3>
                    <p className="text-xs text-gray-500">Ask your pharmacist about your medications</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IdentifyPill;
