import { vi } from 'vitest';
import { identifyPillFromImage } from './pillIdentificationService';

// Mock the global fetch API
global.fetch = vi.fn();

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock supabase for logging
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({ error: null }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));


describe('pillIdentificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set a mock API key
    import.meta.env.VITE_GOOGLE_VISION_API_KEY = 'test-api-key';
  });

  describe('identifyPillFromImage', () => {
    it('should call the textSearcher with extracted text from Google Vision API', async () => {
      const mockTextSearcher = vi.fn().mockResolvedValue([]);
      const mockFile = new File(['dummy content'], 'pill.jpg', { type: 'image/jpeg' });
      const mockExtractedText = 'L484';

      const mockVisionApiResponse = {
        responses: [
          {
            fullTextAnnotation: {
              text: mockExtractedText,
            },
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVisionApiResponse),
      });

      await identifyPillFromImage(mockFile, mockTextSearcher);

      // Check if fetch was called correctly for Google Vision API
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://vision.googleapis.com/v1/images:annotate'),
        expect.any(Object)
      );

      // Check if the injected textSearcher function was called with the correct text
      expect(mockTextSearcher).toHaveBeenCalledWith(mockExtractedText.replace(/\\n/g, " "));
    });

    it('should return an empty array and not call textSearcher if no text is found', async () => {
      const mockTextSearcher = vi.fn();
      const mockFile = new File(['dummy content'], 'pill.jpg', { type: 'image/jpeg' });

      const mockVisionApiResponse = {
        responses: [
          {
            fullTextAnnotation: null, // No text found
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockVisionApiResponse),
      });

      const result = await identifyPillFromImage(mockFile, mockTextSearcher);

      expect(mockTextSearcher).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
