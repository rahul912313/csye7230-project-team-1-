const ChatbotService = require('../services/chatbotService');
const axios = require('axios');

/**
 * Test Suite for ChatbotService
 * Tests the AI chatbot service including:
 * - Predefined fallback responses for common queries
 * - Contextual fallback when AI API fails
 * - Hugging Face API integration
 * - Graceful error handling
 *
 * QuickRent Vehicle Rental Platform
 */

jest.mock('axios');

describe('ChatbotService', () => {
  let chatbotService;

  beforeEach(() => {
    chatbotService = new ChatbotService();
    jest.clearAllMocks();
    process.env.HUGGINGFACE_API_KEY = 'test_api_key';
  });

  // ─── getFallbackResponse ───────────────────────────────────
  describe('getFallbackResponse - predefined keyword matching', () => {
    it('should return booking instructions for booking-related messages', () => {
      const result = chatbotService.getFallbackResponse('How do I book a vehicle?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('book');
    });

    it('should return booking instructions for rent keyword', () => {
      const result = chatbotService.getFallbackResponse('I want to rent a car');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('book');
    });

    it('should return pricing info for price-related messages', () => {
      const result = chatbotService.getFallbackResponse('How much does it cost?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('price');
    });

    it('should return pricing info for cost keyword', () => {
      const result = chatbotService.getFallbackResponse('What is the cost per day?');
      expect(result).not.toBeNull();
      expect(result).toMatch(/\$\d+/);
    });

    it('should return cancellation info for cancel keyword', () => {
      const result = chatbotService.getFallbackResponse('How do I cancel my reservation?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('cancel');
    });

    it('should return payment info for payment-related messages', () => {
      const result = chatbotService.getFallbackResponse('What payment methods do you accept?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('stripe');
    });

    it('should return location info for map-related messages', () => {
      const result = chatbotService.getFallbackResponse('How do I find vehicles near me?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('map');
    });

    it('should return sedan info for sedan keyword', () => {
      const result = chatbotService.getFallbackResponse('Tell me about sedans');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('sedan');
    });

    it('should return truck info for moving keyword', () => {
      const result = chatbotService.getFallbackResponse('I need a moving truck');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('truck');
    });

    it('should return SUV info for suv keyword', () => {
      const result = chatbotService.getFallbackResponse('Do you have SUVs?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('suv');
    });

    it('should return greeting for hello message', () => {
      const result = chatbotService.getFallbackResponse('hello');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('quickrent');
    });

    it('should return null for unrecognized messages', () => {
      const result = chatbotService.getFallbackResponse('what is the meaning of life');
      expect(result).toBeNull();
    });

    it('should be case-insensitive for keyword matching', () => {
      const lower = chatbotService.getFallbackResponse('how much does it COST?');
      const upper = chatbotService.getFallbackResponse('HOW MUCH DOES IT COST?');
      expect(lower).not.toBeNull();
      expect(upper).not.toBeNull();
      expect(lower).toEqual(upper);
    });
  });

  // ─── getContextualFallback ─────────────────────────────────
  describe('getContextualFallback - fallback when AI fails', () => {
    it('should return vehicle-related response for vehicle keyword', () => {
      const result = chatbotService.getContextualFallback('Tell me about your vehicles');
      expect(result.toLowerCase()).toContain('vehicle');
    });

    it('should return availability response for availability keyword', () => {
      const result = chatbotService.getContextualFallback('When is this available?');
      expect(result.toLowerCase()).toContain('availab');
    });

    it('should return a general helpful response for unknown queries', () => {
      const result = chatbotService.getContextualFallback('something completely random xyz');
      expect(result).toBeTruthy();
      expect(result.toLowerCase()).toContain('quickrent');
    });
  });

  // ─── chat ──────────────────────────────────────────────────
  describe('chat - main entry point', () => {
    it('should return fallback response immediately for known keywords', async () => {
      const result = await chatbotService.chat('How do I book a vehicle?');
      expect(result).not.toBeNull();
      expect(result.toLowerCase()).toContain('book');
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should call Hugging Face API for unrecognized messages', async () => {
      axios.post.mockResolvedValue({
        data: { generated_text: 'AI generated response' },
      });
      const result = await chatbotService.chat('some random unrecognized query xyz');
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('huggingface'),
        expect.any(Object),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer test_api_key' }),
        })
      );
      expect(result).toBe('AI generated response');
    });

    it('should return contextual fallback when API call fails', async () => {
      axios.post.mockRejectedValue(new Error('API unavailable'));
      const result = await chatbotService.chat('some random unrecognized query xyz');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle array response format from Hugging Face API', async () => {
      axios.post.mockResolvedValue({
        data: [{ generated_text: 'Array format response' }],
      });
      const result = await chatbotService.chat('random unrecognized xyz query here');
      expect(result).toBe('Array format response');
    });

    it('should handle empty conversation history gracefully', async () => {
      const result = await chatbotService.chat('hello', []);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle conversation history being passed', async () => {
      const history = [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello!' },
      ];
      const result = await chatbotService.chat('How much does it cost?', history);
      expect(result).toBeTruthy();
    });
  });
});
