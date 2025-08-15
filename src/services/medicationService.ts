import { toast } from "@/hooks/use-toast";

export interface Interaction {
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  drug_1: {
    name: string;
  };
  drug_2: {
    name: string;
  };
}

/**
 * Fetches drug-drug interactions for a given list of RxCUIs from the DrugBank API.
 * @param rxcuis - An array of RxNorm Concept Unique Identifiers (RxCUIs).
 * @returns A promise that resolves to an array of interaction objects.
 */
export async function getMedicationInteractions(rxcuis: string[]): Promise<Interaction[]> {
  if (rxcuis.length < 2) {
    // Need at least two drugs to check for interactions
    return [];
  }

  const apiKey = import.meta.env.VITE_DRUGBANK_API_KEY;
  if (!apiKey) {
    console.error("DrugBank API key is missing.");
    // Do not show a toast for this, as it's a configuration issue.
    // Silently fail or return mock data for development.
    return [];
  }

  const rxcuiString = rxcuis.join(',');
  const apiUrl = `https://api.drugbank.com/v1/us/ddi?rxcui=${rxcuiString}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DrugBank API error:", errorData);
      throw new Error(`DrugBank API responded with status ${response.status}`);
    }

    const data = await response.json();

    // The API response is expected to be an array of interaction objects.
    // We will assume the response structure matches our Interaction interface.
    // In a real app, you would add more robust validation here (e.g., with Zod).
    return data.interactions || [];

  } catch (error) {
    console.error("Failed to fetch medication interactions:", error);
    toast({
      title: "Interaction Check Failed",
      description: "Could not check for medication interactions at this time. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
}
