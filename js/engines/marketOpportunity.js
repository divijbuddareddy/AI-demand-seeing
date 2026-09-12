/**
 * Engine 2: Market Opportunity Engine
 * Multi-country evaluation: Country -> Demand -> Growth -> Competition -> Opportunity Score (0-100)
 */

import { CONFIG } from '../config.js';

export class MarketOpportunityEngine {
  /**
   * Evaluates and normalizes market opportunity scores
   */
  static evaluateMarkets(marketsList, userCostINR = 700) {
    if (!marketsList || !marketsList.length) {
      return this.generateDefaultMarkets(userCostINR);
    }

    // Sort by opportunity score descending
    return [...marketsList].sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0)).map((m, idx) => ({
      ...m,
      rank: idx + 1,
      compositeScore: Math.round(
        ((m.opportunityScore || 80) * 0.4) +
        ((m.estimatedNetMarginPercent || 35) * 0.4) +
        ((100 - (m.competitionLevel === 'High' ? 40 : m.competitionLevel === 'Medium' ? 20 : 5)) * 0.2)
      )
    }));
  }

  static generateDefaultMarkets(costINR) {
    const marketKeys = Object.keys(CONFIG.MARKETS);
    return marketKeys.map((k, idx) => {
      const cfg = CONFIG.MARKETS[k];
      const markupFactor = k === 'USA' ? 4.57 : k === 'UAE' ? 3.14 : k === 'UK' ? 4.14 : 3.8;
      const targetINR = Math.round(costINR * markupFactor);
      const localPrice = Math.round(targetINR * cfg.exchangeRateToINR);

      return {
        code: cfg.code,
        country: cfg.name,
        flag: cfg.flag,
        opportunityScore: k === 'UAE' ? 91 : k === 'USA' ? 86 : k === 'UK' ? 78 : k === 'SINGAPORE' ? 82 : 75,
        rank: idx + 1,
        demandLevel: k === 'UAE' || k === 'USA' ? 'Very High' : 'High',
        competitionLevel: k === 'USA' ? 'High' : k === 'UAE' ? 'Medium' : 'Medium',
        growthRatePercent: k === 'UAE' ? 28.4 : k === 'USA' ? 19.2 : 15.0,
        suggestedLocalPrice: localPrice,
        currency: cfg.currency,
        suggestedPriceINR: targetINR,
        estimatedNetMarginPercent: k === 'UAE' ? 44.5 : k === 'USA' ? 38.2 : 36.0,
        recommendedPlatform: cfg.primaryPlatforms.join(' / '),
        keyAdvantage: `Strong purchasing power in ${cfg.name} with ${cfg.marketMaturity}.`,
        customDutiesEstimatedINR: Math.round(targetINR * cfg.avgCustomDutyRate),
        shippingCostINR: Math.round(cfg.avgShippingPerKgINR * 1.2),
        riskFactor: 'Logistics fulfillment SLA adherence required.'
      };
    }).sort((a, b) => b.opportunityScore - a.opportunityScore);
  }
}
