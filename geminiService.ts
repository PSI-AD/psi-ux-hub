import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "./types";

export const runUXAudit = async (targetUrl: string, screenshotBase64?: string): Promise<AuditResult> => {
  // Initialize the GenAI client inside the function to ensure the correct API key is picked up from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    You are a Senior Visual UX Consultant and Front-End Architect specializing in Luxury Real Estate Optimization for Property Shop Investment (PSI).
    
    GOAL: Perform a "Lighthouse-style" audit. 
    COORDINATE MAPPING: Identify UX friction points. Coordinates (x, y, width, height) must be percentages (0-100).
    CODE FIX: Provide a complete, deployable React + Tailwind CSS component that fixes the section.
    
    Return Strictly JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      performanceScore: { type: Type.NUMBER },
      accessibilityScore: { type: Type.NUMBER },
      bestPracticesScore: { type: Type.NUMBER },
      seoScore: { type: Type.NUMBER },
      frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggestedFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
      hotspots: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            width: { type: Type.NUMBER },
            height: { type: Type.NUMBER },
            label: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["friction", "improvement"] },
            description: { type: Type.STRING }
          },
          required: ["x", "y", "width", "height", "label", "type", "description"]
        }
      },
      codeFix: { type: Type.STRING }
    },
    required: ["performanceScore", "accessibilityScore", "bestPracticesScore", "seoScore", "frictionPoints", "suggestedFixes", "hotspots", "codeFix"]
  };

  const contents = {
    parts: [
      { text: `Audit URL: ${targetUrl}. Focus on luxury property UX standards.` },
      ...(screenshotBase64 ? [{ inlineData: { mimeType: 'image/jpeg', data: screenshotBase64 } }] : [])
    ]
  };

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      thinkingConfig: { thinkingBudget: 16384 }
    }
  });

  const result = JSON.parse(response.text || "{}");
  result.timestamp = new Date().toLocaleTimeString();
  return result as AuditResult;
};

export const generateFixVisualization = async (code: string, pageName: string): Promise<string | null> => {
  // Initialize the GenAI client inside the function to ensure the correct API key is picked up from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';
  const prompt = `High-end luxury real estate UI mockup for ${pageName} section of PSI (Property Shop Investment). Sophisticated Navy Blue and Gold color scheme. Modern, clean, professional. Visualizing: ${code.substring(0, 300)}`;
  
  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};