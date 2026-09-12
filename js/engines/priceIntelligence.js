/**
 * Engine 3: Price Intelligence Engine
 * Cost + competitor prices + fees + shipping assumptions + target margin -> recommended price
 */

import { CONFIG } from '../config.js';

export class PriceIntelligenceEngine {
  /**
   * Computes granular cross-border pricing economics
   */
  static calculatePriceBreakdown({
    costPriceINR = 700,
    domesticPriceINR = 1200,
    weightKg = 1.0,
    marketCode = 'UAE',
    customLocalPrice = null
  }) {
    const market = CONFIG.MARKETS[marketCode] || CONFIG.MARKETS.UAE;
    const cogs = parseFloat(costPriceINR) || 700;
    const domesticPrice = parseFloat(domesticPriceINR) || 1200;
    const weight = parseFloat(weightKg) || 1.0;

    // Shipping cost estimate
    const estimatedShippingINR = Math.round(market.avgShippingPerKgINR * weight);
    
    // International Selling Price in INR
    let sellingPriceINR;
    if (customLocalPrice) {
      // Back-calculate from local currency
      sellingPriceINR = Math.round(customLocalPrice / market.exchangeRateToINR);
    } else {
      // Multiplier benchmark
      const markup = marketCode === 'USA' ? 4.57 : marketCode === 'UAE' ? 3.14 : marketCode === 'UK' ? 4.14 : 3.8;
      sellingPriceINR = Math.round(cogs * markup);
    }

    const localSellingPrice = Math.round(sellingPriceINR * market.exchangeRateToINR);

    // Platform & Payment Processing Fees (~15% Amazon/Noon + 3% Payment Gateway = 18%)
    const platformFeeRate = 0.18;
    const platformFeeINR = Math.round(sellingPriceINR * platformFeeRate);

    // Customs Duty
    const customsDutyINR = Math.round(sellingPriceINR * market.avgCustomDutyRate);

    // Value Added Tax / Sales Tax (absorbed/collected)
    const vatINR = Math.round(sellingPriceINR * market.vatRate);

    // Total Landed & Operational Deductions
    const totalDeductionsINR = cogs + estimatedShippingINR + platformFeeINR + customsDutyINR + vatINR;

    // Net Profit
    const netProfitINR = Math.max(0, sellingPriceINR - totalDeductionsINR);
    const netMarginPercent = parseFloat(((netProfitINR / sellingPriceINR) * 100).toFixed(1));

    // Domestic Baseline Comparison
    const domesticNetProfit = Math.max(0, domesticPrice - cogs - (domesticPrice * 0.12)); // assuming ~12% domestic channel fee
    const domesticMarginPercent = parseFloat(((domesticNetProfit / domesticPrice) * 100).toFixed(1));
    const profitMultiplier = domesticNetProfit > 0 ? (netProfitINR / domesticNetProfit).toFixed(1) : '3.5';

    return {
      marketCode,
      marketName: market.name,
      currency: market.currency,
      symbol: market.symbol,
      exchangeRate: market.exchangeRateToINR,
      localSellingPrice,
      sellingPriceINR,
      cogs,
      estimatedShippingINR,
      platformFeeINR,
      customsDutyINR,
      vatINR,
      totalCostINR: totalDeductionsINR,
      netProfitINR,
      netProfitLocal: Math.round(netProfitINR * market.exchangeRateToINR),
      netMarginPercent,
      domesticPriceINR: domesticPrice,
      domesticNetProfit,
      domesticMarginPercent,
      profitMultiplier,
      leadTime: market.leadTimeDays
    };
  }
}
