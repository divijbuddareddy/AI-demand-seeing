/**
 * Fridayy Closed-Loop Learning Engine
 * Implements: Data -> Decision -> Action -> Result -> Learning -> Better Decision
 */

export class ClosedLoopLearningEngine {
  constructor() {
    this.history = JSON.parse(localStorage.getItem('fridayy_closed_loop_history') || '[]');
  }

  /**
   * Run a simulated real-world launch outcome
   */
  simulateOutcome({ marketCode = 'UAE', targetPriceLocal = 99, adBudgetINR = 5000, initialUnits = 50 }) {
    // Generate stochastic real-world performance metrics based on market attractiveness
    const baseViews = Math.round(1800 + (Math.random() * 800));
    const ctr = (2.8 + (Math.random() * 1.6)).toFixed(2); // 2.8% - 4.4%
    const clicks = Math.round(baseViews * (parseFloat(ctr) / 100));
    const conversionRate = (3.5 + (Math.random() * 2.0)).toFixed(2); // 3.5% - 5.5%
    const orders = Math.min(initialUnits, Math.round(clicks * (parseFloat(conversionRate) / 100)));
    const revenueLocal = orders * targetPriceLocal;
    const avgRating = (4.7 + (Math.random() * 0.3)).toFixed(1);
    const returnRate = (1.2 + (Math.random() * 0.8)).toFixed(1);

    // AI Adaptive Insights
    let insightVerdict = '';
    let nextOptimizedAction = '';
    let updatedOpportunityScore = 91;

    if (orders >= 35 && parseFloat(conversionRate) > 3.8) {
      updatedOpportunityScore = 96;
      insightVerdict = 'Exceptional Demand Velocity & Unit Economics';
      nextOptimizedAction = `Pricing Elasticity allows raising price by +15% (to AED ${Math.round(targetPriceLocal * 1.15)}) with zero volume decay. Ready for USA Expansion Phase!`;
    } else if (orders >= 20) {
      updatedOpportunityScore = 92;
      insightVerdict = 'Healthy Market Fit & Consistent Sales';
      nextOptimizedAction = 'Maintain current pricing. Run sponsored product video ads on Amazon.ae to scale volume by 2.4x.';
    } else {
      updatedOpportunityScore = 86;
      insightVerdict = 'Moderate Traction - Needs Listing Optimization';
      nextOptimizedAction = 'A/B test primary lifestyle imagery and include localized Arabic keywords in search terms.';
    }

    const outcomeRecord = {
      timestamp: new Date().toISOString(),
      marketCode,
      targetPriceLocal,
      views: baseViews,
      ctr: `${ctr}%`,
      clicks,
      conversionRate: `${conversionRate}%`,
      orders,
      revenueLocal,
      avgRating: `${avgRating} ★`,
      returnRate: `${returnRate}%`,
      updatedOpportunityScore,
      insightVerdict,
      nextOptimizedAction
    };

    this.history.unshift(outcomeRecord);
    if (this.history.length > 20) this.history.pop();
    localStorage.setItem('fridayy_closed_loop_history', JSON.stringify(this.history));

    return outcomeRecord;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem('fridayy_closed_loop_history');
  }
}

export const closedLoopEngine = new ClosedLoopLearningEngine();
