import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageSize } from "../types";

// Helper to get a fresh AI instance with the latest key
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const checkApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio?.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return !!process.env.API_KEY;
};

export const openApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio?.openSelectKey) {
    await win.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio key selection not available in this environment.");
  }
};

export const generateMirrorResponse = async (userText: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `You are a mystical Magic Mirror. The user said: "${userText}". 
      Respond with a short, witty, and mysterious phrase (max 2 sentences) commenting on their appearance or request. 
      Do not be mean, but be enigmatic.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response, no thinking needed
      }
    });
    return response.text || "...";
  } catch (error) {
    console.error("Mirror text generation failed:", error);
    return "The mists are too thick... I cannot speak.";
  }
};

export const generateMirrorImage = async (
  userText: string,
  imageSize: ImageSize
): Promise<string | null> => {
  const ai = getAI();
  
  try {
    // We strictly use gemini-3-pro-image-preview for generation as requested
    // We construct a prompt that interprets the user's wish visually
    const prompt = `A high quality, magical interpretation of the following description: ${userText}. 
    Cinematic lighting, highly detailed, photorealistic or artistic masterpiece style depending on context.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          imageSize: imageSize,
          aspectRatio: "1:1"
        }
      }
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Mirror image generation failed:", error);
    throw error;
  }
};