
/**
 * External API Service (The "Hub" Connections)
 * Handles integration with third-party Real Estate data providers.
 */

interface WalkScoreResult {
  score: number;
  description: string;
  logo_url: string;
  updated: string;
}

export const ExternalApiService = {
  /**
   * Mock implementation of Walk Score API
   * In production, this would call https://api.walkscore.com/score
   */
  fetchWalkScore: async (address: string, lat: number, lon: number): Promise<WalkScoreResult> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock logic based on coordinates or address
    const mockScore = Math.floor(Math.random() * (99 - 70) + 70); // High scores for demo
    
    return {
      score: mockScore,
      description: mockScore > 90 ? "Walker's Paradise" : mockScore > 70 ? "Very Walkable" : "Car-Dependent",
      logo_url: "https://cdn.walk.sc/images/api-logo.png",
      updated: new Date().toISOString()
    };
  },

  /**
   * Audits if the UI is correctly merchandising the location value.
   */
  auditNeighborhoodValue: async (address: string, currentUiText: string) => {
    // 1. Fetch real data (Mocked)
    const walkScoreData = await ExternalApiService.fetchWalkScore(address, 0, 0);

    // 2. Check if the website UI mentions this value (Case insensitive check)
    const lowerText = currentUiText.toLowerCase();
    const uiMentionsScore = lowerText.includes("walk score") || lowerText.includes(walkScoreData.score.toString());
    const uiMentionsDescription = lowerText.includes(walkScoreData.description.toLowerCase());

    // 3. Return Insight
    // If score is high (>90) but not mentioned, it's a critical miss.
    if (walkScoreData.score > 90 && (!uiMentionsScore && !uiMentionsDescription)) {
      return {
        status: "critical_miss",
        message: `This property is a '${walkScoreData.description}' (Score: ${walkScoreData.score}), but your page fails to mention this key selling point.`,
        recommendation: "Add the official 'Neighborhood Score' widget immediately to increase location value perception.",
        widgetData: walkScoreData
      };
    } else if (walkScoreData.score > 70 && !uiMentionsScore) {
       return {
        status: "opportunity",
        message: `Walk Score is decent (${walkScoreData.score}). Consider highlighting local amenities if you don't show the score directly.`,
        widgetData: walkScoreData
      };
    }

    return { 
        status: "optimized",
        message: "Location value is either effectively communicated or not a primary selling point.",
        widgetData: walkScoreData
    };
  }
};
