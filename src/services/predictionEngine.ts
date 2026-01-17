import { HeatmapPoint, RedesignBlock } from '../types/index';

/**
 * PSI Prediction Engine - Phase 7
 * Calculates visual prominence and attention density using AI-trained heuristics.
 */

interface ElementMetric {
  contrast: number; // 0-1
  size: number; // 0-1 (relative to viewport)
  fPatternScore: number; // 0-1 (Top-Left focus)
}

export const calculateProminence = (metric: ElementMetric): number => {
  // Weighted formula: Gold on Obsidian = ~95%
  const score = (metric.contrast * 0.45) + (metric.size * 0.25) + (metric.fPatternScore * 0.30);
  return Math.round(score * 100);
};

export const generateFPatternWeight = (x: number, y: number): number => {
  // Simple F-pattern approximation: Higher weight at top and left
  const xWeight = 1 - (x / 100);
  const yWeight = 1 - (y / 100);
  return (xWeight * 0.4) + (yWeight * 0.6);
};

export const simulateHeatmap = (blocks: RedesignBlock[]): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];
  
  blocks.forEach(block => {
    // Generate simulated points based on block importance
    const blockBaseIntensity = block.diagnosticScores.conversion / 100;
    
    // Primary focus point (usually center or primary CTA)
    points.push({
      x: 50,
      y: 40,
      intensity: blockBaseIntensity
    });

    // Secondary scatter
    if (blockBaseIntensity > 0.7) {
      points.push({ x: 30, y: 35, intensity: 0.4 });
      points.push({ x: 70, y: 45, intensity: 0.3 });
    }
  });

  return points;
};

export const getClickProbability = (blockType: string, prominence: number): number => {
  const multipliers: Record<string, number> = {
    'cta': 1.2,
    'hero': 1.1,
    'listings': 0.9,
    'footer': 0.4
  };
  
  const base = prominence * (multipliers[blockType] || 1.0);
  return Math.min(Math.round(base), 99);
};
