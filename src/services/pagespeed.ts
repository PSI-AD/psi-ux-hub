
const PAGESPEED_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export interface PageSpeedResult {
  score: number;
  metrics: {
    lcp: string;
    cls: string;
    fid: string;
    inp: string;
  };
  raw_json: any; // Optimized JSON containing only critical failed audits
}

export const runPageSpeedAudit = async (url: string): Promise<PageSpeedResult> => {
  const apiKey = process.env.API_KEY || ''; 
  
  // 1. Normalize URL (PSI requires protocol)
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  const buildRequestUrl = (includeKey: boolean) => {
    const urlWithParams = new URL(PAGESPEED_ENDPOINT);
    urlWithParams.searchParams.append('url', targetUrl);
    urlWithParams.searchParams.append('category', 'PERFORMANCE');
    urlWithParams.searchParams.append('category', 'ACCESSIBILITY');
    urlWithParams.searchParams.append('category', 'SEO');
    urlWithParams.searchParams.append('strategy', 'MOBILE'); // Real estate traffic is predominantly mobile
    
    if (includeKey && apiKey) {
      urlWithParams.searchParams.append('key', apiKey);
    }
    return urlWithParams.toString();
  };

  try {
    // Attempt 1: Try with API Key if available
    let res = await fetch(buildRequestUrl(true));
    
    // Retry Logic: If API Key is invalid (common if reusing AI Studio key for PSI), retry without it
    if (!res.ok && apiKey) {
        const errorClone = res.clone();
        try {
            const errorBody = await errorClone.json();
            const msg = errorBody?.error?.message || '';
            // Check for common API key errors
            if (msg.includes('API key not valid') || msg.includes('ProjectNotLinked')) {
                console.warn("Provided API Key is not valid for PageSpeed Insights. Retrying anonymously.");
                res = await fetch(buildRequestUrl(false));
            }
        } catch (e) {
            // Ignore JSON parse errors on error response, proceed to standard error handling
        }
    }
    
    if (!res.ok) {
      // Google APIs return error details in JSON body
      const errorBody = await res.json().catch(() => null);
      const errorMessage = errorBody?.error?.message || res.statusText || `Status ${res.status}`;
      throw new Error(`PSI API Error: ${errorMessage}`);
    }
    
    const data = await res.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
        throw new Error("PSI API returned valid response but missing lighthouseResult.");
    }

    // Critical metrics for Real Estate sites (High visual load)
    const CRITICAL_METRICS = [
      "largest-contentful-paint", // Hero images
      "cumulative-layout-shift",  // Ads/Popups loading
      "total-blocking-time",      // Heavy JS
      "server-response-time",     // Slow hosting
      "first-contentful-paint",
      "interactive"
    ];

    // Extract failed audits to reduce token usage and focus the AI
    const failedAudits = Object.values(lighthouse.audits)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((audit: any) => {
        const isCritical = CRITICAL_METRICS.includes(audit.id);
        const isFailing = typeof audit.score === 'number' && audit.score < 0.9;
        const isTerrible = typeof audit.score === 'number' && audit.score < 0.5;
        
        // Return if it's a critical metric failing, OR any metric failing badly
        return (isCritical && isFailing) || isTerrible;
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((audit: any) => ({
        id: audit.id,
        title: audit.title,
        score: audit.score,
        description: audit.description,
        displayValue: audit.displayValue,
        details: audit.details ? { type: audit.details.type } : undefined
      }))
      .slice(0, 10); // Cap at top 10 to ensure high-quality AI analysis

    return {
      score: (lighthouse.categories.performance.score || 0) * 100,
      metrics: {
        lcp: lighthouse.audits['largest-contentful-paint']?.displayValue || 'N/A',
        cls: lighthouse.audits['cumulative-layout-shift']?.displayValue || 'N/A',
        fid: lighthouse.audits['max-potential-fid']?.displayValue || 'N/A',
        inp: lighthouse.audits['interactive']?.displayValue || 'N/A'
      },
      raw_json: {
        performance_score: lighthouse.categories.performance?.score,
        seo_score: lighthouse.categories.seo?.score,
        accessibility_score: lighthouse.categories.accessibility?.score,
        failed_audits: failedAudits
      }
    };
  } catch (error: any) {
    console.error("PageSpeed Error:", error);
    // Pass the actual error message up to the UI
    throw new Error(error.message || "Failed to run PageSpeed Audit.");
  }
};
