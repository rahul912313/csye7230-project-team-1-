const axios = require("axios");

/**
 * ChatbotService - AI Chatbot Service for QuickRent
 * Integrates with Hugging Face API for conversational AI
 * Provides fallback responses for common queries
 * 
 * QuickRent Vehicle Rental Platform
 */
class ChatbotService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    
    // System context about QuickRent
    this.systemContext = `You are a helpful customer service assistant for QuickRent, a vehicle rental platform.

Key Information:
- Vehicle types: Sedans, SUVs, Trucks, Cargo Vans, Moving Trucks
- Pricing: $50-$150 per day depending on type
- Two-phase booking: Get quote → Confirm → Pay
- Payment via Stripe (secure)
- Location-based search with interactive maps
- Cancel anytime before rental starts

Be friendly, concise, and helpful.`;
  }

  /**
   * Process chat message with AI
   * @param {String} userMessage - User's message
   * @param {Array} conversationHistory - Previous conversation
   * @returns {Promise<String>} AI response
   */
  async chat(userMessage, conversationHistory = []) {
    try {
      // Try fallback first
      const fallback = this.getFallbackResponse(userMessage);
      if (fallback) {
        return fallback;
      }

      // Use simpler API endpoint
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          inputs: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.generated_text) {
        return response.data.generated_text;
      }

      // If response format is different
      if (response.data && typeof response.data === 'string') {
        return response.data;
      }

      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0].generated_text || response.data[0];
      }

      // Fallback
      return this.getContextualFallback(userMessage);
    } catch (error) {
      console.error("AI Error:", error.response?.data || error.message);
      
      // Return contextual fallback instead of error
      return this.getContextualFallback(userMessage);
    }
  }

  /**
   * Get predefined fallback responses for common queries
   * @param {String} message - User message
   * @returns {String|null} Fallback response or null
   */
  getFallbackResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("book") || lowerMsg.includes("rent") || lowerMsg.includes("reserve")) {
      return "To book a vehicle: 1) Browse our fleet or use Map Search to find nearby vehicles, 2) Select your dates and get an instant quote (valid for 15 minutes), 3) Confirm and pay securely with Stripe. Your booking will be confirmed immediately!";
    }
    
    if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("how much")) {
      return "Our pricing varies by vehicle type: Sedans start at $50/day, SUVs at $80/day, and Trucks at $100-$150/day. The exact price is shown when you select a vehicle and enter your rental dates.";
    }
    
    if (lowerMsg.includes("cancel")) {
      return "You can cancel your booking anytime before the rental start date! Just go to 'My Bookings' dashboard and click the cancel button. Cancellations are free if done 24 hours before pickup.";
    }
    
    if (lowerMsg.includes("payment") || lowerMsg.includes("pay") || lowerMsg.includes("credit card")) {
      return "We use Stripe for secure payment processing. We accept all major credit cards (Visa, Mastercard, Amex, Discover). Your payment information is encrypted and never stored on our servers.";
    }
    
    if (lowerMsg.includes("location") || lowerMsg.includes("map") || lowerMsg.includes("near") || lowerMsg.includes("find")) {
      return "Use our Map Search feature! Click 'Map Search' in the menu, then either use your current location or search by city/ZIP code. You'll see all available vehicles on an interactive map with distances.";
    }
    
    if (lowerMsg.includes("sedan") || lowerMsg.includes("car")) {
      return "We have several sedans available! Sedans are perfect for city driving and typically seat 4-5 people. Check our 'Vehicles' page and filter by 'Sedan' to see all options with photos and pricing.";
    }
    
    if (lowerMsg.includes("truck") || lowerMsg.includes("moving")) {
      return "Our trucks are perfect for moving! We have Cargo Vans, Moving Trucks, and Large Trucks. Prices range from $100-$150/day. Check availability on our Vehicles page or Map Search.";
    }
    
    if (lowerMsg.includes("suv")) {
      return "SUVs are great for family trips or outdoor adventures! They typically seat 5-7 people and have plenty of cargo space. Browse our SUV fleet to see available options.";
    }
    
    if (lowerMsg.includes("account") || lowerMsg.includes("profile") || lowerMsg.includes("signup") || lowerMsg.includes("register")) {
      return "Creating an account is easy! Click 'Sign Up', enter your email, name, and driver's license number. Once registered, you can book vehicles, view booking history, and manage your profile.";
    }

    if (lowerMsg.includes("help") || lowerMsg.includes("hi") || lowerMsg.includes("hello")) {
      return "Hello! I'm here to help with QuickRent vehicle rentals. You can ask me about:\n• How to book a vehicle\n• Pricing and payment\n• Finding vehicles near you\n• Cancellation policies\n• Vehicle types\n• Account questions\n\nWhat would you like to know?";
    }
    
    return null;
  }

  /**
   * Get contextual fallback when AI fails
   * @param {String} message - User message
   * @returns {String} Contextual fallback response
   */
  getContextualFallback(message) {
    const lowerMsg = message.toLowerCase();
    
    // Vehicle-related
    if (lowerMsg.includes("vehicle") || lowerMsg.includes("car") || lowerMsg.includes("truck")) {
      return "We have a wide selection of vehicles! Browse our fleet to see Sedans, SUVs, Trucks, and Vans. Each listing includes photos, pricing, capacity, and location. What type of vehicle are you interested in?";
    }
    
    // Booking-related
    if (lowerMsg.includes("when") || lowerMsg.includes("available") || lowerMsg.includes("dates")) {
      return "You can check vehicle availability on any vehicle's detail page! Just select your desired dates and we'll show you the total cost and confirm availability instantly.";
    }
    
    // General
    return "I can help you with QuickRent vehicle rentals! Ask me about booking a vehicle, pricing, payment options, finding vehicles near you, or cancellation policies. What would you like to know?";
  }
}

module.exports = ChatbotService;
