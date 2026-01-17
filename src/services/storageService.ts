
import { ref, uploadString, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase.config";
import { AuditFolder } from "../types/index";

/**
 * Formats a date to the required string format: "17th-Jan-2026"
 */
const formatAuditDate = (date: Date): string => {
  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix}-${month}-${year}`;
};

/**
 * Generates a short random hash for unique file naming.
 */
const generateRandomHash = (length: number = 3): string => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

/**
 * Extracts the domain from a URL for folder organization.
 */
const getDomainFromUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "unknown-domain";
  }
};

interface AuditBundleUploadResult {
  legacyUrl: string;
  redesignUrl: string;
  reportUrl: string;
  path: string;
}

/**
 * Professional Storage Pipeline for PSI Audit Assets.
 * Saves assets in: [Domain]/[PageName]/[Date]/[SessionID]
 */
export const uploadAuditBundle = async (
  folder: AuditFolder,
  targetUrl: string,
  pageName: string
): Promise<AuditBundleUploadResult> => {
  const date = new Date();
  const domain = getDomainFromUrl(targetUrl);
  const formattedDate = formatAuditDate(date);
  const sessionId = folder.id;
  const hash = generateRandomHash();
  
  // Storage Hierarchy: [Domain]/[PageName]/[Date]/[SessionID]
  const basePath = `${domain}/${pageName.toLowerCase().replace(/\s+/g, "-")}/${formattedDate}/${sessionId}`;
  
  // File Naming Convention: [PageName]-[Date]-[RandomHash].png
  const fileNameBase = `${pageName.toLowerCase().replace(/\s+/g, "-")}-${formattedDate}-${hash}`;

  const legacyRef = ref(storage, `${basePath}/legacy-${fileNameBase}.png`);
  const redesignRef = ref(storage, `${basePath}/redesign-${fileNameBase}.png`);
  const reportRef = ref(storage, `${basePath}/report.json`);

  try {
    // 1. Upload Legacy Screenshot (Base64)
    const legacyUpload = await uploadString(legacyRef, folder.thumbnail, "data_url");
    const legacyUrl = await getDownloadURL(legacyUpload.ref);

    // 2. Upload AI Mockup (Base64)
    const redesignUpload = await uploadString(redesignRef, folder.redesignImg, "data_url");
    const redesignUrl = await getDownloadURL(redesignUpload.ref);

    // 3. Upload JSON Report metadata
    // Added rationale to storage report
    const reportBlob = new Blob([JSON.stringify({
      id: folder.id,
      timestamp: folder.timestamp,
      scores: folder.reports,
      currentHeuristics: folder.currentHeuristics,
      proposedHeuristics: folder.proposedHeuristics,
      rationale: folder.rationale,
      task: folder.taskName,
      description: folder.description,
      uxIssues: folder.uxIssues,
      voiceDirectives: folder.voiceDirectives,
      codeFix: folder.refinedCode
    }, null, 2)], { type: "application/json" });
    
    const reportUpload = await uploadBytes(reportRef, reportBlob);
    const reportUrl = await getDownloadURL(reportUpload.ref);

    console.log(`[StoragePipeline] Audit bundle atomic upload complete for session: ${sessionId}`);
    
    return {
      legacyUrl,
      redesignUrl,
      reportUrl,
      path: basePath
    };
  } catch (error) {
    console.error("[StoragePipeline] Transactional upload failed:", error);
    throw error;
  }
};

/**
 * Uploads project guidelines documents.
 */
export const uploadGuidelineDocument = async (projectId: string, file: File): Promise<string> => {
  const path = `projects/${projectId}/guidelines/${file.name}`;
  const docRef = ref(storage, path);
  const uploadResult = await uploadBytes(docRef, file);
  return await getDownloadURL(uploadResult.ref);
};
