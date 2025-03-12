import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Types for pill data
export interface PillMatch {
  id: string;
  name: string;
  appearance: string;
  purpose: string;
  imageUrl?: string;
  ndc?: string;
  ingredients?: string[];
  manufacturer?: string;
  imageColor?: string; // For UI display
  rxcui?: string;
}

/**
 * Search pills by name, markings, or physical characteristics
 */
export async function searchPillsByText(searchQuery: string): Promise<PillMatch[]> {
  if (!searchQuery.trim()) {
    return [];
  }
  
  try {
    console.log(`Searching for pills with query: ${searchQuery}`);
    
    // RxNorm API (part of NLM/NIH) for medication information
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(searchQuery)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from RxNav API');
    }
    
    const data = await response.json();
    
    // Parse the response into our PillMatch format
    const conceptGroups = data.drugGroup?.conceptGroup || [];
    let results: PillMatch[] = [];
    
    // Process and extract medication information
    for (const group of conceptGroups) {
      if (group.conceptProperties) {
        for (const prop of group.conceptProperties) {
          results.push({
            id: prop.rxcui || `pill-${results.length + 1}`,
            name: prop.name || 'Unknown Medication',
            appearance: prop.synonym?.[0] || 'Information not available',
            purpose: group.tty || 'Medication',
            rxcui: prop.rxcui,
            // Assign a random color for UI display (in a real app, this would be based on actual pill color)
            imageColor: getRandomPillColor()
          });
        }
      }
    }
    
    // If we don't get results from RxNav or get fewer than 3, add fallback data
    if (results.length < 3) {
      const fallbackResults = getFallbackResults(searchQuery);
      results = [...results, ...fallbackResults].slice(0, 5);
    }
    
    // Log activity to Supabase if connected
    try {
      await logActivity('pill_search', searchQuery, results.length > 0);
    } catch (e) {
      console.error("Failed to log search activity:", e);
      // Non-critical error, don't block the search results
    }
    
    return results;
  } catch (error) {
    console.error("Error searching pills:", error);
    toast({
      title: "Search Error",
      description: "Unable to search for medications. Please try again later.",
      variant: "destructive"
    });
    return getFallbackResults(searchQuery);
  }
}

/**
 * Process and analyze a pill image to identify potential matches
 * In a production app, this would connect to a machine learning service or specialized API
 */
export async function identifyPillFromImage(imageFile: File): Promise<PillMatch[]> {
  try {
    console.log("Processing pill image for identification");
    
    // In a real implementation, we would upload the image to a service like
    // NIH Pill Image Recognition, Google Vision API, or a specialized pill identification API
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, return fallback/demo data
    // This simulates what we'd get back from an actual image recognition API
    const mockResults: PillMatch[] = [
      {
        id: "image-pill-1",
        name: "Lisinopril 10mg",
        appearance: "Round white tablet with 'L10' imprint",
        purpose: "Blood pressure medication (ACE inhibitor)",
        imageColor: "bg-blue-100",
        manufacturer: "Major Pharmaceuticals"
      },
      {
        id: "image-pill-2",
        name: "Atorvastatin 20mg",
        appearance: "Oval white tablet with 'PD 157' imprint",
        purpose: "Cholesterol medication (Statin)",
        imageColor: "bg-green-100",
        manufacturer: "Pfizer"
      },
      {
        id: "image-pill-3",
        name: "Metformin 500mg",
        appearance: "Round white tablet with '500' on one side",
        purpose: "Diabetes medication",
        imageColor: "bg-orange-100",
        manufacturer: "Amneal Pharmaceuticals"
      }
    ];
    
    // Log activity to Supabase if connected
    try {
      await logActivity('pill_image_search');
    } catch (e) {
      console.error("Failed to log image search activity:", e);
    }
    
    return mockResults;
  } catch (error) {
    console.error("Error processing pill image:", error);
    toast({
      title: "Image Processing Error",
      description: "Unable to identify the pill from the image. Please try searching by text instead.",
      variant: "destructive"
    });
    return [];
  }
}

// Define the type for activity data to match Supabase function parameters
type ActivityData = {
  activity_type: string;
  user_id?: string;
  query?: string;
  found_results?: boolean;
  timestamp_param?: string;
};

// Helper function to log any pill-related activity
async function logActivity(activityType: string, query?: string, foundResults?: boolean) {
  try {
    const user = supabase.auth.getUser();
    
    // Create the activity data object with the correct type
    const activityData: ActivityData = {
      activity_type: activityType,
      timestamp_param: new Date().toISOString()
    };
    
    // Only add optional properties if they're provided
    const { data: userData } = await user;
    if (userData?.user?.id) {
      activityData.user_id = userData.user.id;
    }
    
    if (query !== undefined) {
      activityData.query = query;
    }
    
    if (foundResults !== undefined) {
      activityData.found_results = foundResults;
    }
    
    // Call the stored procedure with our typed parameters
    const { error } = await supabase.rpc('insert_user_activity', activityData);
    
    if (error) {
      console.error("Error logging activity:", error);
    }
  } catch (e) {
    console.error("Error in logActivity:", e);
  }
}

// Generate a random color for pill display
function getRandomPillColor(): string {
  const colors = [
    "bg-blue-100", "bg-green-100", "bg-yellow-100", 
    "bg-red-100", "bg-pink-100", "bg-purple-100",
    "bg-indigo-100", "bg-orange-100"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Fallback data when API fails or returns no results
function getFallbackResults(query: string): PillMatch[] {
  return [
    {
      id: "fallback-1",
      name: "Lisinopril 10mg",
      appearance: "Round white tablet, scored on one side, imprinted with 'M L10'",
      purpose: "Blood pressure medication",
      imageColor: "bg-blue-100"
    },
    {
      id: "fallback-2",
      name: "Metformin 500mg",
      appearance: "Oval white tablet, imprinted with '500' on one side",
      purpose: "Diabetes medication",
      imageColor: "bg-green-100"
    },
    {
      id: "fallback-3",
      name: "Simvastatin 20mg",
      appearance: "Oval peach-colored tablet, scored on one side, imprinted with 'MERCK 740'",
      purpose: "Cholesterol medication",
      imageColor: "bg-orange-100"
    }
  ].filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.appearance.toLowerCase().includes(query.toLowerCase()) ||
    p.purpose.toLowerCase().includes(query.toLowerCase())
  );
}
