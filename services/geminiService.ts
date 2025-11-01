

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should not be hit in the target environment
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

// Fix: Pass the API key as a named parameter.
const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateHypePost = async (opponent: string, date: string, location: string): Promise<string> => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

  const prompt = `Generate an exciting and short social media post for an upcoming volleyball match for my team, 'Mouloudia Tnit de Volleyball'. We are playing against ${opponent} on ${formattedDate} at ${location}. The tone should be energetic, confident, and encourage fans to come and support us. Use emojis and include relevant hashtags like #MouloudiaTiznit, #Volleyball, #Tiznit, and #GoMouloudia.`;

  try {
    const response = await ai.models.generateContent({
      // Fix: Use a recommended model for basic text tasks.
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    return "There was an error generating the post. Please try again later.";
  }
};
