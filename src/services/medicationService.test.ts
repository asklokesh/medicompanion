import { vi } from 'vitest';
import { getMedicationInteractions } from './medicationService';

// Mock the global fetch API
global.fetch = vi.fn();

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('medicationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set a mock API key
    import.meta.env.VITE_DRUGBANK_API_KEY = 'test-api-key';
  });

  describe('getMedicationInteractions', () => {
    it('should call the DrugBank API and return interaction data', async () => {
      const mockRxcuis = ['123', '456'];
      const mockInteractionData = {
        interactions: [
          {
            severity: 'major',
            description: 'A major interaction can occur.',
            drug_1: { name: 'Drug A' },
            drug_2: { name: 'Drug B' },
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockInteractionData),
      });

      const interactions = await getMedicationInteractions(mockRxcuis);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.drugbank.com/v1/us/ddi?rxcui=123,456'),
        expect.any(Object)
      );

      expect(interactions).toEqual(mockInteractionData.interactions);
    });

    it('should return an empty array if there are less than 2 drugs', async () => {
      const mockRxcuis = ['123'];
      const interactions = await getMedicationInteractions(mockRxcuis);
      expect(fetch).not.toHaveBeenCalled();
      expect(interactions).toEqual([]);
    });

    it('should return an empty array if the API call fails', async () => {
      const mockRxcuis = ['123', '456'];
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'API Error' }),
        status: 500,
      });

      const interactions = await getMedicationInteractions(mockRxcuis);
      expect(interactions).toEqual([]);
    });
  });
});
