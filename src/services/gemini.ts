import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the Client with your VITE Key
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: VITE_GOOGLE_API_KEY is missing in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// We use 'gemini-1.5-pro' because it is best for Coding and Image Analysis
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * AGENT 1: VISUAL STRATEGIST
 * Analyzes screenshots for UX/UI improvements
 */
export async function runRealEstateAnalysis(imageFile: any, promptText: any) {
  try {
    // Convert File to Base64 for Gemini
    const base64Data = await fileToGenerativePart(imageFile);

    const result = await model.generateContent([
      promptText,
      base64Data
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up JSON formatting if Gemini adds markdown blocks
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
}

/**
 * AGENT 2 & 3: CODE GENERATOR
 * Generates React components or fixes based on descriptions
 */
export async function generateFeatureCode(featureName: string, description: string, designSystem?: any) {
  try {
    const designContext = designSystem
      ? `Use these colors: ${designSystem.colors?.join(', ')}. Font: ${designSystem.typography}.`
      : "Use standard Tailwind CSS with blue-600 as primary.";

    const prompt = `
      Act as a Senior React Developer.
      Task: Create a production-ready React component for: "${featureName}".
      Context: ${description}.
      Design System: ${designContext}
      
      Requirements:
      1. Use 'lucide-react' for icons.
      2. Use Tailwind CSS for styling.
      3. Return ONLY the raw code string (no markdown formatting like \`\`\`tsx).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.replace(/```tsx|```javascript|```/g, "").trim();

  } catch (error) {
    console.error("Gemini Code Gen Error:", error);
    throw error;
  }
}

/**
 * HELPER: Convert File to Base64
 */
async function fileToGenerativePart(file: File) {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the "data:image/jpeg;base64," part
      const base64Content = base64String.split(",")[1];

      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}