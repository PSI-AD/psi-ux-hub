import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult, RedesignBlock, BrandDNA, HeatmapPoint, HeuristicBreakdown, UIComponent, ComponentCategory } from "../types/index";

const stripBase64Prefix = (base64: string): string => {
  return base64.includes(',') ? base64.split(',')[1] : base64;
};

const withRetry = async <T>(fn: () => Promise<T>, retries: number = 1): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes('Canceled') || error.message?.includes('CSP') || error.message?.includes('fetch'))) {
      return await fn();
    }
    throw error;
  }
};

/**
 * Extracts primary and secondary colors from a logo image.
 */
export const extractBrandColors = async (logoBase64: string): Promise<{ primaryColor: string; secondaryColor: string }> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: "Extract the primary and secondary hex colors from this luxury brand logo. Return JSON." },
          { inlineData: { mimeType: 'image/png', data: stripBase64Prefix(logoBase64) } }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryColor: { type: Type.STRING },
            secondaryColor: { type: Type.STRING }
          },
          required: ["primaryColor", "secondaryColor"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  });
};

/**
 * Parses redesign code and extracts individual reusable UI components for the library.
 */
export const extractLibraryComponents = async (code: string, blockType: string): Promise<UIComponent[]> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const prompt = `Deconstruct the following React + Tailwind code for a ${blockType} into reusable atomic, molecular, and organizational components. 
    Use Brand Variable Names like 'psi-gold' and 'obsidian' for styling.
    
    Return a JSON array of components with:
    - name: e.g., 'LuxuryPrimaryButton'
    - category: 'ATOM', 'MOLECULE', or 'ORGANISM'
    - code: Clean, functional React component code.
    - tokens: { primaryColor: string, radius: string, spacing: string, typography: string }
    
    Code to parse:
    ${code}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["ATOM", "MOLECULE", "ORGANISM"] },
              code: { type: Type.STRING },
              tokens: {
                type: Type.OBJECT,
                properties: {
                  primaryColor: { type: Type.STRING },
                  radius: { type: Type.STRING },
                  spacing: { type: Type.STRING },
                  typography: { type: Type.STRING }
                },
                required: ["primaryColor", "radius", "spacing", "typography"]
              }
            },
            required: ["name", "category", "code", "tokens"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.map((res: any) => ({
      ...res,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    })) as UIComponent[];
  });
};

/**
 * Suggests a structural map of the most important sub-pages for a website.
 */
export const crawlSiteStructure = async (baseUrl: string): Promise<{ name: string; url: string }[]> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze this URL: ${baseUrl}. Suggest a structural map of the most important 5-8 sub-pages for a luxury real estate investment portal. Return as a JSON array of objects with 'name' and 'url'.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              url: { type: Type.STRING }
            },
            required: ["name", "url"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  });
};

/**
 * Analyzes a logo for brand audit purposes, providing deep insights.
 */
export const analyzeBrandIdentity = async (logoBase64: string, industry: string, country: string): Promise<any> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: `Analyze this logo for a brand in the ${industry} industry based in ${country}. Provide a detailed audit of color psychology, typography alignment for luxury markets, market positioning, and regional industry insights. Return JSON.` },
          { inlineData: { mimeType: 'image/png', data: stripBase64Prefix(logoBase64) } }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colorAnalysis: { type: Type.STRING },
            typographySuggestions: { type: Type.STRING },
            marketPositioning: { type: Type.STRING },
            industryInsights: { type: Type.STRING }
          },
          required: ["colorAnalysis", "typographySuggestions", "marketPositioning", "industryInsights"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  });
};

export const extractBrandDNA = async (logoBase64: string, url: string): Promise<BrandDNA> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    
    const prompt = `Analyze this logo and the context of the URL: ${url}. 
    Extract the 'Design DNA' for Property Shop Investment (PSI). 
    Focus on palette, typography classification (e.g. Geometric Sans), layout rhythm, and luxury philosophy.
    Return JSON format.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: stripBase64Prefix(logoBase64) } }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accents: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            typography: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                body: { type: Type.STRING },
                tone: { type: Type.STRING }
              }
            },
            spacing: { type: Type.STRING },
            layoutRhythm: { type: Type.STRING },
            extractedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            philosophy: { type: Type.STRING }
          },
          required: ["colors", "typography", "spacing", "layoutRhythm", "philosophy"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  });
};

export const runUXAudit = async (targetUrl: string, screenshotBase64?: string, voicePrompt?: string, projectContext?: any): Promise<AuditResult> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    
    const systemInstruction = `You are a world-class Luxury UI/UX Agency Consultant.
    Perform a 100-point Heuristic Audit across: 
    1. Visual Hierarchy (25 pts)
    2. Trust & Authority (20 pts)
    3. Conversion Friction (20 pts)
    4. Accessibility & Compliance (15 pts)
    5. Info Architecture (10 pts)
    6. Mobile Responsiveness (10 pts)

    SEGMENTATION: Deconstruct the page into semantic 'Design Units' (Hero, Listing Grid, Filter Bar, etc.).
    SCORING: For each unit, generate a UX Heuristic Score based on readability, friction, and CTA visibility.
    AESTHETIC: Obsidian Dark + PSI Gold (#D4AF37).`;

    const heuristicSchema = {
      type: Type.OBJECT,
      properties: {
        visualHierarchy: { type: Type.NUMBER },
        trustAuthority: { type: Type.NUMBER },
        conversionFriction: { type: Type.NUMBER },
        accessibilityCompliance: { type: Type.NUMBER },
        infoArchitecture: { type: Type.NUMBER },
        mobileResponsiveness: { type: Type.NUMBER },
        total: { type: Type.NUMBER }
      },
      required: ["total"]
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        performanceScore: { type: Type.NUMBER },
        accessibilityScore: { type: Type.NUMBER },
        bestPracticesScore: { type: Type.NUMBER },
        seoScore: { type: Type.NUMBER },
        currentHeuristics: heuristicSchema,
        proposedHeuristics: heuristicSchema,
        rationale: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              currentObservation: { type: Type.STRING },
              proposedImprovement: { type: Type.STRING },
              impactScore: { type: Type.NUMBER }
            }
          }
        },
        blocks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              code: { type: Type.STRING },
              diagnosticScores: {
                type: Type.OBJECT,
                properties: {
                  hierarchy: { type: Type.NUMBER },
                  readability: { type: Type.NUMBER },
                  accessibility: { type: Type.NUMBER },
                  conversion: { type: Type.NUMBER }
                }
              },
              heuristicRationale: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    currentObservation: { type: Type.STRING },
                    proposedImprovement: { type: Type.STRING },
                    impactScore: { type: Type.NUMBER }
                  }
                }
              },
              heatmapData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    intensity: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        },
        codeFix: { type: Type.STRING },
        frictionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedFixes: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["currentHeuristics", "proposedHeuristics", "blocks", "codeFix"]
    };

    const prompt = `Audit URL: ${targetUrl}. ${voicePrompt || ""}`;
    const contents = {
      parts: [
        { text: prompt },
        ...(screenshotBase64 ? [{ inlineData: { mimeType: 'image/jpeg', data: stripBase64Prefix(screenshotBase64) } }] : [])
      ]
    };

    const response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction, responseMimeType: "application/json", responseSchema }
    });

    const result = JSON.parse(response.text || "{}");
    
    if (result.blocks) {
      for (let block of result.blocks) {
        block.suggestedImage = await generateFixVisualization(block.code, block.title, projectContext?.brand) || "";
        block.annotations = [];
      }
    }

    result.timestamp = new Date().toLocaleTimeString();
    return result as AuditResult;
  });
};

export const generateFixVisualization = async (code: string, pageName: string, brand?: any): Promise<string | null> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-image';
    const primary = brand?.primaryColor || "#D4AF37";
    const prompt = `High-fidelity Luxury UI mockup for ${pageName}. Primary Theme: ${primary}. Obsidian textures. Code context: ${code.substring(0, 300)}`;
    
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  });
};

export const refineBlockWithFeedback = async (block: RedesignBlock, feedback: any, brand: any): Promise<RedesignBlock> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  const prompt = `Refine the React code for '${block.title}'. Feedback: ${JSON.stringify(feedback)}. Brand Colors: ${JSON.stringify(brand)}. Ensure valid JSON output with 'code' and 'heatmapData'.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  const parsed = JSON.parse(response.text || "{}");
  const newCode = parsed.code || block.code;
  const newImage = await generateFixVisualization(newCode, block.title, brand);

  return {
    ...block,
    code: newCode,
    suggestedImage: newImage || block.suggestedImage,
    heatmapData: parsed.heatmapData || block.heatmapData
  };
};

export const processVoiceInput = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).Recognition;
    if (!SpeechRecognition) return reject("Speech Recognition not supported.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event: any) => resolve(event.results[0][0].transcript);
    recognition.onerror = (err: any) => reject(err);
  });
};

export const refineCodeWithVoice = async (code: string, transcript: string, mimicCompetitor?: boolean, competitors?: string[]): Promise<any> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    const prompt = `Original Code:\n${code}\n\nInstruction: ${transcript}\nCompetitors Context: ${competitors?.join(', ')}. Return JSON with 'code'.`;
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};