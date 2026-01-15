export interface PageSpeedResult {
  score: number;
  metrics: {
    lcp: string;
    cls: string;
    fid: string;
    inp: string;
  };
  raw_json: any;
  opportunities?: any[];
  diagnostics?: any[];
}

/**
 * PARSER: Extracts professional metrics from a raw Lighthouse JSON file
 */
export const parseLighthouseJson = (json: any): PageSpeedResult => {
  try {
    const lighthouse = json.lighthouseResult || json; // Handle both full PSI response and direct Lighthouse JSON

    // 1. Core Metrics
    const categories = lighthouse.categories || {};
    const audits = lighthouse.audits || {};

    const score = (categories.performance?.score || 0) * 100;

    const metrics = {
      lcp: audits['largest-contentful-paint']?.displayValue || 'N/A',
      cls: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      fid: audits['max-potential-fid']?.displayValue || 'N/A', // Deprecated but often present
      inp: audits['interactive']?.displayValue || 'N/A' // Using TTI as proxy if INP missing, or checking 'interaction-to-next-paint'
    };

    // 2. Extract Opportunities (Load Performance)
    const opportunities = Object.values(audits)
      .filter((audit: any) =>
        audit.details?.type === 'opportunity' &&
        (typeof audit.score === 'number' && audit.score < 0.9)
      )
      .sort((a: any, b: any) => (a.score || 0) - (b.score || 0))
      .slice(0, 5)
      .map((audit: any) => ({
        title: audit.title,
        description: audit.description,
        savings: audit.displayValue
      }));

    // 3. Extract Diagnostics (Tech Issues)
    const diagnostics = Object.values(audits)
      .filter((audit: any) =>
        (typeof audit.score === 'number' && audit.score === 0) &&
        !audit.details?.type // General failures
      )
      .slice(0, 5)
      .map((audit: any) => ({
        title: audit.title,
        description: audit.description
      }));

    return {
      score,
      metrics,
      raw_json: lighthouse,
      opportunities,
      diagnostics
    };

  } catch (e) {
    console.error("Lighthouse Parse Error", e);
    throw new Error("Invalid Lighthouse JSON. Please upload a valid report.");
  }
};
