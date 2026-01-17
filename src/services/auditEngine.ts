import { HeuristicBreakdown, HeuristicRationale, RedesignBlock } from '../types/index';

/**
 * PSI Heuristic Engine - The "Source of Truth" for UX diagnostics.
 */
export const calculateHeuristicScore = (data: Partial<HeuristicBreakdown>): HeuristicBreakdown => {
  const visualHierarchy = Math.min(data.visualHierarchy || 0, 25);
  const trustAuthority = Math.min(data.trustAuthority || 0, 20);
  const conversionFriction = Math.min(data.conversionFriction || 0, 20);
  const accessibilityCompliance = Math.min(data.accessibilityCompliance || 0, 15);
  const infoArchitecture = Math.min(data.infoArchitecture || 0, 10);
  const mobileResponsiveness = Math.min(data.mobileResponsiveness || 0, 10);

  return {
    visualHierarchy,
    trustAuthority,
    conversionFriction,
    accessibilityCompliance,
    infoArchitecture,
    mobileResponsiveness,
    total: visualHierarchy + trustAuthority + conversionFriction + accessibilityCompliance + infoArchitecture + mobileResponsiveness
  };
};

export const generateDiagnosticRationale = (current: HeuristicBreakdown, proposed: HeuristicBreakdown): HeuristicRationale[] => {
  const rationales: HeuristicRationale[] = [];

  const categories = [
    { key: 'visualHierarchy', label: 'Visual Hierarchy', impact: 25 },
    { key: 'trustAuthority', label: 'Trust & Authority', impact: 20 },
    { key: 'conversionFriction', label: 'Conversion Friction', impact: 20 },
    { key: 'accessibilityCompliance', label: 'Accessibility', impact: 15 },
  ];

  categories.forEach(cat => {
    const curVal = (current as any)[cat.key];
    const propVal = (proposed as any)[cat.key];
    if (propVal > curVal) {
      rationales.push({
        category: cat.label,
        currentObservation: `Score: ${curVal}/${cat.impact}. Element alignment and priority are suboptimal for luxury user paths.`,
        proposedImprovement: `Projected: ${propVal}/${cat.impact}. Rebalancing layout density and accentuating high-intent actions.`,
        impactScore: propVal - curVal
      });
    }
  });

  return rationales;
};
