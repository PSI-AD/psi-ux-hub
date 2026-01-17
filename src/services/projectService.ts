import { PSIProject } from '../types/index';

/**
 * Validates if a project meets the 'Platinum Standard' for AI auditing.
 */
export const checkProjectReadiness = (project: PSIProject): {
  isReady: boolean;
  missing: string[];
} => {
  const missing: string[] = [];

  if (!project.brand.dna) {
    missing.push("Brand DNA Extraction (Phase 0)");
  }

  if ((project.competitors || []).length < 3) {
    missing.push("Minimum of 3 Competitor URLs");
  }

  if (!project.businessObjectives.primaryKPIs || project.businessObjectives.primaryKPIs.length < 10) {
    missing.push("Defined Success Metrics (KPIs)");
  }

  return {
    isReady: missing.length === 0,
    missing
  };
};

/**
 * Calculates a health percentage for the project based on metadata completion.
 */
export const getProjectHealthScore = (project: PSIProject): number => {
  let score = 0;
  if (project.brand.dna) score += 40;
  if (project.competitors && project.competitors.length >= 3) score += 30;
  if (project.businessObjectives.primaryKPIs) score += 30;
  return score;
};