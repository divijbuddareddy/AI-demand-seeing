/**
 * Engine 4: Global Readiness Score Engine
 * Evaluates 5 key readiness vectors:
 * 1. Product Attractiveness
 * 2. International Demand
 * 3. Competition
 * 4. Expected Margin
 * 5. Export / Operational Complexity
 */

export class GlobalReadinessEngine {
  static computeReadiness({
    productAttractiveness = 90,
    internationalDemand = 86,
    competition = 72,
    expectedMargin = 88,
    operationalComplexity = 70,
    rawVerdict = null,
    recommendationSummary = null
  }) {
    // Weighted Average Score:
    // Attractiveness (25%), Demand (25%), Margin (25%), Competition (15%), Operational Feasibility (10%)
    const weightedScore = Math.round(
      (productAttractiveness * 0.25) +
      (internationalDemand * 0.25) +
      (expectedMargin * 0.25) +
      (competition * 0.15) +
      (operationalComplexity * 0.10)
    );

    const isGoGlobal = rawVerdict ? rawVerdict === 'GO GLOBAL' : weightedScore >= 70;

    const verdict = isGoGlobal ? 'GO GLOBAL' : 'DON\'T GO GLOBAL YET';
    
    let defaultSummary = isGoGlobal
      ? 'Start with UAE. Expand to USA after validating 50 orders.'
      : 'Estimated international margin is too low. Increase domestic price or reduce fulfillment cost first.';

    return {
      overallScore: weightedScore,
      verdict,
      isGoGlobal,
      recommendationSummary: recommendationSummary || defaultSummary,
      factors: {
        productAttractiveness: Math.min(100, Math.max(0, productAttractiveness)),
        internationalDemand: Math.min(100, Math.max(0, internationalDemand)),
        competition: Math.min(100, Math.max(0, competition)),
        expectedMargin: Math.min(100, Math.max(0, expectedMargin)),
        operationalComplexity: Math.min(100, Math.max(0, operationalComplexity))
      },
      factorExplanations: {
        productAttractiveness: 'Uniqueness of design, artisan appeal, and global visual differentiation.',
        internationalDemand: 'Search trends, cultural synergy, and target market consumer intent.',
        competition: 'Market saturation, presence of domestic alternatives, and ad auction density.',
        expectedMargin: 'Net profitability after international logistics, import tariffs, and channel cuts.',
        operationalComplexity: 'Packaging resilience, customs compliance, certifications, and return handling.'
      }
    };
  }
}
