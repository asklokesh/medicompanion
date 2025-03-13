
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Create event listener for subsequent changes
    const listener = () => setMatches(media.matches);
    
    // Add the listener to begin watching for changes
    media.addEventListener("change", listener);
    
    // Clean up function
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  
  return matches;
}
