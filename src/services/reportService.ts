/**
 * PSI Report & Export Service - Phase 8
 * Robust handling for high-fidelity exports.
 */

/**
 * Generates a professional luxury PDF report from a target HTML element.
 * Wrapped in robust try-catch for environment stability.
 */
export const generateReport = async (elementId: string, projectName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`[ReportEngine] Target element '${elementId}' not found.`);
    return;
  }

  try {
    // Dynamic import to handle potential CSP or load failures gracefully
    const html2canvasModule = await import('html2canvas').catch(() => null);
    const jspdfModule = await import('jspdf').catch(() => null);

    if (!html2canvasModule || !jspdfModule) {
      throw new Error("Critical export dependencies (html2canvas/jspdf) failed to load.");
    }

    const html2canvas = html2canvasModule.default;
    const { jsPDF } = jspdfModule;

    // Preparation for clean capture
    const originalStyle = element.getAttribute('style') || '';
    element.style.width = '1200px';
    element.style.padding = '40px';
    
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: '#020617',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.visibility = 'visible';
        }
      }
    });

    // Reset styles immediately after canvas creation
    element.setAttribute('style', originalStyle);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2],
      hotfixes: ['px_scaling']
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${projectName.replace(/\s+/g, '-')}-Luxury-Audit-Report.pdf`);
    
  } catch (error) {
    console.error("[ReportEngine] Export operation aborted:", error);
    alert("Export system encountered a technical restriction. Please try capturing the screen manually for the presentation.");
  }
};

/**
 * Phase 8: Generates a simulated shareable URL for the presentation.
 */
export const generateShareablePresentationLink = (projectId: string): string => {
  try {
    const hash = btoa(JSON.stringify({ id: projectId, ts: Date.now() }));
    return `${window.location.origin}/share/presentation?auth=${hash}`;
  } catch (err) {
    return `${window.location.origin}/presentation/${projectId}`;
  }
};
