
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
  splId?: string; // SPL ID from FDA/Pillbox
  source?: string; // Which API provided this result
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
    
    // Try multiple API endpoints for more comprehensive results
    const results = await Promise.allSettled([
      searchRxNavAPI(searchQuery),
      searchPillboxAPI(searchQuery),
      // In a real app, you might add other API calls here
      // searchFDAAPI(searchQuery),
    ]);
    
    // Process results from settled promises (some might have rejected)
    let combinedResults: PillMatch[] = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        combinedResults = [...combinedResults, ...result.value];
      }
    });
    
    // Remove duplicates based on rxcui or splId
    const uniqueResults = combinedResults.reduce((acc, current) => {
      // Check if we already have this pill by any ID
      const existingItem = acc.find(item => 
        (item.rxcui && item.rxcui === current.rxcui) || 
        (item.splId && item.splId === current.splId) ||
        (item.name && item.name === current.name)
      );
      
      if (!existingItem) {
        acc.push(current);
      }
      return acc;
    }, [] as PillMatch[]);
    
    console.log(`Found ${uniqueResults.length} unique results from APIs`);
    
    // If we don't get enough results, add fallback data
    if (uniqueResults.length < 3) {
      console.log('Using fallback results due to insufficient API results');
      const fallbackResults = getFallbackResults(searchQuery);
      
      // Combine API results with fallbacks, prioritizing API results
      const finalResults = [...uniqueResults, ...fallbackResults].slice(0, 5);
      console.log(`Returning ${finalResults.length} final results`);
      
      // Log activity to Supabase if connected
      try {
        await logActivity('pill_search', searchQuery, finalResults.length > 0);
      } catch (e) {
        console.error("Failed to log search activity:", e);
        // Non-critical error, don't block the search results
      }
      
      return finalResults;
    }
    
    // If we have enough results from the API
    // Log activity to Supabase if connected
    try {
      await logActivity('pill_search', searchQuery, uniqueResults.length > 0);
    } catch (e) {
      console.error("Failed to log search activity:", e);
      // Non-critical error, don't block the search results
    }
    
    return uniqueResults.slice(0, 5); // Limit to 5 results for UI
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
 * Search the Pillbox API for medications
 * Based on HHS Pillbox API: https://github.com/HHS/pillbox_docs/wiki/Pillbox-API-documentation
 */
async function searchPillboxAPI(searchQuery: string): Promise<PillMatch[]> {
  try {
    // The URL prefix for the Pillbox API
    // Note: This is a placeholder since the direct Pillbox API is deprecated
    // In a production app, you would use the official FDA API endpoint
    // It may also be necessary to register for an API key
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(searchQuery)}&limit=5`
    );
    
    if (!response.ok) {
      console.error('FDA API error:', response.statusText);
      throw new Error('Failed to fetch from FDA API');
    }
    
    const data = await response.json();
    console.log('FDA API response:', data);
    
    // Check if we have valid data
    if (!data.results || !Array.isArray(data.results)) {
      console.log('No valid data in FDA response');
      return [];
    }
    
    // Parse the response into our PillMatch format
    const results: PillMatch[] = data.results.map((item: any, index: number) => {
      // Extract useful information from the FDA response
      const brandName = item.openfda?.brand_name?.[0] || 'Unknown Brand';
      const genericName = item.openfda?.generic_name?.[0] || 'Unknown Generic';
      const manufacturer = item.openfda?.manufacturer_name?.[0] || 'Unknown Manufacturer';
      const splId = item.openfda?.spl_id?.[0];
      
      return {
        id: splId || `fda-${index}`,
        name: `${brandName} (${genericName})`,
        appearance: item.description?.[0] || 'Information not available',
        purpose: item.purpose?.[0] || item.indications_and_usage?.[0] || 'Medication',
        manufacturer,
        splId,
        imageColor: getRandomPillColor(),
        source: 'FDA'
      };
    });
    
    console.log(`FDA API returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error("Error with FDA/Pillbox API:", error);
    return []; // Return empty array for this API, other APIs or fallbacks may still work
  }
}

/**
 * Search the RxNav API for medications
 */
async function searchRxNavAPI(searchQuery: string): Promise<PillMatch[]> {
  try {
    // RxNorm API (part of NLM/NIH) for medication information
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(searchQuery)}`
    );
    
    if (!response.ok) {
      console.error('RxNav API error:', response.statusText);
      throw new Error('Failed to fetch from RxNav API');
    }
    
    const data = await response.json();
    console.log('RxNav API response:', data);
    
    // Check if we have valid data
    if (!data.drugGroup || !data.drugGroup.conceptGroup) {
      console.log('No valid data in RxNav response');
      return [];
    }
    
    // Parse the response into our PillMatch format
    const conceptGroups = data.drugGroup.conceptGroup || [];
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
            // Assign a color for UI display (in a real app, would be based on actual pill color)
            imageColor: getRandomPillColor(),
            source: 'RxNav'
          });
        }
      }
    }
    
    console.log(`RxNav API returned ${results.length} results`);
    return results;
  } catch (error) {
    console.error("Error with RxNav API:", error);
    return []; // Return empty array for this API, other APIs or fallbacks may still work
  }
}

/**
 * Converts an image file to a base64 encoded string.
 */
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Result is in the format "data:image/jpeg;base64,LzlqLzRBQ...".
      // We only need the part after the comma.
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Process and analyze a pill image to identify potential matches
 * using Google Vision API for OCR and then our existing text search.
 */
export async function identifyPillFromImage(
  imageFile: File,
  textSearcher: (query: string) => Promise<PillMatch[]>
): Promise<PillMatch[]> {
  console.log("Processing pill image for identification via Google Vision API...");
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    console.error("Google Vision API key is missing.");
    toast({
      title: "Configuration Error",
      description: "Image recognition service is not configured. Please contact support.",
      variant: "destructive"
    });
    return getFallbackResults("demo");
  }

  try {
    const base64Image = await toBase64(imageFile);

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Google Vision API error:", errorBody);
      throw new Error("Failed to call Google Vision API.");
    }

    const data = await response.json();
    const textAnnotation = data.responses?.[0]?.fullTextAnnotation;

    if (textAnnotation && textAnnotation.text) {
      const extractedText = textAnnotation.text.replace(/\n/g, " ");
      console.log(`Extracted text from image: "${extractedText}"`);
      toast({
        title: "Text Recognized",
        description: `Found text: "${extractedText}". Now searching for matching pills.`,
      });
      // Use the injected text searcher function
      return textSearcher(extractedText);
    } else {
      console.log("No text found in the image.");
      toast({
        title: "No Text Found",
        description: "Could not read any text from the image. Please try a clearer picture or search manually.",
      });
      return [];
    }
  } catch (error) {
    console.error("Error processing pill image:", error);
    toast({
      title: "Image Processing Error",
      description: "An error occurred while analyzing the image. Please try again.",
      variant: "destructive"
    });
    return [];
  } finally {
    try {
      await logActivity('pill_image_search');
    } catch (e) {
      console.error("Failed to log image search activity:", e);
    }
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
    const { data: userData } = await supabase.auth.getUser();
    
    // Create the activity data object with the correct type
    const activityData: ActivityData = {
      activity_type: activityType,
      timestamp_param: new Date().toISOString()
    };
    
    // Only add optional properties if they're provided
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
    "bg-amber-100", "bg-yellow-100", "bg-orange-100", 
    "bg-red-100", "bg-rose-100", "bg-brown-100"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Fallback data when API fails or returns no results
function getFallbackResults(query: string): PillMatch[] {
  const commonMeds = [
    {
      id: "fallback-1",
      name: "Lisinopril 10mg",
      appearance: "Round white tablet, scored on one side, imprinted with 'M L10'",
      purpose: "Blood pressure medication",
      imageColor: "bg-orange-100",
      source: "Fallback Database"
    },
    {
      id: "fallback-2",
      name: "Metformin 500mg",
      appearance: "Oval white tablet, imprinted with '500' on one side",
      purpose: "Diabetes medication",
      imageColor: "bg-amber-100",
      source: "Fallback Database"
    },
    {
      id: "fallback-3",
      name: "Simvastatin 20mg",
      appearance: "Oval peach-colored tablet, scored on one side, imprinted with 'MERCK 740'",
      purpose: "Cholesterol medication",
      imageColor: "bg-yellow-100",
      source: "Fallback Database"
    },
    {
      id: "fallback-4",
      name: "Amlodipine 5mg",
      appearance: "White round tablet, imprinted with 'A5' on one side",
      purpose: "Blood pressure medication",
      imageColor: "bg-red-100",
      source: "Fallback Database"
    },
    {
      id: "fallback-5",
      name: "Atorvastatin 20mg",
      appearance: "Oval white tablet, imprinted with 'ATV 20'",
      purpose: "Cholesterol medication",
      imageColor: "bg-rose-100",
      source: "Fallback Database"
    },
    {
      id: "fallback-6",
      name: "Levothyroxine 50mcg",
      appearance: "Round blue tablet, imprinted with 'L50'",
      purpose: "Thyroid medication",
      imageColor: "bg-amber-100",
      source: "Fallback Database"
    }
  ];
  
  // Filter based on search query if provided
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    return commonMeds.filter(med => 
      med.name.toLowerCase().includes(lowercaseQuery) || 
      med.appearance.toLowerCase().includes(lowercaseQuery) ||
      med.purpose.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Return all if no query or no matches
  return commonMeds;
}
