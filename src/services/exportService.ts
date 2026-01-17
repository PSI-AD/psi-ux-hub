
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { AuditFolder } from '../types/index';

/**
 * Utility to extract base64 data from a data URL.
 */
const getBase64FromDataUrl = (dataUrl: string): string => {
  return dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
};

/**
 * Generates and downloads a ZIP bundle containing all audit assets.
 */
export const generateAuditZip = async (
  folder: AuditFolder, 
  pageName: string, 
  onProgress?: (status: string) => void
): Promise<void> => {
  try {
    if (onProgress) onProgress('Initializing Bundle...');
    
    const zip = new JSZip();
    const date = new Date(folder.timestamp);
    const dateStr = date.toISOString().split('T')[0];
    const folderName = `${pageName.replace(/\s+/g, '-')}-${dateStr}-Audit`;

    // 1. Audit Metadata & Report
    if (onProgress) onProgress('Preparing Report...');
    // Included rationale and heuristics in zip report
    const reportData = {
      id: folder.id,
      taskName: folder.taskName,
      pageName: pageName,
      timestamp: folder.timestamp,
      scores: folder.reports,
      currentHeuristics: folder.currentHeuristics,
      proposedHeuristics: folder.proposedHeuristics,
      rationale: folder.rationale,
      uxIssues: folder.uxIssues,
      voiceDirectives: folder.voiceDirectives,
      description: folder.description
    };
    zip.file("audit_report.json", JSON.stringify(reportData, null, 2));

    // 2. Implementation Code (TSX)
    if (onProgress) onProgress('Packaging Code...');
    zip.file("implementation_fix.tsx", folder.refinedCode);

    // 3. Images (Legacy & Proposal)
    if (onProgress) onProgress('Compiling Assets...');
    
    // Process Legacy Capture
    if (folder.thumbnail) {
      const legacyBase64 = getBase64FromDataUrl(folder.thumbnail);
      zip.file("legacy_capture.png", legacyBase64, { base64: true });
    }

    // Process AI Proposal
    if (folder.redesignImg) {
      const redesignBase64 = getBase64FromDataUrl(folder.redesignImg);
      zip.file("ai_proposal.png", redesignBase64, { base64: true });
    }

    // 4. Generate Blob
    if (onProgress) onProgress('Zipping...');
    const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
      if (onProgress) onProgress(`Zipping ${Math.round(metadata.percent)}%`);
    });

    // 5. Save using the namespace reference to resolve the ESM SyntaxError
    FileSaver.saveAs(content, `${folderName}.zip`);
    
    if (onProgress) onProgress('Export Complete');
  } catch (error) {
    console.error('[ExportService] Zip generation failed:', error);
    if (onProgress) onProgress('Export Failed');
    throw error;
  }
};
