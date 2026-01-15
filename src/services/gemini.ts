import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the Client with your VITE Key
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: VITE_GOOGLE_API_KEY is missing in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// We use 'gemini-1.5-flash' because it is faster and better for real-time audits
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
 * AGENT 4: DIRECT UX AUDIT (NO API)
 * Bypasses PageSpeed and asks Gemini to analyze the site purely by URL knowledge/inference
 */
export async function runVisualAudit(url: string) {
  try {
    const prompt = `
      Act as a Senior UX Strategist.
      Analyze the live site at ${url}.
      Identify the top 3 friction points and provide Tailwind CSS code fixes to improve conversion.
      
      Return the response in this JSON format:
      {
        "executive_summary": {
          "key_advantage": "One sentence summary",
          "critical_fix": "Most urgent fix",
          "estimated_roi": "e.g. +15%"
        },
        "findings": [
          {
            "issue_title": "Title of issue",
            "visual_explanation": "Description of the problem",
            "real_estate_impact": "Impact on sales/leads",
            "solution_code_react": "React/Tailwind code snippet to fix it",
            "preview_html": "HTML snippet"
          }
        ],
        "lighthouse_score": 85,
        "lighthouse_metrics": {
          "lcp": "1.2s",
          "cls": "0.05",
          "fid": "12ms"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Direct Audit Error:", error);
    throw error;
  }
}

/**
 * AGENT 5: TECHNICAL DEEP DIVE (JSON INGEST)
 * Analyzes raw Lighthouse JSON to provide engineering fixes
 */
export async function runTechnicalAnalysis(lighthouseData: any) {
  try {
    const prompt = `
      Act as a Lead Performance Engineer.
      I am uploading a professional Lighthouse JSON report for a PSI page.
      
      CONTEXT:
      Score: ${lighthouseData.score}
      LCP: ${lighthouseData.metrics.lcp}
      CLS: ${lighthouseData.metrics.cls}
      
      DATA TO ANALYZE:
      Opportunities: ${JSON.stringify(lighthouseData.opportunities)}
      Diagnostics: ${JSON.stringify(lighthouseData.diagnostics)}
      
      TASK:
      Analyze the 'Opportunities' and 'Diagnostics' sections.
      Provide a detailed table of technical fixes and generate the corrected React/Tailwind code for the top 3 high-impact issues.
      
      Return the response in this JSON format:
      {
        "executive_summary": {
          "technical_health": "Critical/Moderate/Good",
          "primary_bottleneck": "e.g. Unused JavaScript",
          "projected_speed_gain": "e.g. 1.2s"
        },
        "technical_fixes": [
          {
            "issue": "Name of issue",
            "impact": "High/Med/Low",
            "fix_strategy": "Explanation",
            "code_snippet": "React/Config code",
            "file_target": "e.g. vite.config.ts or App.tsx"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Tech Audit Error:", error);
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